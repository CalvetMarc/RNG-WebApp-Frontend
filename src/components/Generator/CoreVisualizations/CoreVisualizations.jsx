import Histograma from './Visualizations/Histograma';
import EntropyBlocks from './Visualizations/EntropyBlocks';
import SequenceGraph from './Visualizations/SequenceGraph';
import ScatterPlot from './Visualizations/ScatterPlot';

export default function CoreVisualizations({ values = [] }) {
  const hasData = Array.isArray(values) && values.length > 0;
  const blockSize = Math.floor(values.length * 0.02);

  return (
    <>
      {/* Títol Core Visualizations amb fons en forma de càpsula */}
      <div className="mt-15 flex justify-center">
        <div className="bg-[#3e7d86]/80 px-6 py-2 rounded-full shadow-sm border border-gray-400">
          <h2
            className="font-semibold text-gray-800"
            style={{ fontSize: "clamp(18px, 3vw, 28px)" }}
          >
            🧪 Core Visualizations
          </h2>
        </div>
      </div>

      {/* Secció de gràfiques o missatge si no hi ha dades */}
      {hasData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-20 md:gap-y-42 mt-25 mb-15 md:mt-42 px-0 items-start md:items-end">
          {/* 1 */}
          <div className="h-auto md:h-[350px] flex items-start md:items-end translate-y-0 md:translate-y-0">
            <Histograma values={values} />
          </div>

          {/* 2 */}
          <div className="h-auto md:h-[350px] flex items-start md:items-end translate-y-0 md:-translate-y-32">
            <EntropyBlocks values={values} blockSize={blockSize} />
          </div>

          {/* 3 */}
          <div className="h-auto md:h-[350px] flex items-start md:items-end translate-y-0">
            <SequenceGraph values={values} />
          </div>

          {/* 4 */}
          <div className="h-auto md:h-[350px] flex items-start md:items-end translate-y-0">
            <ScatterPlot values={values} />
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-10 text-base mb-5">
          No data available. Generate a new sequence to see the visualizations.
        </div>
      )}
    </>
  );
}
