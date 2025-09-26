import React, { useEffect, useRef, useState } from "react";
import { generateRandomValues } from "../../utils/generateRNG";

export default function CoinSpriteFlipSheet({
  sheetSrc,
  msPerFrame = 60,
  cycles = 2,              // # passades senceres del sprite
  size = 200,
  headIndex = 0,           // HEADS
  tailIndex = 9,           // TAILS
  turnsPerAnimation = 1,   // voltes completes per passada (pot ser 0.5, 2, ...)
  onEnd,
}) {
  const [meta, setMeta] = useState({ w: 150, h: 0, frames: 18, stepFloat: 0 });
  const [frame, setFrame] = useState(headIndex);
  const [angle, setAngle] = useState(0);
  const playingRef = useRef(false);
  const timerRef   = useRef(null);
  const dirRef     = useRef(1); // +1 cw, -1 ccw

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const w = img.naturalWidth;     // 150
      const h = img.naturalHeight;    // ~2699
      const frames = 18;
      setMeta({ w, h, frames, stepFloat: h / frames });
      setFrame(headIndex);
      setAngle(0);
    };
    img.src = sheetSrc;
    return () => clearInterval(timerRef.current);
  }, [sheetSrc, headIndex]);

  const pickSide = async () => {
    const { selected } = await generateRandomValues("RNG1", Date.now(), 0, 1, 1);
    return selected[0] === 0 ? "heads" : "tails";
  };
  const pickDir = async () => {
    const { selected } = await generateRandomValues("RNG1", Date.now() ^ 0x9e3779b9, 0, 1, 1);
    return selected[0] === 0 ? +1 : -1;
  };

  // Normalitza l’angle a l’interval (-180, 180] per repartir el tram final
  const normalizeDeg = (a) => {
    let x = ((a + 180) % 360 + 360) % 360 - 180;
    return x === -180 ? 180 : x;
  };

  const play = async () => {
    if (playingRef.current || meta.frames <= 0) return;
    playingRef.current = true;

    const side     = await pickSide();
    const endIndex = side === "heads" ? headIndex : tailIndex;
    dirRef.current = await pickDir();

    const FRAMES = meta.frames;
    const anglePerFrameBase = (360 * turnsPerAnimation * dirRef.current) / FRAMES;

    let current   = frame;
    let stepCount = 0;

    // ---- Passades senceres (cycles * FRAMES) amb angle base
    const baseSteps = Math.max(1, cycles) * FRAMES;

    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      current = (current + 1) % FRAMES;
      setFrame(current);
      setAngle((prev) => prev + anglePerFrameBase);

      if (++stepCount >= baseSteps) {
        clearInterval(timerRef.current);

        // ---- Alineació fins a endIndex amb correcció d’angle a 0°
        const extra = (endIndex - current + FRAMES) % FRAMES; // 0..FRAMES-1

        if (extra === 0) {
          // Ja som al frame final → força angle 0 per no “quedar de costat”
          setAngle(0);
          playingRef.current = false;
          onEnd && onEnd(side);
          return;
        }

        // Angle restant per acabar EXACTAMENT a 0°
        // (prenem l’angle actual i calculem el delta més curt fins a 0)
        let remainingToZero = normalizeDeg(-angle);

        const anglePerFrameAlign = remainingToZero / extra;

        let left = extra;
        timerRef.current = setInterval(() => {
          current = (current + 1) % FRAMES;
          setFrame(current);
          setAngle((prev) => prev + anglePerFrameAlign);

          if (--left <= 0) {
            clearInterval(timerRef.current);
            // Estat final perfecte
            setAngle(0);
            playingRef.current = false;
            onEnd && onEnd(side);
          }
        }, msPerFrame);
      }
    }, msPerFrame);
  };

  // Viewport nadiu i escala
  const NATIVE = meta.w || 150;
  const scale  = size / NATIVE;

  // Posició vertical arrodonida per evitar bleeding
  const yAcc = Math.round(frame * meta.stepFloat);
  const bgPos = `0px ${-yAcc}px`;

  return (
    <button
      onClick={play}
      aria-label="Flip coin (sprite)"
      className="button3 button3--icon"
      style={{ width: size, height: size, display: "inline-block" }}
    >
      <div
        style={{
          width: NATIVE,
          height: NATIVE,
          overflow: "hidden",
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {/* El viewport rota; el sheet es veu via backgroundPosition */}
        <div
          style={{
            width: NATIVE,
            height: NATIVE,
            overflow: "hidden",
            transform: `rotate(${angle}deg)`,
            transformOrigin: "50% 50%",
            willChange: "transform",
            backfaceVisibility: "hidden",
            backgroundImage: `url(${sheetSrc})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: `${meta.w || NATIVE}px ${meta.h || NATIVE}px`,
            backgroundPosition: bgPos,
          }}
        />
      </div>
    </button>
  );
}
