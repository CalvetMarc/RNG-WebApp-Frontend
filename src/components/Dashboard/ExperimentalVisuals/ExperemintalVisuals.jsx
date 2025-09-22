import BETRManager from './Visuals/BETRManager';
import VTCIManager from './Visuals/VTCIManager';
import Melody from './Visuals/Melody';

export default function ExperimentalVisuals({ valuesFreeRNG = [] }) {
  const hasData = valuesFreeRNG.length > 0;

  return (
    <>
      {/* Títol Experimental Visuals amb fons en forma de càpsula */}
      <div className="flex justify-center">
        <div className="bg-[#6abc9e]/70 px-6 py-2 rounded-full shadow-sm border border-[#B6BCC8] mt-20">
        <h2 className="font-semibold text-gray-800 text-center"
            style={{ fontSize: "clamp(18px, 3vw, 28px)" }}>
          🎨 Experimental Visuals
        </h2>
        </div>
      </div>

      {hasData ? (
        <>
          {/* Melody centrat horitzontalment sota els visuals */}
          <div className="w-full flex justify-center mt-25 ">
            <Melody valuesFreeRNG={valuesFreeRNG} />
          </div>
          {/* Grid visuals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-90 mt-90 md:mt-90 mb-0 px-4 items-end mb-15">
            <div className="h-[350px] flex items-end mt-20 md:mt-10">
              <BETRManager valuesFreeRNG={valuesFreeRNG} />
            </div>
            <div className="h-[350px] flex items-end mt-20 md:mt-10">
              <VTCIManager valuesFreeRNG={valuesFreeRNG} />
            </div>
          </div>          
        </>
      ) : (
        <div className="text-center text-gray-500 mt-10 text-base">
          No data available. Generate a new sequence to see the visualizations.
        </div>
      )}
    </>
  );
}
