// src/components/Generator/Slot.jsx
import { useEffect, useRef, useState } from 'react';
import { generateRandomValues } from '../../utils/generateRNG';

import machineBase   from '../../assets/slot/slot-machine4.png';
import machineLever  from '../../assets/slot/slot-machine2.png';
import machineRails  from '../../assets/slot/slot-machine5.png';

import sym7      from '../../assets/slot/slot-symbol1.png';
import symCherry from '../../assets/slot/slot-symbol2.png';
import symBell   from '../../assets/slot/slot-symbol3.png';
import symBar    from '../../assets/slot/slot-symbol4.png';

const SYMBOLS = [
  { key: 'CHERRY', img: symCherry }, // 0
  { key: '7',      img: sym7      }, // 1
  { key: 'BELL',   img: symBell   }, // 2
  { key: 'BAR',    img: symBar    }, // 3
];

// A simple circular strip for each reel (you can customize per-reel if you want)
const STRIP0 = [0, 1, 2, 3];
const STRIP1 = [0, 2, 1, 3]; // example: slightly different order for variety
const STRIP2 = [1, 0, 3, 2];
const STRIPS = [STRIP0, STRIP1, STRIP2];

function mod(n, m) { return ((n % m) + m) % m; }

export default function Slot() {
  // Each reel state is "top index" (integer 0..len-1) telling which symbol is at the top row
  const [reelTop, setReelTop] = useState([0, 1, 2]); // starting positions
  const [isSpinning, setIsSpinning] = useState(false);

  // Animation bookkeeping
  const animRef = useRef(null);
  const startRef = useRef(0);
  const fromTopRef = useRef([0, 0, 0]);
  const targetTopRef = useRef([0, 0, 0]);

  // Reel durations (stop one-by-one for drama)
  const reelDurMs = useRef([1100, 1500, 1900]); // per-reel stop times (ms)

  // Speed parameters (tweak for feel)
  const baseRevPerSec = 7;   // how many symbols per second at t=0
  const minSpinRounds = 2;   // guaranteed full rounds before ease snaps

  // Easing: smoothstep 0..1
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  // Build a visible 3×3 from reelTop & strips
  const visibleGrid = (() => {
    // For each column, take 3 consecutive items from its strip starting at reelTop[col]
    const col0 = [0, 1, 2].map(r => STRIPS[0][mod(reelTop[0] + r, STRIPS[0].length)]);
    const col1 = [0, 1, 2].map(r => STRIPS[1][mod(reelTop[1] + r, STRIPS[1].length)]);
    const col2 = [0, 1, 2].map(r => STRIPS[2][mod(reelTop[2] + r, STRIPS[2].length)]);
    // Flatten to row-major [r0c0,r0c1,r0c2, r1c0,r1c1,r1c2, r2c0,r2c1,r2c2]
    return [
      col0[0], col1[0], col2[0],
      col0[1], col1[1], col2[1],
      col0[2], col1[2], col2[2],
    ];
  })();

  const pull = async () => {
    if (isSpinning) return;

    setIsSpinning(true);

    // 1) Choose *final* top-index for each reel with your RNG
    //    We just need 3 numbers in [0..stripLen-1].
    const { selected } = await generateRandomValues('RNG1', Date.now(), 0, 3, 3);
    const targetTop = [selected[0] | 0, selected[1] | 0, selected[2] | 0];
    targetTopRef.current = targetTop;

    // 2) Snapshot starts
    fromTopRef.current = reelTop.slice();
    startRef.current = performance.now();

    // 3) Run RAF loop
    cancelAnimationFrame(animRef.current);
    const loop = (now) => {
      const t0 = startRef.current;
      const dt = Math.max(0, now - t0);

      // Compute new top indexes for each reel
      const next = [0, 0, 0];

      for (let i = 0; i < 3; i++) {
        const stripLen = STRIPS[i].length;
        const dur = reelDurMs.current[i];
        const raw = Math.min(1, dt / dur);

        if (raw < 1) {
          // While spinning: do at least minSpinRounds full cycles, then ease to target
          // total spins in symbols = baseSpeed * time (in seconds)
          const spinsSymbols = baseRevPerSec * (dt / 1000) * stripLen;
          const guaranteed = minSpinRounds * stripLen;

          // Blend from fast spin towards the exact target using easing
          const eased = easeOut(raw);

          const startIdx = fromTopRef.current[i];
          const endIdx = targetTopRef.current[i];

          // A: fast spinning component
          const fastDelta = Math.floor(guaranteed + spinsSymbols);

          // B: easing towards final delta (shortest forward distance)
          const forwardDist = mod(endIdx - startIdx, stripLen);
          const easedDelta = Math.floor(forwardDist * eased);

          next[i] = mod(startIdx + fastDelta + easedDelta, stripLen);
        } else {
          // Stopped: snap to target
          next[i] = targetTopRef.current[i];
        }
      }

      setReelTop(next);

      // Keep looping until the last reel has reached its duration
      if (dt < Math.max(...reelDurMs.current)) {
        animRef.current = requestAnimationFrame(loop);
      } else {
        // Final snap & done
        setReelTop(targetTopRef.current.slice());
        setIsSpinning(false);
      }
    };

    animRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div className="relative mx-auto w-full">
      <div className="relative mx-auto overflow-hidden w-[120%]" aria-label="Slot machine">
        {/* Rails background */}
        <img
          src={machineRails}
          alt=""
          draggable={false}
          className="absolute inset-0 z-10 pointer-events-none w-[120%] -translate-x-[10%] h-auto"
        />

        {/* Grid de símbols 3×3 (driven by reelTop animation) */}
        <div
          className="absolute z-20 grid place-items-center"
          style={{
            top: '38.5%',
            left: '40.6%',
            width: '43%',
            height: '15%',
            transform: 'translate(-50%, -50%)',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridTemplateRows: 'repeat(3, 1fr)',
            columnGap: '12%',
            rowGap: '25%',
          }}
        >
          {visibleGrid.map((symIdx, i) => (
            <img
              key={i}
              src={SYMBOLS[symIdx].img}
              alt={SYMBOLS[symIdx].key}
              className="w-full h-auto block select-none pointer-events-none"
              draggable={false}
            />
          ))}
        </div>

        {/* Base */}
        <img
          src={machineBase}
          alt=""
          draggable={false}
          className="relative z-30 block pointer-events-none w-[120%] -translate-x-[10%] h-auto"
        />

        {/* Palanca */}
        <img
          src={machineLever}
          alt="Slot lever"
          draggable={false}
          className="absolute inset-0 z-40 pointer-events-none w-[120%] -translate-x-[10%] h-auto"
        />

        {/* Botó palanca */}
        <button
          onClick={pull}
          disabled={isSpinning}
          className="button4 absolute inset-0 m-auto z-50 select-none !border-none focus:outline-none focus:ring-0 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            top: '27%',
            left: '69.8%',
            width: '14%',
            height: '18%',
            transform: 'translate(-50%, -50%)',
            background: 'transparent',
            cursor: 'pointer',
            border: 'none',
            outline: 'none',
            boxShadow: 'none',
            WebkitAppearance: 'none',
            appearance: 'none',
            WebkitTapHighlightColor: 'transparent',
          }}
          aria-label="Pull the lever"
        >
          Pull
        </button>
      </div>
    </div>
  );
}
