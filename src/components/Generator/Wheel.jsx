import React, { useEffect, useMemo, useRef, useState } from "react";
import { generateRandomValues } from "../../utils/generateRNG";

// Helpers geom
const toRad = (deg) => (deg * Math.PI) / 180;
const normalize = (deg) => ((deg % 360) + 360) % 360;
function polar(r, angleDeg, cx, cy) {
  const a = toRad(angleDeg);
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}
function arcPath(cx, cy, r, a0, a1) {
  const [x0, y0] = polar(r, a0, cx, cy);
  const [x1, y1] = polar(r, a1, cx, cy);
  const large = a1 - a0 <= 180 ? 0 : 1;
  return `M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`;
}

// 0° = dreta (horari). TOP és -90°.
// Si el triangle el tens “girant”, deixa aquest valor a -90 igualment (apunta al TOP visual).
const POINTER_DEG = -90;

export default function Wheel({
  size = 260,
  minItems = 2,
  maxItems = 10,
  onEnd, // (label: string, index: number)
}) {
  const [items, setItems] = useState(["Option 1", "Option 2", "Option 3"]);
  const [spinning, setSpinning] = useState(false);
  const [resultIdx, setResultIdx] = useState(null);

  // rotació acumulada (0° = dreta; -90° = dalt)
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef(null);

  const n = items.length;
  const slice = 360 / n;
  const r = size / 2;
  const cx = r, cy = r;

  const colors = useMemo(
    () => Array.from({ length: n }, (_, i) => `hsl(${(i * 360) / n}, 70%, 60%)`),
    [n]
  );

  // RNG index
  const pickIndex = async () => {
    try {
      let seed;
      try {
        const buf = new Uint32Array(1);
        crypto.getRandomValues(buf);
        seed = buf[0] >>> 0;
      } catch {
        seed = (Date.now() ^ (performance.now() * 1000) ^ (Math.random() * 1e9)) >>> 0;
      }
      const { selected } = await generateRandomValues("RNG1", seed, 0, n - 1, 1);
      return selected[0] | 0;
    } catch {
      return Math.floor(Math.random() * n);
    }
  };

  // SPIN (amb marge per evitar fronteres)
  const spin = async () => {
    if (spinning || n < minItems) return;
    setSpinning(true);

    const idx = await pickIndex(); // 0..n-1
    const centerAngle = (idx + 0.5) * slice;

    // marge mínim a cada vora del sector (mai toquem frontera)
    const MARGIN = Math.min(6, slice * 0.2);      // 6° o 20% del sector
    const span = Math.max(0, slice / 2 - MARGIN); // rang des del centre
    const offset = (Math.random() * 2 - 1) * span; // [-span, +span]

    // angle objectiu (centre desplaçat) que ha de quedar sota el punter
    const desiredAngle = centerAngle + offset;

    // quant hem de girar des de la rotació actual perquè desiredAngle quedi a POINTER_DEG?
    const delta = normalize(POINTER_DEG - desiredAngle - rotation);

    // voltes extra per l’animació
    const extraTurns = 3 + Math.floor(Math.random() * 4); // 3..6
    const target = extraTurns * 360 + delta;
    const finalRot = rotation + target;

    const el = wheelRef.current;
    if (el) {
      el.style.transition = "transform 2.4s cubic-bezier(0.19, 1, 0.22, 1)";
      el.style.transform = `rotate(${finalRot}deg)`;
    }

    const onDone = () => {
      el?.removeEventListener("transitionend", onDone);
      const norm = normalize(finalRot);
      setRotation(norm);

      // ── Detecció geomètrica del sector que queda sota el punter ──
      // Angle del punter dins del sistema de la roda
      const pointerInWheel = normalize(POINTER_DEG - norm);
      // Com els sectors es dibuixen començant a -90°, compensem +90
      const angleFromTop = normalize(pointerInWheel + 90);
      let iFinal = Math.floor(angleFromTop / slice);
      if (iFinal >= n) iFinal = n - 1;

      setSpinning(false);
      setResultIdx(iFinal);
      onEnd && onEnd(items[iFinal], iFinal);

      if (el) el.style.transition = "none";
    };
    el?.addEventListener("transitionend", onDone);
  };

  // CRUD editor
  const addItem = () => {
    if (n >= maxItems) return;
    setItems((prev) => [...prev, `Option ${prev.length + 1}`]);
  };
  const removeItem = (i) => {
    if (n <= minItems) return;
    setItems((prev) => prev.filter((_, idx) => idx !== i));
    setResultIdx(null);
  };
  const updateItem = (i, v) => {
    setItems((prev) => prev.map((x, idx) => (idx === i ? v : x)));
  };

  // mantenim l’angle quan canvien items
  useEffect(() => {
    const el = wheelRef.current;
    if (el) {
      el.style.transition = "none";
      el.style.transform = `rotate(${rotation}deg)`;
    }
  }, [n]); // eslint-disable-line

  return (
    <div className="w-full flex flex-col items-center">
      {/* Wheel */}
      <div className="relative" style={{ width: size, height: size }}>
        {/* punter TOP (triangle cap avall, sense rotate) */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-2 z-20">
          <div
            className="w-0 h-0 border-l-8 border-r-8 border-t-[14px]
                       border-l-transparent border-r-transparent border-t-black"
          />
        </div>

        {/* disc */}
        <svg
          ref={wheelRef}
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="rounded-full shadow-md bg-white"
        >
          {/* sectors */}
          {items.map((label, i) => {
            const a0 = i * slice - 90;
            const a1 = (i + 1) * slice - 90;
            return <path key={i} d={arcPath(cx, cy, r, a0, a1)} fill={colors[i]} />;
          })}

          {/* separadors fins */}
          {items.map((_, i) => {
            const angle = i * slice - 90;
            const [x, y] = polar(r, angle, cx, cy);
            return (
              <line
                key={`s${i}`}
                x1={cx}
                y1={cy}
                x2={x}
                y2={y}
                stroke="white"
                strokeWidth="1"
              />
            );
          })}

          {/* punxes (pegs) a cada frontera cap a fora */}
          {items.map((_, i) => {
            const a = i * slice - 90;
            const pinLen = Math.max(6, size * 0.03);     // llargada
            const pinWdeg = Math.min(8, slice * 0.25);   // amplada angular base
            const [bx1, by1] = polar(r, a - pinWdeg / 2, cx, cy);
            const [bx2, by2] = polar(r, a + pinWdeg / 2, cx, cy);
            const [tx, ty] = polar(r + pinLen, a, cx, cy);
            return (
              <polygon
                key={`peg${i}`}
                points={`${bx1},${by1} ${bx2},${by2} ${tx},${ty}`}
                fill="black"
                opacity="0.85"
              />
            );
          })}

          {/* etiquetes */}
          {items.map((label, i) => {
            const angle = (i + 0.5) * slice - 90;
            const [tx, ty] = polar(r * 0.62, angle, cx, cy);
            return (
              <text
                key={`t${i}`}
                x={tx}
                y={ty}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={Math.max(10, size * 0.055)}
                fill="#111"
                transform={`rotate(${angle + 90}, ${tx}, ${ty})`}
              >
                {label}
              </text>
            );
          })}
        </svg>

        {/* botó central */}
        <button
          type="button"
          onClick={spin}
          disabled={spinning || n < minItems}
          className="absolute inset-0 m-auto rounded-full bg-white border-2 border-black shadow z-10
                     flex items-center justify-center text-sm font-semibold disabled:opacity-50"
          style={{ width: size * 0.28, height: size * 0.28 }}
          aria-label="Spin the wheel"
        >
          {spinning ? "Spinning…" : "SPIN"}
        </button>
      </div>

      {/* resultat */}
      <p className="mt-4 text-center text-gray-800">
        Result:{" "}
        <span className="font-semibold">
          {resultIdx == null ? "—" : items[resultIdx]}
        </span>
      </p>

      {/* editor de seccions */}
      <div className="mt-6 w-full max-w-[520px]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">
            Sections: {n} (min {minItems}, max {maxItems})
          </span>
          <button
            type="button"
            onClick={addItem}
            disabled={n >= maxItems}
            className="px-3 py-1 rounded bg-black text-white text-sm disabled:opacity-40"
          >
            + Add
          </button>
        </div>
        <div className="space-y-2">
          {items.map((val, i) => (
            <div key={i} className="flex gap-2">
              <input
                className="flex-1 rounded border border-gray-500 px-3 py-2 text-sm text-gray-700"
                value={val}
                onChange={(e) => updateItem(i, e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeItem(i)}
                disabled={n <= minItems}
                className="px-3 py-2 rounded border text-sm disabled:opacity-40"
                title="Remove section"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
