import React, { useRef, useState, useEffect } from "react";
import { generateRandomValues } from "../../utils/generateRNG";

// rutes robustes
const gold = {
  f1: new URL("../../assets/coins/goldcoin-frame1.png", import.meta.url).href,
  f2: new URL("../../assets/coins/goldcoin-frame2.png", import.meta.url).href,
  f3: new URL("../../assets/coins/goldcoin-frame3.png", import.meta.url).href,
  f4: new URL("../../assets/coins/goldcoin-frame4.png", import.meta.url).href,
  f5: new URL("../../assets/coins/goldcoin-frame5.png", import.meta.url).href,
  f6: new URL("../../assets/coins/goldcoin-frame6.png", import.meta.url).href,
  heads: new URL("../../assets/coins/goldcoin-frame1-heads.png", import.meta.url).href,
  tails: new URL("../../assets/coins/goldcoin-frame1-tails.png", import.meta.url).href,
};

const FRAMES = [gold.f1, gold.f2, gold.f3, gold.f4, gold.f5, gold.f6];

export default function GoldCoinFlip({
  size = 160,
  msPerFrame = 60,
  cycles = 2,
  result = "random", // "heads" | "tails" | "random"
  onEnd,
}) {
  const [src, setSrc] = useState(gold.heads);
  const playingRef = useRef(false);
  const timerRef = useRef(null);

  // pre-carrega imatges
  useEffect(() => {
    [...FRAMES, gold.heads, gold.tails].forEach((u) => {
      const img = new Image();
      img.src = u;
    });
    return () => clearInterval(timerRef.current);
  }, []);

  const pickResult = async () => {
    if (result === "random") {
      // 👇 sempre PCG32
      const { selected } = await generateRandomValues("RNG1", Date.now(), 0, 1, 1);
      return selected[0] === 0 ? "heads" : "tails";
    }
    return result === "heads" ? "heads" : "tails";
  };

  const play = async () => {
    if (playingRef.current) return;
    playingRef.current = true;

    const finalSide = await pickResult();
    const totalSteps = cycles * FRAMES.length;

    let step = 0;
    timerRef.current = setInterval(() => {
      setSrc(FRAMES[step % FRAMES.length]);
      step++;

      if (step >= totalSteps) {
        clearInterval(timerRef.current);
        const finalSrc = finalSide === "heads" ? gold.heads : gold.tails;
        setSrc(finalSrc);
        playingRef.current = false;
        onEnd && onEnd(finalSide);
      }
    }, msPerFrame);
  };

  return (
    <button className="button3 button3--icon" onClick={play} aria-label="Flip coin">
      <img src={src} alt="coin" width={size} height={size} draggable="false" />
    </button>
  );
}
