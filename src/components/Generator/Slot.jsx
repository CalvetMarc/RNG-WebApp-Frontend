// src/components/Generator/Slot.jsx
import machineBase   from '../../assets/slot/slot-machine4.png';
import machineLever  from '../../assets/slot/slot-machine2.png';
import machineRails  from '../../assets/slot/slot-machine5.png';

import sym7      from '../../assets/slot/slot-symbol1.png';
import symCherry from '../../assets/slot/slot-symbol2.png';
import symBell   from '../../assets/slot/slot-symbol3.png';

export default function Slot({ onPull }) {
  return (
    <div className="relative mx-auto w-full">
      <div
        className="relative mx-auto overflow-hidden w-[120%]"
        aria-label="Slot machine"
      >
        {/* Rails background */}
        <img
          src={machineRails}
          alt=""
          draggable={false}
          className="absolute inset-0 z-10 pointer-events-none w-[120%] -translate-x-[10%] h-auto"
        />

        {/* Símbols */}
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

        {/* 🔹 Botó invisible sobre la palanca */}
        <button
          onClick={onPull}
          className="button4 absolute inset-0 m-auto z-50 select-none !border-none"
          style={{
            top: '27%',      // percentatge vertical dins la imatge
            left: '69.8%',     // percentatge horitzontal dins la imatge
            width: '14%',    // ample relatiu
            height: '18%',   // alt relatiu
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
