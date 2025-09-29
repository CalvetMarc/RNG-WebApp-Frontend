// components/Generator/ExperimentalVisuals.jsx
import BETRManager from './Visuals/BETRManager';
import VTCIManager from './Visuals/VTCIManager';
import Melody from './Visuals/Melody';

export default function ExperimentalVisuals({ values = [] }) {
  const hasData = Array.isArray(values) && values.length > 0;

  return (
    <>
      <div className="flex justify-center">
        <div className="bg-[#6abc9e]/70 px-6 py-2 rounded-full shadow-sm border border-[#B6BCC8] mt-15">
          <h2
            className="font-semibold text-gray-800 text-center"
            style={{ fontSize: 'clamp(18px, 3vw, 28px)' }}
          >
            🎨 Experimental Visuals
          </h2>
        </div>
      </div>

      {hasData ? (
        <>
          {/* Melody centrat horitzontalment */}
          <div className="w-full flex justify-center mt-25">
            <Melody values={values} />
          </div>

          {/* Grid de visuals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-90 mt-90 md:mt-90 px-4 items-end mb-15">
            <div className="h-[350px] flex items-end mt-20 md:mt-10">
              <BETRManager values={values} />
            </div>
            <div className="h-[350px] flex items-end mt-20 md:mt-10">
              <VTCIManager values={values} />
            </div>
          </div>
        </>
      ) : (
        <div className="text-center text-gray-500 mt-10 text-base mb-5">
          No data available. Generate a new sequence to see the visualizations.
        </div>
      )}
    </>
  );
}
