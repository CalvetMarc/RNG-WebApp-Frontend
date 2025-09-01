import React, { useState, useEffect } from 'react';
import { FaCogs } from 'react-icons/fa';
import { generateRandomValues } from '../../utils/generateRNG';
import SingleSlider from '../UI/SingleSlider';
import DualSlider from '../UI/DualSlider';

export default function RNGConfigPanel({
  setGeneratedValues,
  visualMode,
  setVisualMode,
  selectedRngKey,      // ve del pare (si existeix)
  setSelectedRngKey,   // ve del pare (si existeix)
}) {
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(100);
  const [quantity, setQuantity] = useState(1000);
  const [seedType, setSeedType] = useState('random');
  const [customSeed, setCustomSeed] = useState('');
  const [loading, setLoading] = useState(false);

  const isArtMode = visualMode === 'art';
  const rangeLimits = isArtMode ? { min: 0, max: 4294967295 } : { min: 0, max: 100 };
  const iterations = isArtMode ? { min: 100, max: 10000 } : { min: 100, max: 10000 };

  // Força internament RNG1 sense mostrar res a la UI
  useEffect(() => {
    if (setSelectedRngKey) setSelectedRngKey('RNG1');
  }, [setSelectedRngKey]);

  // Clamp range quan canvia el mode i assegurar min<=max
  useEffect(() => {
    let newMin = min, newMax = max;
    newMin = Math.min(Math.max(newMin, rangeLimits.min), rangeLimits.max);
    newMax = Math.min(Math.max(newMax, rangeLimits.min), rangeLimits.max);
    if (newMin > newMax) [newMin, newMax] = [newMax, newMin];
    setMin(newMin);
    setMax(newMax);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visualMode]);

  // Reset bàsic en canviar mode
  useEffect(() => {
    setGeneratedValues({
      native: [],
      all: { rng1: [], rng2: [], rng3: [] },
      selectedKey: 'RNG1',
      seed: null,
      range: { min, max },
      quantity,
      mode: visualMode,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visualMode]);

  // Mantén quantity dins del límit del mode
  useEffect(() => {
    setQuantity(q => Math.min(Math.max(q, iterations.min), iterations.max));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visualMode]);

  const generateValues = async () => {
    try {
      setLoading(true);

      const seed =
        seedType === 'random'
          ? crypto.getRandomValues(new Uint32Array(1))[0]
          : (Number.parseInt(customSeed, 10) >>> 0) || 0;

      const minI = min;
      const maxI = max;

      // Genera i considera actiu RNG1 (FreePRNG) sense mostrar-ho a la UI
      const { rng1, rng2, rng3, selected } = await generateRandomValues(
        'RNG1',
        seed,
        minI,
        maxI,
        quantity,
        isArtMode
      );

      setGeneratedValues({
        native: selected,
        all: { rng1, rng2, rng3 },
        selectedKey: 'RNG1',
        seed,
        range: { min: minI, max: maxI },
        quantity,
        mode: visualMode,
      });
    } catch (e) {
      console.error('RNG error:', e);
    } finally {
      setLoading(false);
    }
  };

  const isFixed = seedType === 'fixed';

  return (
  <div className="bg-[#b0c2d2] rounded-xl shadow p-6 mt-8 max-w-3xl mx-auto">
    {/* Títol: centrat a mòbil, com abans a PC */}
    <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2 justify-center text-center mb-10">
      <FaCogs className="text-gray-700 text-2xl mt-[3px]" />
      RNG Configuration
    </h2>


    {/* Range */}
    <div className="mb-4 ml-0 md:ml-5">
      <label className="block font-bold text-sm text-gray-800 mb-8">Value Range</label>
      <DualSlider
        minLimit={rangeLimits.min}
        maxLimit={rangeLimits.max}
        minValue={min}
        maxValue={max}
        onChange={(newMin, newMax) => { setMin(newMin); setMax(newMax); }}
      />
    </div>

    {/* Quantity */}
    <div className="mt-10 mb-4 ml-0 md:ml-5">
      <label className="block text-sm font-bold text-gray-800 mb-8">Quantity</label>
      <SingleSlider
        min={iterations.min}
        max={iterations.max}
        value={quantity}
        onChange={(val) => setQuantity(val)}
      />
    </div>

    {/* Visuals & Seed */}
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Visuals */}
      <div>
        <label className="block text-sm font-bold text-gray-800 mb-2 ml-0 md:ml-5">Visuals</label>
        <div className="flex flex-wrap gap-4 ml-0 md:ml-5">
          {['performance', 'art'].map((mode) => (
            <label key={mode} className="flex items-center px-0.5 gap-1 text-gray-700 capitalize">
              <input
                type="radio"
                value={mode}
                checked={visualMode === mode}
                onChange={() => setVisualMode(mode)}
                className="appearance-none w-3 h-3 rounded-full ring-1 ring-gray-800 checked:ring-2 checked:ring-gray-800 bg-[#94a3b8] checked:bg-gray-600"
              />
              {mode}
            </label>
          ))}
        </div>
      </div>

      {/* Seed */}
      <div className="ml-0 md:ml-0">
        <label className="block text-sm font-bold mb-1 text-gray-800 mt-3 md:mt-0">Seed</label>
        <div className="flex flex-row items-center justify-between gap-4">
          <div className="flex gap-4">
            <label className="flex items-center px-0.5 gap-1 text-gray-700">
              <input
                type="radio"
                value="random"
                checked={seedType === 'random'}
                onChange={() => setSeedType('random')}
                className="appearance-none w-3 h-3 rounded-full ring-1 ring-gray-800 checked:ring-2 checked:ring-gray-800 bg-[#94a3b8] checked:bg-gray-600"
              />
              Random
            </label>
            <label className="flex items-center px-0.5 gap-1 text-gray-700">
              <input
                type="radio"
                value="fixed"
                checked={seedType === 'fixed'}
                onChange={() => setSeedType('fixed')}
                className="appearance-none w-3 h-3 rounded-full ring-1 ring-gray-800 checked:ring-2 checked:ring-gray-800 bg-[#94a3b8] checked:bg-gray-600"
              />
              Fixed
            </label>
          </div>

          <input
            type="number"
            placeholder="Enter seed"
            value={customSeed}
            onChange={(e) => setCustomSeed(e.target.value)}
            disabled={seedType !== 'fixed'}
            title={seedType === 'fixed' ? 'Editable (Fixed seed)' : 'Switch to Fixed to edit'}
            className={`px-2 py-1 text-sm h-8 rounded border w-full md:w-40 mr-8 focus:outline-none
              ${seedType === 'fixed'
                ? 'bg-white text-gray-800 border-gray-600 focus:ring focus:ring-blue-300'
                : 'bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed'
              }`}
          />
        </div>
      </div>

    </div>

    {/* Controls: botó centrat a mòbil, dreta a PC */}
   <div className="mt-10 flex items-center justify-center gap-6">
  <button
    className="button w-40 translate-y-2"
    onClick={generateValues}
    disabled={loading || min > max}
    title={loading ? 'Generating…' : (min > max ? 'Invalid range' : 'Execute Roll')}
  >
    {loading ? 'Generating…' : 'Execute Roll'}
  </button>
</div>
  </div>
);
}
