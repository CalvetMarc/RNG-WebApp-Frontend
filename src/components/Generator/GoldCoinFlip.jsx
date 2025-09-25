import { useRef, useState, useEffect } from "react";

// rutes robustes (new URL evita problemes amb relatius)
const gold = {
  f1:  new URL("../../assets/coins/goldcoin-frame1.png", import.meta.url).href,
  f2:  new URL("../../assets/coins/goldcoin-frame2.png", import.meta.url).href,
  f3:  new URL("../../assets/coins/goldcoin-frame3.png", import.meta.url).href,
  f4:  new URL("../../assets/coins/goldcoin-frame4.png", import.meta.url).href,
  f5:  new URL("../../assets/coins/goldcoin-frame5.png", import.meta.url).href,
  f6:  new URL("../../assets/coins/goldcoin-frame6.png", import.meta.url).href,
  heads: new URL("../../assets/coins/goldcoin-frame1-heads.png", import.meta.url).href,
  tails: new URL("../../assets/coins/goldcoin-frame1-tails.png", import.meta.url).href,
};

const FRAMES = [gold.f1, gold.f2, gold.f3, gold.f4, gold.f5, gold.f6];

export default function GoldCoinFlip({
  size = 160,          // mida del <img> (px)
  msPerFrame = 60,     // velocitat
  cycles = 2,          // quantes voltes fa abans d’aturar-se
  result = "random",   // "heads" | "tails" | "random"
  onEnd,               // callback(resultat)
}) {
  const [src, setSrc] = useState(gold.heads);  // estat inicial visible
  const playingRef = useRef(false);
  const timerRef = useRef(null);

  // pre-carrega tots els frames per evitar parpelleigs
  useEffect(() => {
    [...FRAMES, gold.heads, gold.tails].forEach((u) => {
      const img = new Image();
      img.src = u;
    });
    return () => clearInterval(timerRef.current);
  }, []);

  const pickResult = () => {
    if (result === "random") return Math.random() < 0.5 ? "heads" : "tails";
    return result === "heads" ? "heads" : "tails";
  };

  const play = () => {
    if (playingRef.current) return;        // evita doble clic
    playingRef.current = true;

    const finalSide = pickResult();        // decideix resultat
    const totalSteps = cycles * FRAMES.length;

    let step = 0;
    timerRef.current = setInterval(() => {
      // avança frames en bucle
      setSrc(FRAMES[step % FRAMES.length]);
      step++;

      if (step >= totalSteps) {
        // posa el frame final i para
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
