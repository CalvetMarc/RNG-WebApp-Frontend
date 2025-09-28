import { useEffect, useRef, useState } from 'react';
import { generateRandomValues } from '../../utils/generateRNG';

import machineBase        from '../../assets/slot/slot-machine4.png';
import machineLeverActive from '../../assets/slot/slot-machine3.png';
import machineLeverIdle   from '../../assets/slot/slot-machine2.png';
import machineRails       from '../../assets/slot/slot-machine5.png';

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

const STRIP0 = [0, 1, 2, 3];
const STRIP1 = [0, 2, 1, 3];
const STRIP2 = [2, 0, 3, 1];
const STRIPS = [STRIP0, STRIP1, STRIP2];

const mod = (n, m) => ((n % m) + m) % m;

export default function Slot({ onStart, onEnd, size = 320 }) {
  const [reelTop, setReelTop] = useState([0, 1, 2]);
  const [isSpinning, setIsSpinning] = useState(false);

  const animRef = useRef(null);
  const startRef = useRef(0);
  const fromTopRef = useRef([0, 0, 0]);
  const targetTopRef = useRef([0, 0, 0]);

  // timings base de parada seqüencial
  const reelDurMs = useRef([1100, 1500, 1900]);

  // feel
  const baseRevPerSec = 7;
  const minSpinRounds = 2;
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  // NEW: settle frames (evita parar just després d’un tick)
  const settleRef = useRef([0, 0, 0]);      // frames consecutius al target per rodet
  const SETTLE_FRAMES = 1;                  // prova 1–2 per més robustesa
  const EPS_MS = 20;                        // petit marge extra de temps

  const visibleGrid = (() => {
    const col0 = [0, 1, 2].map(r => STRIPS[0][mod(reelTop[0] + r, STRIPS[0].length)]);
    const col1 = [0, 1, 2].map(r => STRIPS[1][mod(reelTop[1] + r, STRIPS[1].length)]);
    const col2 = [0, 1, 2].map(r => STRIPS[2][mod(reelTop[2] + r, STRIPS[2].length)]);
    return [
      col0[0], col1[0], col2[0],
      col0[1], col1[1], col2[1],
      col0[2], col1[2], col2[2],
    ];
  })();

  const pull = async () => {
    if (isSpinning) return;

    setIsSpinning(true);
    onStart?.('...');

    // objectiu final per a cada rodet (0..len-1)
    const { selected } = await generateRandomValues('RNG1', Date.now(), 0, 3, 3);
    const targetTop = [selected[0] | 0, selected[1] | 0, selected[2] | 0];
    targetTopRef.current = targetTop;

    // durades d'aquesta tirada
    const durMsThisSpin = [...reelDurMs.current];

    // si col 1 i 2 tindran un 7 al mig, allarga una mica col 3
    {
      const stripLen0 = STRIPS[0].length;
      const stripLen1 = STRIPS[1].length;
      const mid0 = STRIPS[0][(targetTop[0] + 1) % stripLen0];
      const mid1 = STRIPS[1][(targetTop[1] + 1) % stripLen1];
      if (mid0 === 1 && mid1 === 1) {
        const factor = 1.7 + Math.random() * 0.8;
        durMsThisSpin[2] = Math.round(durMsThisSpin[2] * factor);
      }
    }

    // snapshot i temps
    fromTopRef.current = reelTop.slice();
    startRef.current = performance.now();

    // NEW: reset del settle
    settleRef.current = [0, 0, 0];

    cancelAnimationFrame(animRef.current);
    const loop = (now) => {
      const dt = Math.max(0, now - startRef.current);
      const next = [0, 0, 0];

      for (let i = 0; i < 3; i++) {
        const stripLen = STRIPS[i].length;
        const dur = durMsThisSpin[i];
        const raw = Math.min(1, dt / dur);

        if (raw < 1) {
          const spinsSymbols = baseRevPerSec * (dt / 1000) * stripLen;
          const guaranteed = minSpinRounds * stripLen;
          const eased = easeOut(raw);
          const startIdx = fromTopRef.current[i];
          const endIdx = targetTopRef.current[i];
          const fastDelta = Math.floor(guaranteed + spinsSymbols);
          const forwardDist = mod(endIdx - startIdx, stripLen);
          const easedDelta = Math.floor(forwardDist * eased);
          next[i] = mod(startIdx + fastDelta + easedDelta, stripLen);
        } else {
          next[i] = targetTopRef.current[i];
        }
      }

      // NEW: compta frames consecutius al target per rodet
      for (let i = 0; i < 3; i++) {
        if (next[i] === targetTopRef.current[i]) {
          settleRef.current[i] = Math.min(SETTLE_FRAMES, settleRef.current[i] + 1);
        } else {
          settleRef.current[i] = 0;
        }
      }

      setReelTop(next);

      // NEW: condició de final robusta
      const allDoneTime = dt >= (Math.max(...durMsThisSpin) + EPS_MS);
      const allSettled  = settleRef.current.every(fr => fr >= SETTLE_FRAMES);

      if (allDoneTime && allSettled) {
        const finalTop = targetTopRef.current.slice();
        setReelTop(finalTop);
        setIsSpinning(false);

        // Resultat fila central
        const mids = [0, 1, 2].map((i) => {
          const strip = STRIPS[i];
          const top = finalTop[i];
          return strip[(top + 1) % strip.length];
        });

        let resultText = 'Loss';
        const same = (v) => mids.every((x) => x === v);
        if (same(3)) resultText = 'Gum Win';          // BAR BAR BAR
        else if (same(1)) resultText = 'Jackpot Win'; // 7 7 7
        else if (same(0) || same(2)) resultText = 'Win'; // CHERRY×3 o BELL×3

        onEnd?.(resultText, mids);
      } else {
        animRef.current = requestAnimationFrame(loop);
      }
    };

    animRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => () => cancelAnimationFrame(animRef.current), []);

  // escala/offset visuals (es queda igual que tens)
  const wrapperWidth = `${(size / 320) * 120}%`;
  const translateX = '-12%';

  return (
    <div
      className="relative mx-auto w-full overflow-x-hidden"
      style={{ maxWidth: `${size}px`, overscrollBehaviorX: 'none' }}
    >
      <div
        className="relative mx-auto overflow-hidden"
        aria-label="Slot machine"
        style={{ width: wrapperWidth, touchAction: 'pan-y' }}
      >
        {/* Rails */}
        <img
          src={machineRails}
          alt=""
          draggable={false}
          className="absolute inset-0 z-10 pointer-events-none h-auto"
          style={{ width: '100%', transform: `translateX(${translateX})` }}
        />

        {/* Grid 3×3 */}
        <div
          className="absolute z-20 grid place-items-center"
          style={{
            top: '38.5%',
            left: '38.6%',
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

        {/* Base amb outline */}
        <img
          src={machineBase}
          alt=""
          draggable={false}
          className="relative z-30 block pointer-events-none h-auto filter
                     [filter:drop-shadow(2px_0_0_#000)_drop-shadow(-2px_0_0_#000)_drop-shadow(0_2px_0_#000)_drop-shadow(0_-2px_0_#000)]"
          style={{ width: '100%', transform: `translateX(${translateX})` }}
        />

        {/* Palanca: activa quan gira */}
        <img
          src={isSpinning ? machineLeverActive : machineLeverIdle}
          alt="Slot lever"
          draggable={false}
          className="absolute inset-0 z-40 pointer-events-none h-auto"
          style={{ width: '100%', transform: `translateX(${translateX})` }}
        />

        {/* Botó palanca */}
        {!isSpinning && (
          <button
            onClick={pull}
            className="button4 absolute inset-0 m-auto z-50 select-none !border-none
                       focus:outline-none focus:ring-0 cursor-pointer !text-[#cddde2]"
            style={{
              top: '27%',
              left: '66.1%',
              width: '14%',
              height: '18%',
              transform: 'translate(-50%, -50%)',
              background: 'transparent',
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
        )}
      </div>
    </div>
  );
}
