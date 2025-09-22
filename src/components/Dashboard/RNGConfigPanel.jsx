import React, { useState, useEffect, useRef } from 'react';
import { FaCogs } from 'react-icons/fa';
import { generateRandomValues } from '../../utils/generateRNG';
import SingleSlider from '../UI/SingleSlider';
import DualSlider from '../UI/DualSlider';

const DEFAULTS = {
  performance: { range: { min: 0, max: 100 },        quantity: 1000 },
  art:         { range: { min: 0, max: 4294967295 },  quantity: 1000 },
};

export default function RNGConfigPanel({
  setGeneratedValues,
  visualMode,
  setVisualMode,
  selectedRngKey,
  setSelectedRngKey,
}) {
  const isArtMode   = visualMode === 'art';
  const rangeLimits = isArtMode ? { min: 0, max: 4294967295 } : { min: 0, max: 100 };
  const iterations  = isArtMode ? { min: 100, max: 10000 }    : { min: 100, max: 10000 };

  const [min, setMin] = useState(DEFAULTS.performance.range.min);
  const [max, setMax] = useState(DEFAULTS.performance.range.max);
  const [quantity, setQuantity] = useState(DEFAULTS.performance.quantity);
  const [seedType, setSeedType] = useState('random');
  const [customSeed, setCustomSeed] = useState('');
  const [loading, setLoading] = useState(false);

  // 👉 ref per cridar rangeRef.current.setRange(a,b)
  const rangeRef = useRef(null);

  useEffect(() => {
    if (setSelectedRngKey) setSelectedRngKey('RNG1');
  }, [setSelectedRngKey]);

  const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

  // ✅ En canviar de mode:
  //    - mou el thumb esquerre a 0
  //    - clampa max i quantity al límit del mode
  //    - actualitza l'estat del pare
  useEffect(() => {
    const limits = isArtMode ? DEFAULTS.art.range : DEFAULTS.performance.range;

    const nextMin = 0;
    const nextMax = clamp(max, limits.min, limits.max);
    const nextQty = clamp(quantity, iterations.min, iterations.max);

    setMin(nextMin);
    setMax(nextMax);
    setQuantity(nextQty);

    // Mou el DualSlider in-place sense remuntatge
    rangeRef.current?.setRange(nextMin, nextMax);

    setGeneratedValues({
      native: [],
      all: { rng1: [], rng2: [], rng3: [] },
      selectedKey: 'RNG1',
      seed: null,
      range: { min: nextMin, max: nextMax },
      quantity: nextQty,
      mode: visualMode,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visualMode]);

  const generateValues = async () => {
    try {
      setLoading(true);

      const seed =
        seedType === 'random'
          ? crypto.getRandomValues(new Uint32Array(1))[0]
          : (Number.parseInt(customSeed, 10) >>> 0) || 0;

      const { rng1, rng2, rng3, selected } = await generateRandomValues(
        'RNG1',
        seed,
        min,
        max,
        quantity,
        isArtMode
      );

      setGeneratedValues({
        native: selected,
        all: { rng1, rng2, rng3 },
        selectedKey: 'RNG1',
        seed,
        range: { min, max },
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
      {/* Títol */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2 justify-center text-center mb-10">
        <FaCogs className="text-gray-700 text-2xl mt-[3px]" />
        RNG Configuration
      </h2>

      {/* Value Range */}
      <div className="mb-4 ml-0 md:ml-5">
        <label className="block font-bold text-sm text-gray-800 mb-8">Value Range</label>
        <DualSlider
          ref={rangeRef}                                    
          minLimit={rangeLimits.min}
          maxLimit={rangeLimits.max}
          minValue={clamp(min, rangeLimits.min, rangeLimits.max)}  // controlat
          maxValue={clamp(max, rangeLimits.min, rangeLimits.max)}  // controlat
          onChange={(newMin, newMax) => {
            // clamp sempre dins dels límits actuals
            const cMin = clamp(Math.min(newMin, newMax), rangeLimits.min, rangeLimits.max);
            const cMax = clamp(Math.max(newMin, newMax), rangeLimits.min, rangeLimits.max);
            setMin(cMin);
            setMax(cMax);
          }}
        />
      </div>

      {/* Quantity */}
      <div className="mt-10 mb-4 ml-0 md:ml-5">
        <label className="block text-sm font-bold text-gray-800 mb-8">Quantity</label>
        <SingleSlider
          min={iterations.min}
          max={iterations.max}
          value={clamp(quantity, iterations.min, iterations.max)}
          onChange={(val) => setQuantity(clamp(val, iterations.min, iterations.max))}
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
              className={`px-2 py-1 text-sm h-8 rounded border w/full md:w-40 mr-8 focus:outline-none
                ${seedType === 'fixed'
                  ? 'bg-white text-gray-800 border-gray-600 focus:ring focus:ring-blue-300'
                  : 'bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed'
                }`}
            />
          </div>
        </div>
      </div>

      {/* Controls */}
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
