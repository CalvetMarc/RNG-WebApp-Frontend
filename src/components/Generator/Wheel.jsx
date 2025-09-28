import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { generateRandomValues } from "../../utils/generateRNG";
import ScrollBox from "../ScrollBox";

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

const POINTER_DEG = -90;

/* =======================
   Canvas per mesurar text (reutilitzat)
   ======================= */
function useSharedCanvas() {
  const canvasRef = useRef(null);
  if (!canvasRef.current) canvasRef.current = document.createElement("canvas");
  const ctx = canvasRef.current.getContext("2d");
  return ctx;
}

// Mesura text amb la mateixa font real d'un input concret
function measureWithInputFont(ctx, inputEl, text) {
  if (!inputEl) return Infinity;
  const cs = getComputedStyle(inputEl);
  const font = `${cs.fontStyle} ${cs.fontVariant} ${cs.fontWeight} ${cs.fontSize} / ${cs.lineHeight} ${cs.fontFamily}`;
  ctx.font = font;
  return ctx.measureText(text).width;
}

export default function Wheel({
  size = 260,
  minItems = 3,
  maxItems = 10,
  onEnd,
}) {
  const [items, setItems] = useState(["Option 1", "Option 2", "Option 3"]);
  const [spinning, setSpinning] = useState(false);
  const [resultIdx, setResultIdx] = useState(0);

  const angleAccumRef = useRef(0);
  const wheelRef = useRef(null);

  // refs dels inputs per poder calcular amplades reals
  const inputRefs = useRef([]);

  const n = items.length;
  const slice = 360 / n;
  const r = size / 2;
  const cx = r, cy = r;

  const colors = useMemo(
    () => Array.from({ length: n }, (_, i) => `hsl(${(i * 360) / n}, 70%, 60%)`),
    [n]
  );

  // ------- DISPLAY de la ruleta (truncat amb “…” a 0.65·r) -------
  const labelFontPx = useMemo(() => Math.max(10, size * 0.055), [size]);
  const labelCanvasCtx = useSharedCanvas();
  const measureLabel = useCallback(
    (text) => {
      labelCanvasCtx.font = `${labelFontPx}px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"`;
      return labelCanvasCtx.measureText(text).width;
    },
    [labelCanvasCtx, labelFontPx]
  );
  const clampTextToPx = useCallback((text, maxPx, measure) => {
    if (!text) return "";
    const clean = text.replace(/\s+/g, " ").trim();
    if (measure(clean) <= maxPx) return clean;
    const ell = "…";
    const ellW = measure(ell);
    let lo = 0, hi = clean.length;
    while (lo < hi) {
      const mid = ((lo + hi + 1) / 2) | 0;
      const candidate = clean.slice(0, mid);
      if (measure(candidate) + ellW <= maxPx) lo = mid;
      else hi = mid - 1;
    }
    return clean.slice(0, lo) + ell;
  }, []);
  const maxLabelPx = r * 0.65;
  const displayLabels = useMemo(
    () => items.map((t) => clampTextToPx(t, maxLabelPx, measureLabel)),
    [items, maxLabelPx, measureLabel, clampTextToPx]
  );

  // ------- RNG + spin -------
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

  const spin = async () => {
    if (spinning || n < minItems) return;
    setSpinning(true);

    const idx = await pickIndex();
    const centerAngle = (idx + 0.5) * slice;
    const MARGIN = Math.min(6, slice * 0.2);
    const span = Math.max(0, slice / 2 - MARGIN);
    const offset = (Math.random() * 2 - 1) * span;

    const desiredAngle = centerAngle + offset;

    const currentAccum = angleAccumRef.current;
    const currentNorm = normalize(currentAccum);
    const delta = normalize(POINTER_DEG - desiredAngle - currentNorm);

    const MIN_TURNS = 2;
    const extraRandomTurns = Math.floor(Math.random() * 12);
    const totalTurns = MIN_TURNS + extraRandomTurns;

    const totalDeg = totalTurns * 360 + delta;
    const finalAngle = currentAccum + totalDeg;

    const degPerSecond = 520;
    const duration = Math.max(1.2, totalDeg / degPerSecond);

    const el = wheelRef.current;
    if (el) {
      el.style.transition = `transform ${duration}s cubic-bezier(0.19, 1, 0.22, 1)`;
      el.style.transform = `rotate(${finalAngle}deg)`;
    }

    const onDone = () => {
      el?.removeEventListener("transitionend", onDone);
      angleAccumRef.current = finalAngle;

      const norm = normalize(finalAngle);
      const pointerInWheel = normalize(POINTER_DEG - norm);
      const angleFromTop = normalize(pointerInWheel + 90);
      let iFinal = Math.floor(angleFromTop / slice);
      if (iFinal >= n) iFinal = n - 1;

      setSpinning(false);
      setResultIdx(iFinal);
      onEnd && onEnd(items[iFinal], iFinal);
    };
    el?.addEventListener("transitionend", onDone);
  };

  const addItem = () => {
    if (n >= maxItems) return;
    setItems((prev) => [...prev, `Option ${prev.length + 1}`]);
  };

  const removeItem = (i) => {
    if (n <= minItems) return;
    setItems((prev) => prev.filter((_, idx) => idx !== i));
    setResultIdx(null);
  };

  /* =======================
     IMP: Limitar el text dels inputs a l’ample visible
     ======================= */
  const inputCanvasCtx = useSharedCanvas();

  const clampToFitInput = useCallback(
    (text, i) => {
      const el = inputRefs.current[i];
      if (!el) return text;

      const cs = getComputedStyle(el);
      const padL = parseFloat(cs.paddingLeft) || 0;
      const padR = parseFloat(cs.paddingRight) || 0;
      const borderL = parseFloat(cs.borderLeftWidth) || 0;
      const borderR = parseFloat(cs.borderRightWidth) || 0;

      const maxPx = el.clientWidth - padL - padR - borderL - borderR - 2;

      const clean = text.replace(/\s+/g, " ");
      if (measureWithInputFont(inputCanvasCtx, el, clean) <= maxPx) return clean;

      let lo = 0, hi = clean.length;
      while (lo < hi) {
        const mid = ((lo + hi + 1) / 2) | 0;
        const candidate = clean.slice(0, mid);
        if (measureWithInputFont(inputCanvasCtx, el, candidate) <= maxPx) lo = mid;
        else hi = mid - 1;
      }
      return clean.slice(0, lo);
    },
    [inputCanvasCtx]
  );

  const handleChange = useCallback(
    (i, raw) => {
      const next = clampToFitInput(raw, i);
      setItems((prev) => prev.map((x, idx) => (idx === i ? next : x)));
    },
    [clampToFitInput]
  );

  useEffect(() => {
    const onResize = () => {
      setItems((prev) => prev.map((txt, i) => clampToFitInput(txt, i)));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [clampToFitInput]);

  useEffect(() => {
    const el = wheelRef.current;
    if (el) {
      el.style.transition = "none";
      el.style.transform = `rotate(${angleAccumRef.current}deg)`;
    }
  }, [n]);

  // >>> Inicialitzar perquè el punter apunti al centre d'"Option 1"
  const initializedRef = useRef(false);
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const slice0 = 360 / items.length;               // a l'inici
    const initialAngle = -(0.5 * slice0);            // centre del primer segment

    angleAccumRef.current = initialAngle;

    const el = wheelRef.current;
    if (el) {
      el.style.transition = "none";
      el.style.transform = `rotate(${initialAngle}deg)`;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const MAX_VISIBLE_ROWS = 3;
  const ROW_H = 44;
  const GAP = 8;
  const editorMaxH = MAX_VISIBLE_ROWS * ROW_H + (MAX_VISIBLE_ROWS - 1) * GAP;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Wheel */}
      <div className="relative" style={{ width: size, height: size }}>
        <div className="absolute left-1/2 -translate-x-1/2 -top-2 z-20">
          <div className="w-0 h-0 border-l-8 border-r-8 border-t-[14px] border-l-transparent border-r-transparent border-t-black" />
        </div>

        <svg
          ref={wheelRef}
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="rounded-full"
          style={{ shapeRendering: 'geometricPrecision', textRendering: 'optimizeLegibility' }}
        >
          {items.map((_, i) => {
            const a0 = i * slice - 90;
            const a1 = (i + 1) * slice - 90;
            return <path key={i} d={arcPath(cx, cy, r, a0, a1)} fill={colors[i]} />;
          })}

          {items.map((_, i) => {
            const angle = i * slice - 90;
            const [x, y] = polar(r, angle, cx, cy);
            return <line key={`s${i}`} x1={cx} y1={cy} x2={x} y2={y} stroke="white" strokeWidth="1" />;
          })}

          {items.map((_, i) => {
            const angle = (i + 0.5) * slice - 90;
            const [tx, ty] = polar(r * 0.62, angle, cx, cy);
            return (
              <text
                key={`t${i}`}
                x={tx}
                y={ty}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={labelFontPx}
                fill="#111"
                transform={`rotate(${angle}, ${tx}, ${ty})`}
              >
                {displayLabels[i]}
              </text>
            );
          })}
        </svg>

        <button
          type="button"
          onClick={spin}
          disabled={spinning || n < minItems}
          className="button4 absolute inset-0 m-auto z-10 select-none"
          style={{ "--btn4-size": `${size * 0.28}px` }}
          aria-label="Spin the wheel"
        >
          SPIN
        </button>
      </div>

      {/* Result */}
      <p className="mt-4 text-center text-gray-800">
        Result: <span className="font-semibold">{spinning ? "..." : (resultIdx == null ? "—" : items[resultIdx])}</span>
      </p>

      {/* Sections editor */}
      <div className="mt-6 w-full max-w-[520px] space-y-4">
        {/* Header card */}
        <div className="flex items-center justify-between bg-[#8da2a8] rounded-md px-3 py-2">
          <span className="text-sm text-gray-700">
            Sections: {n} (min {minItems}, max {maxItems})
          </span>
          <button
            type="button"
            onClick={addItem}
            disabled={spinning || n >= maxItems}
            aria-disabled={spinning || n >= maxItems}
            title={
              n >= maxItems ? `Màxim ${maxItems} seccions` : spinning ? "Spinning..." : "Afegir secció"
            }
            className="px-3 py-1 rounded bg-black text-white text-sm
                       disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none
                       disabled:hover:bg-black"
          >
            + Add
          </button>
        </div>

        {/* List + scrollbar card */}
        <div className="bg-[#8da2a8] rounded-md p-3">
          <ScrollBox height={editorMaxH} bottomPad={n > 3 ? 2 : 0}>
            <div className="flex flex-col gap-2 pr-3">
              {items.map((val, i) => (
                <div key={i} className="grid grid-cols-[1fr_auto] items-center gap-2">
                  <input
                    ref={(el) => (inputRefs.current[i] = el)}
                    className="w-full rounded border-2 border-gray-600 bg-[#7d8e94] px-3 py-2 
                               text-sm text-gray-700 focus:outline-none focus:ring-0"
                    value={val}
                    onChange={(e) => handleChange(i, e.target.value)}
                    disabled={spinning}
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(i)}
                    disabled={spinning || n <= minItems}
                    className="px-3 py-2 rounded border bg-black text-white text-sm
                               disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </ScrollBox>
        </div>
      </div>
    </div>
  );
}
