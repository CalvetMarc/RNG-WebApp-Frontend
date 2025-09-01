import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white border border-black text-black shadow-lg text-xs rounded px-3 py-2 pointer-events-none">
      <strong>Value: {label}</strong><br />
      Count: {payload[0].value}
    </div>
  );
}

export default function Histograma({ valuesFreeRNG = [] }) {
  const [histogramData, setHistogramData] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const freqMap = {};
    valuesFreeRNG
      .filter((val) => typeof val === 'number' && !isNaN(val))
      .forEach((val) => {
        freqMap[val] = (freqMap[val] || 0) + 1;
      });

    const data = Object.entries(freqMap).map(([value, count]) => ({
      value: String(value),
      count,
    }));

    data.sort((a, b) => Number(a.value) - Number(b.value));
    setHistogramData(data);
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
    ? { top: 0, right: 5, left: -30, bottom: -10 }
    : { top: 10, right: 40, left: 10, bottom: 5 };

  const chartHeight = isMobile ? '200px' : '350px';

  return (
    <div className="w-full flex justify-center">
      <div className="w-[100%] md:w-[90%] max-w-6xl px-4 bg-[#b0cad2] rounded-lg py-6">
        <div style={{ height: chartHeight }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={histogramData}
              margin={chartMargin}
            >
              <XAxis dataKey="value" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#3DA9FC" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <h2 className="text-center mt-4 text-base text-gray-800 font-medium">
          Value Distribution (Histogram)
        </h2>
      </div>
    </div>
  );
}
