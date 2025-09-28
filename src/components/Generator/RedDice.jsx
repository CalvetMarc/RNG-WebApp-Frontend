import React, { useRef, useState, useEffect } from "react";
import { generateRandomValues } from "../../utils/generateRNG";

// Helper per construir rutes i números amb zero-padding
const p = (n) => String(n).padStart(2, "0");
const img = (file) => new URL(`../../assets/dice/${file}`, import.meta.url).href;

// 8 frames d’animació
const FRAMES = Array.from({ length: 8 }, (_, i) =>
  img(`twenty_sided_dice_animation_frame_0${i + 1}.png`)
);

// 20 imatges de resultat (1..20)
const RESULTS = Array.from({ length: 20 }, (_, i) =>
  img(`twenty_sided_dice_result_${p(i + 1)}.png`)
);

// Imatge inicial (pots triar, aquí mostrem la cara 20 per defecte)
const INITIAL = RESULTS[19];

export default function RedDice({
  size = 160,
  msPerFrame = 60,
  cycles = 2,
  onStart,
  onEnd,               // (resultNumber: 1..20)
  disableClick = false // per si vols desactivar clic i controlar des de fora
}) {
  const [src, setSrc] = useState(INITIAL);
  const playingRef = useRef(false);
  const timerRef = useRef(null);

  // Pre-càrrega d’imatges
  useEffect(() => {
    [...FRAMES, ...RESULTS].forEach((u) => {
      const im = new Image();
      im.src = u;
    });
    return () => clearInterval(timerRef.current);
  }, []);

  // Escull resultat amb RNG1 (PCG32)
  const pickResult = async () => {
    // interval [1,20], 1 valor
    const { selected } = await generateRandomValues("RNG1", Date.now(), 1, 20, 1);
    return selected[0] | 0; // 1..20
  };

  const play = async () => {
    if (playingRef.current || disableClick) return;
    playingRef.current = true;

    // 🔹 Notifica immediatament que comencem (per mostrar "...")
    onStart && onStart();

    // ja pots calcular el resultat en paral·lel
    const result = await pickResult();     // 1..20
    const totalSteps = Math.max(1, cycles) * FRAMES.length;

    let step = 0;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSrc(FRAMES[step % FRAMES.length]);
      step++;

      if (step >= totalSteps) {
        clearInterval(timerRef.current);
        setSrc(RESULTS[result - 1]);       // index 0..19
        playingRef.current = false;
        onEnd && onEnd(result);
      }
    }, msPerFrame);
  };

  return (
    <button
      onClick={play}
      aria-label="Roll d20"
      disabled={disableClick}
      className="button3 inline-flex items-center justify-center p-0 border-0 bg-transparent focus:outline-none"
    >
      {/* Viewport fix: mida fixa i sense canvis */}
      <div
        style={{ width: size, height: size }}
        className="relative overflow-hidden shrink-0"
      >
        <img
          src={src}
          alt="d20"
          className="absolute inset-0 w-full h-full object-contain block select-none pointer-events-none"
          draggable="false"
        />
      </div>
    </button>
  );
  
}
