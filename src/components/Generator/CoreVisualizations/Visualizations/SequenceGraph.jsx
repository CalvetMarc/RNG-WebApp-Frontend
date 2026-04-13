import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';
import InfoTooltip from '../../../../components/Tooltip';

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white border border-black text-black shadow-lg text-xs rounded px-3 py-2 pointer-events-none">
      <strong>Index: {payload[0].payload.index}</strong><br />
      Value: {payload[0].payload.value}
    </div>
  );
}

export default function SequenceGraph({ values = [] }) {
  const [graphData, setGraphData] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  // Construeix les dades per al gràfic (downsampled per rendiment)
  useEffect(() => {
    const arr = Array.isArray(values) ? values : [];
    const maxPoints = 1000;
    if (arr.length <= maxPoints) {
      setGraphData(arr.map((val, index) => ({ index, value: typeof val === 'number' ? val : 0 })));
    } else {
      const step = arr.length / maxPoints;
      const sampled = [];
      for (let i = 0; i < maxPoints; i++) {
        const idx = Math.round(i * step);
        const val = arr[idx];
        sampled.push({ index: idx, value: typeof val === 'number' ? val : 0 });
      }
      setGraphData(sampled);
    }
  }, [values]);

  // Responsive check
  useEffect(() => {
    const update = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < 768); // breakpoint "md"
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const chartMargin = isMobile
    ? { top: 0, right: 20, left: -10, bottom: -10 }
    : { top: 10, right: 60, left: 10, bottom: 5 };

  const chartHeight = isMobile ? '200px' : '350px';

  return (
    <div className="w-full flex justify-center">
      <div className="w-[100%] md:w-[90%] max-w-6xl bg-[#b0cad2] rounded-lg pt-6 pb-6">
        <div style={{ height: chartHeight }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={graphData} margin={chartMargin}>
              <XAxis dataKey="index" />
              <YAxis />
              <RechartsTooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3DA9FC"
                strokeWidth={2.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <h2 className="text-center mt-4 text-base text-gray-800 font-medium flex items-center justify-center gap-1.5">
          Value Sequence Graph
          <InfoTooltip text="Plots each generated value in order. Patterns or trends here suggest the RNG may not be truly random." from="up">
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-600 text-white text-[10px] font-bold cursor-help">i</span>
          </InfoTooltip>
        </h2>
      </div>
    </div>
  );
}
