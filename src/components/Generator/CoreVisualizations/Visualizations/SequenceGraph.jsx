import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white border border-black text-black shadow-lg text-xs rounded px-3 py-2 pointer-events-none">
      <strong>Index: {payload[0].payload.index}</strong><br />
      Value: {payload[0].payload.value}
    </div>
  );
}

export default function SequenceGraph({ valuesFreeRNG = [] }) {
  const [graphData, setGraphData] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const data = valuesFreeRNG.map((val, index) => ({
      index,
      value: typeof val === 'number' ? val : 0,
    }));
    setGraphData(data);
  }, [valuesFreeRNG]);

  useEffect(() => {
    const update = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < 768); // breakpoint "md"
      }
    };
    update(); // comprova al muntatge
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const chartMargin = isMobile
    ? { top: 0, right: 20, left: -10, bottom: -10 }
    : { top: 10, right: 60, left: 10, bottom: 5 };

  const chartHeight = isMobile ? '200px' : '350px';

  return (
    <div className="w-full  flex justify-center">
      <div className="w-[100%] md:w-[90%] max-w-6xl bg-[#b0cad2] rounded-lg pt-6 pb-6">
        <div style={{ height: chartHeight }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={graphData} margin={chartMargin}>
              <XAxis dataKey="index" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
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

        <h2 className="text-center mt-4 text-base text-gray-800 font-medium">
          Value Sequence Graph
        </h2>
      </div>
    </div>
  );
}
