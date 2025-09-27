// src/components/Generator/Slot.jsx
import machineBase  from '../../assets/slot/slot-machine1.png';
import machineLever from '../../assets/slot/slot-machine2.png';

export default function Slot() {
  return (
    <div className="relative mx-auto w-full">
      {/* Marc: ocupa % relatiu del bloc i talla l'aire sobrera amb overflow-hidden */}
      <div
        className="
          relative mx-auto overflow-hidden
          w-[120%]        
        "
        aria-label="Slot machine"
      >
        {/* Base: fem la imatge una mica més ampla i la movem a l'esquerra */}
        <img
          src={machineBase}
          alt=""
          draggable={false}
          className="block pointer-events-none
                     w-[120%] -translate-x-[10%] h-auto"
        />

        {/* Palanca: idèntic desplaçament perquè quedi alineada */}
        <img
          src={machineLever}
          alt=""
          draggable={false}
          className="absolute inset-0 pointer-events-none
                     w-[120%] -translate-x-[10%] h-auto"
        />
      </div>
    </div>
  );
}
