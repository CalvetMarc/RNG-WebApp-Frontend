import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import ModeSwitch from '../components/Generator/ModeSwitch';
import RNGConfigPanel from '../components/Generator/RNGConfigPanel';
import CoreVisualizations from '../components/Generator/CoreVisualizations/CoreVisualizations';
import ExperimentalVisuals from '../components/Generator/ExperimentalVisuals/ExperemintalVisuals';

export default function Dashboard() {
  const [mode, setMode] = useState('explore');

  // Guardem totes les sèries quan es generen
  const [generatedValues, setGeneratedValues] = useState({
    native: [],
    all: null,             // { rng1:[], rng2:[], rng3:[] }
    selectedKey: 'RNG1',
    seed: 0,
    range: { min: 0, max: 0 },
    quantity: 0,
    mode: 'performance',
  });

  // Quin RNG es vol mostrar a les visuals (canvia amb el radio)
  const [selectedRngKey, setSelectedRngKey] = useState('RNG1');

  const [visualMode, setVisualMode] = useState('performance');

  // Triem la sèrie a mostrar segons la selecció i el que ja s’ha generat
  const keyMap = { RNG1: 'rng1', RNG2: 'rng2', RNG3: 'rng3' };
  const valuesToShow =
    generatedValues?.all?.[keyMap[selectedRngKey]] ??
    generatedValues?.native ??
    [];

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
                    selectedRngKey={selectedRngKey}
                    setSelectedRngKey={setSelectedRngKey}
                  />
                </div>
              </div>
            </div>
            {visualMode === 'performance' && (
              <div className="md:pb-0 pb-0">
                {/* Mantinc la prop antiga per compat: */}
                <CoreVisualizations
                  valuesFreeRNG={valuesToShow}
                  valuesToShow={valuesToShow}
                />
              </div>
            )}

            {visualMode === 'art' && (
              <div className="pb-0">
                <ExperimentalVisuals
                  valuesFreeRNG={valuesToShow}
                  valuesToShow={valuesToShow}
                />
              </div>
            )}
         
      </main>

      <Footer />
    </div>
  );
}
