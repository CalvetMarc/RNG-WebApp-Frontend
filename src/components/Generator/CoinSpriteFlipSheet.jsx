import React, { useEffect, useRef, useState } from "react";
import { generateRandomValues } from "../../utils/generateRNG";

export default function CoinSpriteFlipSheet({
  sheetSrc,
  msPerFrame = 60,
  cycles = 2,                // animacions base (passades completes del sheet)
  turnsMultiplier = 1,       // 👈 multiplica animacions (2 animacions = 1 volta)
  size = 200,
  headIndex = 0,
  tailIndex = 9,
  onEnd,
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
    return () => clearInterval(timerRef.current);
  }, [sheetSrc, headIndex]);

  const pickSide = async () => {
    const { selected } = await generateRandomValues("RNG1", Date.now(), 0, 1, 1);
    return selected[0] === 0 ? "heads" : "tails";
  };
  const pickDir = async () => {
    const { selected } = await generateRandomValues("RNG1", Date.now() ^ 0x9e3779b9, 0, 1, 1);
    return selected[0] === 0 ? +1 : -1; // +1 cw, -1 ccw
  };

  // Evita arribar a 0° abans d’hora (tanquem just a l’últim pas)
  const quantizeTurnsSafely = (totalDeg) =>
    totalDeg >= 0 ? Math.floor(totalDeg / 360) * 360 : Math.ceil(totalDeg / 360) * 360;

  const play = async () => {
    if (playingRef.current || meta.frames <= 0) return;
    playingRef.current = true;

    const side        = await pickSide();
    const endIndex    = side === "heads" ? headIndex : tailIndex;
    const dir         = await pickDir();

    const FRAMES         = meta.frames;
    const start          = frame;

    // 👇 Nombre d’animacions reals = cycles * turnsMultiplier
    const animations     = Math.max(1, cycles|0) * Math.max(1, turnsMultiplier|0);

    // Passos base (animacions senceres) + alineació fins al frame final
    const baseSteps      = animations * FRAMES;
    const extra          = (endIndex - start + FRAMES) % FRAMES; // 0..FRAMES-1
    const totalSteps     = baseSteps + extra;

    // 🔑 2 animacions = 1 volta → 1 animació = 180°
    // Per frame: 180° / FRAMES (amb signe de la direcció)
    const degPerFrame    = dir * (180 / FRAMES);

    // Angle natural total si no corregíssim res
    const naturalTotal   = degPerFrame * totalSteps;

    // Ajust: forcem que el total sigui múltiple de 360° (≡ 0°) SENSE passar-nos abans de temps
    const targetTotal    = quantizeTurnsSafely(naturalTotal);
    const corrPerStep    = (targetTotal - naturalTotal) / totalSteps;

    let steps = 0;
    let current = start;
    let accAngle = 0;

    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      // avança 1 frame
      current = (current + 1) % FRAMES;
      setFrame(current);

      // suma angle base + correcció distribuïda
      accAngle += degPerFrame + corrPerStep;
      setAngle(accAngle);

      steps += 1;
      if (steps >= totalSteps) {
        clearInterval(timerRef.current);
        // Estat final sincronitzat: frame final i angle = 0°
        setFrame(endIndex);
        setAngle(0);
        playingRef.current = false;
        onEnd && onEnd(side);
      }
    }, msPerFrame);
  };

  // viewport 150x150 que rota; el sheet es veu per backgroundPosition (arrodonit)
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
