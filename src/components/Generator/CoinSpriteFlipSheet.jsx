import React, { useEffect, useRef, useState } from "react";
import { generateRandomValues } from "../../utils/generateRNG";

export default function CoinSpriteFlipSheet({
  sheetSrc,
  msPerFrame = 60,          // valor base (només per fallback)
  cycles = 2,               // animacions base (passades completes del sheet)
  turnsMultiplier = 1,      // 2 animacions = 1 volta → multiplica animacions
  minStepMs = 35,           // 👈 delay mínim per pas (ms)
  maxStepMs = 60,           // 👈 delay màxim per pas (ms)
  size = 200,
  headIndex = 0,
  tailIndex = 9,
  onEnd,
  onStart,
}) {
  const [meta, setMeta] = useState({ w: 150, h: 0, frames: 18, stepFloat: 0 });
  const [frame, setFrame] = useState(headIndex);
  const [angle, setAngle] = useState(0);

  const playingRef = useRef(false);
  const timerRef   = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const w = img.naturalWidth, h = img.naturalHeight, frames = 18;
      setMeta({ w, h, frames, stepFloat: h / frames });
      setFrame(headIndex);
      setAngle(0);
    };
    img.src = sheetSrc;
    return () => clearTimeout(timerRef.current);
  }, [sheetSrc, headIndex]);

  const pickSide = async () => {
    const { selected } = await generateRandomValues("RNG1", Date.now(), 0, 1, 1);
    return selected[0] === 0 ? "heads" : "tails";
  };
  const pickDir = () => {
    return Math.random() < 0.5 ? +1 : -1; // +1 = clockwise, -1 = counter-clockwise
  };
  

  // 2 animacions = 1 volta ⇒ 1 animació = 180° ⇒ per frame = 180/FRAMES (amb signe)
  const degPerFrameBase = (dir, FRAMES) => dir * (180 / FRAMES);

  // Evitem arribar a 0° abans d'hora: quantitzem a múltiple de 360° sense “passar-nos”
  const quantizeTurnsSafely = (totalDeg) =>
    totalDeg >= 0 ? Math.floor(totalDeg / 360) * 360 : Math.ceil(totalDeg / 360) * 360;

  // delay aleatori per pas (clamp + fallback)
  const nextDelay = () => {
    const a = Math.max(1, Math.min(minStepMs, maxStepMs));
    const b = Math.max(1, Math.max(minStepMs, maxStepMs));
    return a === b ? a : Math.floor(a + Math.random() * (b - a + 1));
  };

  const play = async () => {
    if (playingRef.current || meta.frames <= 0) return;
    playingRef.current = true;

    onStart && onStart();

    const side        = await pickSide();
    const endIndex    = side === "heads" ? headIndex : tailIndex;
    const dir         = await pickDir();

    const FRAMES      = meta.frames;
    const start       = frame;

    const animations  = Math.max(1, cycles|0) * Math.max(1, turnsMultiplier|0);
    const baseSteps   = animations * FRAMES;
    const extra       = (endIndex - start + FRAMES) % FRAMES;
    const totalSteps  = baseSteps + extra;

    const perStep     = degPerFrameBase(dir, FRAMES);
    const naturalTot  = perStep * totalSteps;
    const targetTot   = quantizeTurnsSafely(naturalTot);
    const corrPerStep = (targetTot - naturalTot) / totalSteps;

    let steps = 0;
    let current = start;
    let accAngle = 0;

    const tick = () => {
      // avançar 1 pas
      current = (current + 1) % FRAMES;
      setFrame(current);

      accAngle += perStep + corrPerStep;
      setAngle(accAngle);

      steps += 1;
      if (steps >= totalSteps) {
        // final sincronitzat: frame final + angle 0°
        setFrame(endIndex);
        setAngle(0);
        playingRef.current = false;
        onEnd && onEnd(side);
        return;
      }
      // planifica el següent pas amb delay aleatori
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(tick, nextDelay() || msPerFrame);
    };

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(tick, nextDelay() || msPerFrame);
  };

  const NATIVE = meta.w || 150;
  const scale  = size / NATIVE;
  const yAcc   = Math.round(frame * meta.stepFloat);
  const bgPosY = -yAcc;

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
            backgroundPosition: `0px ${bgPosY}px`,
          }}
        />
      </div>
    </button>
  );
}
