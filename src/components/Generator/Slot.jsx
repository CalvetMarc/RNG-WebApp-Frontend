// src/components/Generator/Slot.jsx
import { useState } from 'react';
import { generateRandomValues } from '../../utils/generateRNG';

import machineBase   from '../../assets/slot/slot-machine4.png';
import machineLever  from '../../assets/slot/slot-machine2.png';
import machineRails  from '../../assets/slot/slot-machine5.png';

import sym7      from '../../assets/slot/slot-symbol1.png';
import symCherry from '../../assets/slot/slot-symbol2.png';
import symBell   from '../../assets/slot/slot-symbol3.png';
import symBar    from '../../assets/slot/slot-symbol4.png';

const SYMBOLS = [
  { key: 'CHERRY', img: symCherry },
  { key: '7',      img: sym7      },
  { key: 'BELL',   img: symBell   },
  { key: 'BAR',    img: symBar    },
];

export default function Slot() {
  // grid: 9 valors (0..3) → 3 columnes × 3 files
  const [grid, setGrid] = useState([0,1,2, 1,2,3, 2,3,0]);

  const pull = async () => {
    const { selected } = await generateRandomValues('RNG1', Date.now(), 0, 3, 9);
    setGrid(selected.map(v => v | 0));
  };

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

        {/* Grid de símbols 3×3 */}
        <div
          className="absolute z-20 grid place-items-center"
          style={{
            top: '39%',               // alineació vertical global
            left: '40.6%',            // alineació horitzontal global (centre)
            width: '43%',             // ample total del rail
            height: '15%',            // alçada total del rail
            transform: 'translate(-50%, -50%)',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridTemplateRows: 'repeat(3, 1fr)',
            columnGap: '12%',          // separació entre columnes
            rowGap: '25%',            // separació entre files
          }}
        >
          {grid.map((val, i) => (
            <img
              key={i}
              src={SYMBOLS[val].img}
              alt={SYMBOLS[val].key}
              className="w-full h-auto block"
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
          className="absolute inset-0 m-auto z-50 select-none !border-none focus:outline-none focus:ring-0"
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
