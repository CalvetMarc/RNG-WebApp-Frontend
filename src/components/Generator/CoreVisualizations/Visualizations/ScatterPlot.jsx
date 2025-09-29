import { useEffect, useState } from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer
} from 'recharts';

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-white border border-black text-black shadow-lg text-xs rounded px-3 py-2 pointer-events-none">
      <strong>Current: {payload[0].payload.x}</strong><br />
      Next: {payload[0].payload.y}
    </div>
  );
}

export default function RNGComparison({ values = [] }) {
  const [data, setData] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  // Construeix punts (x = valor i, y = valor i+1)
  useEffect(() => {
    if (!Array.isArray(values) || values.length < 2) {
      setData([]);
      return;
    }
    const maxPoints = 10000;
    const limit = Math.min(values.length - 1, maxPoints);
    const pts = new Array(limit);
    for (let i = 0; i < limit; i++) {
      const x = values[i];
      const y = values[i + 1];
      pts[i] = (typeof x === 'number' && typeof y === 'number') ? { x, y } : null;
    }
    setData(pts.filter(Boolean));
  }, [values]);

  // Responsive check
  useEffect(() => {
    const update = () => setIsMobile(typeof window !== 'undefined' && window.innerWidth < 768);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Domini segur per a eixos
  const hasVals = Array.isArray(values) && values.length > 0;
  const min = hasVals ? Math.min(...values) : 0;
  const max = hasVals ? Math.max(...values) : 1;

  const chartMargin = isMobile
    ? { top: 70, right: 5, left: 15, bottom: -10 }
    : { top: 20, right: 5, left: 0, bottom: 10 };

  return (
    <div className="w-full flex justify-center">
      {/* rectangle de fons igual que les altres */}
      <div className="w-[100%] md:w-[90%] max-w-6xl  bg-[#b0cad2] rounded-lg py-0 md:py-6">

        {/* gràfica quadrada centrada dins del rectangle */}
        <div className="w-full max-w-[500px] aspect-square mx-auto -translate-y-5 md:-translate-y-0 -translate-x-5.5">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={chartMargin}>
              <CartesianGrid stroke="#717c8bff" strokeOpacity={0.8} strokeDasharray="3 3" />
              <XAxis dataKey="x" name="Current" type="number" domain={[min, max]} />
              <YAxis dataKey="y" name="Next" type="number" domain={[min, max]} />
              <Tooltip content={<CustomTooltip />} />
              <Scatter name="PCG Sequence" data={data} fill="#3DA9FC" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <h2
          className={`text-center text-base text-gray-800 font-medium ${
            isMobile ? 'mb-5' : 'mb-0'
          }`}
        >
          Successive Number Correlation (Scatter Plot of Value Pairs)
        </h2>
      </div>
    </div>
  );
}
