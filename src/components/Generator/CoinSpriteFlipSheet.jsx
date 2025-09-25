import React, { useEffect, useRef, useState } from "react";
import { generateRandomValues } from "../../utils/generateRNG";

export default function CoinSpriteFlipSheet({
  sheetSrc,
  msPerFrame = 60,
  cycles = 2,
  size = 200,     // mida visual final (px)
  headIndex = 0,  // HEADS = frame 0 (el teu “1”)
  tailIndex = 9,  // TAILS = frame 9 (el teu “10”)
  onEnd,
}) {
  // mesures nadiues del sheet i paràmetres calculats
  const [meta, setMeta] = useState({
    w: 150,        // ample nadiu dels frames (px)
    h: 0,          // alçada total del sheet (px)
    frames: 18,    // #frames (ens ho has dit)
    stepFloat: 0,  // h / frames  (≈ 149.944...)
  });

  const [frame, setFrame] = useState(headIndex);
  const playingRef = useRef(false);
  const timerRef   = useRef(null);

  // carrega imatge per saber h real (2699)
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const w = img.naturalWidth;     // 150
      const h = img.naturalHeight;    // 2699
      const frames = 18;              // fixem 18 (la teva tira)
      const stepFloat = h / frames;   // 149.944...
      setMeta({ w, h, frames, stepFloat });
      setFrame(headIndex);
    };
    img.src = sheetSrc;
    return () => clearInterval(timerRef.current);
  }, [sheetSrc, headIndex]);

  const pickSide = async () => {
    const { selected } = await generateRandomValues("RNG1", Date.now(), 0, 1, 1);
    return selected[0] === 0 ? "heads" : "tails";
  };

  const play = async () => {
    if (playingRef.current || meta.frames <= 0) return;
    playingRef.current = true;

    const side = await pickSide();
    const endIndex = side === "heads" ? headIndex : tailIndex;

    // fem girar 'cycles' voltes senceres…
    const baseSteps = Math.max(1, cycles) * meta.frames;

    let step = 0;
    let current = frame; // 👈 portem un comptador local per saber on som exactament

    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      current = (current + 1) % meta.frames;
      setFrame(current);

      if (++step >= baseSteps) {
        clearInterval(timerRef.current);

        // …i ara **alineem** fins al frame final sense saltar
        const extra = (endIndex - current + meta.frames) % meta.frames; // 0..frames-1
        if (extra === 0) {
          // ja hi som
          playingRef.current = false;
          onEnd && onEnd(side);
          return;
        }

        let left = extra;
        timerRef.current = setInterval(() => {
          current = (current + 1) % meta.frames;
          setFrame(current);
          if (--left <= 0) {
            clearInterval(timerRef.current);
            playingRef.current = false;
            onEnd && onEnd(side);
          }
        }, msPerFrame);
      }
    }, msPerFrame);
  };

  // viewport nadiu 150x150 i després escalo
  const NATIVE_FRAME = meta.w;          // 150
  const scale        = size / NATIVE_FRAME;

  // posició vertical acumulada: frame * (h/frames), arrodonida a píxel enter
  const yAcc = Math.round(frame * meta.stepFloat); // 0, 150, 299, 449, 599, ...
  const bgPosY = -yAcc;

  return (
    <button
      onClick={play}
      aria-label="Flip coin (sprite)"
      className="button3 button3--icon"
      style={{ width: size, height: size, display: "inline-block" }}
    >
      {/* Viewport nadiu (150x150) que fa el crop; després s'escala tot el bloc */}
      <div
        style={{
          width: NATIVE_FRAME,
          height: NATIVE_FRAME,
          overflow: "hidden",
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <div
          style={{
            width: NATIVE_FRAME,
            height: meta.h || NATIVE_FRAME,      // 2699
            backgroundImage: `url(${sheetSrc})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: `${meta.w || NATIVE_FRAME}px ${meta.h || NATIVE_FRAME}px`,
            backgroundPosition: `0px ${bgPosY}px`,
          }}
        />
      </div>
    </button>
  );
}
