import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import ModeSwitch from '../components/Generator/ModeSwitch';
import RNGConfigPanel from '../components/Generator/RNGConfigPanel';
import CoreVisualizations from '../components/Generator/CoreVisualizations/CoreVisualizations';
import ExperimentalVisuals from '../components/Generator/ExperimentalVisuals/ExperemintalVisuals';

export default function Dashboard() {
  const [mode, setMode] = useState('explore');

  // Estat simplificat: només guardem els valors + info bàsica
  const [generatedValues, setGeneratedValues] = useState({
    values: [],
    seed: null,
    range: { min: 0, max: 0 },
    quantity: 0,
    mode: 'performance',
  });

  const [visualMode, setVisualMode] = useState('performance');

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <div className="mt-25">
          <div className="mt-10 w-full bg-[#919CAC] py-6">
            <div className="max-w-screen-xl mx-auto mb-8">
              <RNGConfigPanel
                setGeneratedValues={setGeneratedValues}
                visualMode={visualMode}
                setVisualMode={setVisualMode}
              />
            </div>
          </div>
        </div>

        {visualMode === 'performance' && (
          <div className="md:pb-0 pb-0">
            <CoreVisualizations values={generatedValues.values} />
          </div>
        )}

        {visualMode === 'art' && (
          <div className="pb-0">
            <ExperimentalVisuals values={generatedValues.values} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
