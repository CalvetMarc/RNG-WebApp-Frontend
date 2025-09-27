// src/components/Generator/Slot.jsx
import machineBase  from '../../assets/slot/slot-machine1.png';
import machineLever from '../../assets/slot/slot-machine2.png';

import sym7      from '../../assets/slot/slot-symbol1.png';
import symCherry from '../../assets/slot/slot-symbol2.png';
import symBell   from '../../assets/slot/slot-symbol3.png';

export default function Slot() {
  return (
    <div className="relative mx-auto w-full">
      <div
        className="
          relative mx-auto overflow-hidden
          w-[120%]        
        "
        aria-label="Slot machine"
      >
        {/* Base */}
        <img
          src={machineBase}
          alt=""
          draggable={false}
          className="block pointer-events-none w-[120%] -translate-x-[10%] h-auto"
        />

        {/* Palanca */}
        <img
          src={machineLever}
          alt=""
          draggable={false}
          className="absolute inset-0 pointer-events-none w-[120%] -translate-x-[10%] h-auto"
        />

        {/* ───────── Columna de símbols (escala amb la slot) ───────── */}
        <div
          className="absolute flex flex-col items-center"
          style={{
            top: '27%',          // punt de referència
            left: '17.3%',
            width: '15%',        // ← el % de l’ample de la slot
            rowGap: '6%',        // separació vertical
          }}
        >
          <img src={symCherry} alt="Cherry" className="w-full h-auto block" />
          <img src={sym7}      alt="Seven"  className="w-full h-auto block" />
          <img src={symBell}   alt="Bell"   className="w-full h-auto block" />
        </div>

        {/* ───────── Columna de símbols (escala amb la slot) ───────── */}
        <div
          className="absolute flex flex-col items-center"
          style={{
            top: '27%',          // punt de referència
            left: '33.2%',
            width: '15%',        // ← el % de l’ample de la slot
            rowGap: '6%',        // separació vertical
          }}
        >
          <img src={symCherry} alt="Cherry" className="w-full h-auto block" />
          <img src={sym7}      alt="Seven"  className="w-full h-auto block" />
          <img src={symBell}   alt="Bell"   className="w-full h-auto block" />
        </div>

        {/* ───────── Columna de símbols (escala amb la slot) ───────── */}
        <div
        className="absolute flex flex-col items-center"
        style={{
            top: '27%',          // punt de referència
            left: '49.1%',
            width: '15%',        // ← el % de l’ample de la slot
            rowGap: '6%',        // separació vertical
        }}
        >
        <img src={symCherry} alt="Cherry" className="w-full h-auto block" />
        <img src={sym7}      alt="Seven"  className="w-full h-auto block" />
        <img src={symBell}   alt="Bell"   className="w-full h-auto block" />
        </div>

      </div>
    </div>
  );
}
