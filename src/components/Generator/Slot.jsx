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

// Tira (strip) per rodet — personalitzables
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

  // paràmetres de “feel”
  const baseRevPerSec = 7;
  const minSpinRounds = 2;

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  // Deriva la graella 3×3 a partir dels tops
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

    // 1) objectiu final per a cada rodet (0..len-1)
    const { selected } = await generateRandomValues('RNG1', Date.now(), 0, 3, 3);
    const targetTop = [selected[0] | 0, selected[1] | 0, selected[2] | 0];
    targetTopRef.current = targetTop;

    // 🔹 Durades d'aquesta tirada (còpia local per no tocar les base)
    const durMsThisSpin = [...reelDurMs.current];

    // 🔹 Si col 1 i col 2 tindran un 7 al MIG, allarguem col 3 un 30–50%
    {
      const stripLen0 = STRIPS[0].length;
      const stripLen1 = STRIPS[1].length;

      const mid0 = STRIPS[0][(targetTop[0] + 1) % stripLen0]; // símbol mig col 1
      const mid1 = STRIPS[1][(targetTop[1] + 1) % stripLen1]; // símbol mig col 2

      if (mid0 === 1 && mid1 === 1) { // 7 és index 1
        const factor = 1.7 + Math.random() * 0.8; // [1.3, 1.5)
        durMsThisSpin[2] = Math.round(durMsThisSpin[2] * factor);
      }
    }

    // 2) snapshot i temps
    fromTopRef.current = reelTop.slice();
    startRef.current = performance.now();

    // 3) animació
    cancelAnimationFrame(animRef.current);
    const loop = (now) => {
      const dt = Math.max(0, now - startRef.current);
      const next = [0, 0, 0];

      for (let i = 0; i < 3; i++) {
        const stripLen = STRIPS[i].length;
        const dur = durMsThisSpin[i];          // 🔹 usa la durada local d'aquesta tirada
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

      setReelTop(next);

      if (dt < Math.max(...durMsThisSpin)) {   // 🔹 condició amb durades locals
        animRef.current = requestAnimationFrame(loop);
      } else {
        // final
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
      }
    };

    animRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => () => cancelAnimationFrame(animRef.current), []);

  // escalar tot el bloc (amplada relativa)
  const wrapperWidth = `${(size / 320) * 120}%`; // 120% base → escalar amb size
  const translateX = '-10%';

  return (
    <div className="relative mx-auto w-full">
      <div className="relative mx-auto overflow-hidden" aria-label="Slot machine"
           style={{ width: wrapperWidth }}>
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

        {/* Base amb outline (només slot-machine4.png) */}
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

        {/* Botó palanca (només quan NO gira) */}
        {!isSpinning && (
          <button
            onClick={pull}
            className="button4 absolute inset-0 m-auto z-50 select-none !border-none
                       focus:outline-none focus:ring-0 cursor-pointer !text-[#cddde2]"
            style={{
              top: '27%',
              left: '69.8%',
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
