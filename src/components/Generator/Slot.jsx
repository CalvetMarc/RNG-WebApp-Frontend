// src/components/Generator/Slot.jsx
import machineBase   from '../../assets/slot/slot-machine4.png';
import machineLever  from '../../assets/slot/slot-machine2.png';
import machineRails  from '../../assets/slot/slot-machine5.png';

import sym7      from '../../assets/slot/slot-symbol1.png';
import symCherry from '../../assets/slot/slot-symbol2.png';
import symBell   from '../../assets/slot/slot-symbol3.png';

export default function Slot() {
  return (
    <div className="relative mx-auto w-full">
      <div
        className="relative mx-auto overflow-hidden w-[120%]"
        aria-label="Slot machine"
      >
        {/* Rails background (baix de tot) */}
        <img
          src={machineRails}
          alt=""
          draggable={false}
          className="absolute inset-0 z-10 pointer-events-none w-[120%] -translate-x-[10%] h-auto"
        />

        {/* Símbols (al mig) */}
        <div
          className="absolute z-20 flex flex-col items-center"
          style={{
            top: '27%',
            left: '17.3%',
            width: '15%',
            rowGap: '6%',
          }}
        >
          <img src={symCherry} alt="Cherry" className="w-full h-auto block" />
          <img src={sym7}      alt="Seven"  className="w-full h-auto block" />
          <img src={symBell}   alt="Bell"   className="w-full h-auto block" />
        </div>

        <div
          className="absolute z-20 flex flex-col items-center"
          style={{
            top: '27%',
            left: '33.2%',
            width: '15%',
            rowGap: '6%',
          }}
        >
          <img src={symCherry} alt="Cherry" className="w-full h-auto block" />
          <img src={sym7}      alt="Seven"  className="w-full h-auto block" />
          <img src={symBell}   alt="Bell"   className="w-full h-auto block" />
        </div>

        <div
          className="absolute z-20 flex flex-col items-center"
          style={{
            top: '27%',
            left: '49.1%',
            width: '15%',
            rowGap: '6%',
          }}
        >
          <img src={symCherry} alt="Cherry" className="w-full h-auto block" />
          <img src={sym7}      alt="Seven"  className="w-full h-auto block" />
          <img src={symBell}   alt="Bell"   className="w-full h-auto block" />
        </div>

        {/* Base de la màquina (a sobre dels símbols, però conserva l'altura del layout) */}
        <img
          src={machineBase}
          alt=""
          draggable={false}
          className="relative z-30 block pointer-events-none w-[120%] -translate-x-[10%] h-auto"
        />

        {/* Palanca (més a dalt de tot) */}
        <img
          src={machineLever}
          alt=""
          draggable={false}
          className="absolute inset-0 z-40 pointer-events-none w-[120%] -translate-x-[10%] h-auto"
        />
      </div>
    </div>
  );
}
