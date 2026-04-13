import { useEffect, useState } from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, Tooltip as RechartsTooltip,
  CartesianGrid, ResponsiveContainer
} from 'recharts';
import InfoTooltip from '../../../../components/Tooltip';

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
    const maxPoints = 2000;
    const total = values.length - 1;
    const step = total > maxPoints ? total / maxPoints : 1;
    const limit = Math.min(total, maxPoints);
    const pts = new Array(limit);
    for (let j = 0; j < limit; j++) {
      const i = Math.round(j * step);
      const x = values[i];
      const y = values[i + 1];
      pts[j] = (typeof x === 'number' && typeof y === 'number') ? { x, y } : null;
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
  let min = 0, max = 1;
  if (hasVals) {
    min = values[0]; max = values[0];
    for (let i = 1; i < values.length; i++) {
      if (values[i] < min) min = values[i];
      if (values[i] > max) max = values[i];
    }
  }

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
              <RechartsTooltip content={<CustomTooltip />} />
              <Scatter name="PCG Sequence" data={data} fill="#3DA9FC" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <h2
          className={`text-center text-base text-gray-800 font-medium flex items-center justify-center gap-1.5 ${
            isMobile ? 'mb-5' : 'mb-0'
          }`}
        >
          Successive Number Correlation
          <InfoTooltip text="Pairs each value with the next one (v[i] vs v[i+1]). A uniform scatter cloud means no correlation between consecutive outputs — a sign of good randomness." from="up">
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-600 text-white text-[10px] font-bold cursor-help">i</span>
          </InfoTooltip>
        </h2>
      </div>
    </div>
  );
}
