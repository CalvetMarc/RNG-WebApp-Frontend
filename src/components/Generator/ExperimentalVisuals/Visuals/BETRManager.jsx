import React, { useState } from 'react';
import BETRManual from './BitwiseExtractionToRGB/BETRManual';
import BETRImage from './BitwiseExtractionToRGB/BETRImage';

export default function BETRManager({ valuesFreeRNG = [] }) {
  const [outputMode, setOutputMode] = useState('image');      // ← Per defecte 'image'
  const [grayscale, setGrayscale] = useState(false);
  const [chainMode, setChainMode] = useState(false);

  return (
    <div className="w-full flex flex-col mt-10 px-0 md:px-6 items-center">
      <div className="flex flex-col md:flex-row flex-wrap gap-6 mb-0 justify-center">

        {/* Image Output primer */}
        <div className="flex gap-6 bg-[#b0cad2] px-6 py-4.5 rounded-lg shadow min-w-[270px] justify-center">
          <label className="flex items-center gap-2 text-sm text-gray-800">
            <input
              type="radio"
              name="output-mode-betr"
              value="image"
              checked={outputMode === 'image'}
              onChange={() => setOutputMode('image')}
              className="appearance-none w-3 h-3 rounded-full
                         ring-1 ring-gray-800 checked:ring-2 checked:ring-gray-800
                         bg-[#94a3b8] checked:bg-gray-600"
            />
            Image Output
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-800">
            <input
              type="radio"
              name="output-mode-betr"
              value="grid"
              checked={outputMode === 'grid'}
              onChange={() => setOutputMode('grid')}
              className="appearance-none w-3 h-3 rounded-full
                         ring-1 ring-gray-800 checked:ring-2 checked:ring-gray-800
                         bg-[#94a3b8] checked:bg-gray-600"
            />
            Manual Grid
          </label>
        </div>

        {/* La resta igual */}
        <div className="flex gap-6 bg-[#b0cad2] px-6 py-4.5 rounded-lg shadow min-w-[270px] justify-center">
          <label className="flex items-center gap-2 text-sm text-gray-800">
            <input
              type="radio"
              name="color-mode-betr"
              value="rgb"
              checked={!grayscale}
              onChange={() => setGrayscale(false)}
              className="appearance-none w-3 h-3 rounded-full
                         ring-1 ring-gray-800 checked:ring-2 checked:ring-gray-800
                         bg-[#94a3b8] checked:bg-gray-600"
            />
            RGB
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-800">
            <input
              type="radio"
              name="color-mode-betr"
              value="grayscale"
              checked={grayscale}
              onChange={() => setGrayscale(true)}
              className="appearance-none w-3 h-3 rounded-full
                         ring-1 ring-gray-800 checked:ring-2 checked:ring-gray-800
                         bg-[#94a3b8] checked:bg-gray-600"
            />
            Grayscale
          </label>
        </div>

        <div className="flex gap-6 bg-[#b0cad2] px-6 py-4.5 rounded-lg shadow min-w-[270px] justify-center">
          <label className="flex items-center gap-2 text-sm text-gray-800">
            <input
              type="radio"
              name="chain-mode-betr"
              value="value"
              checked={!chainMode}
              onChange={() => setChainMode(false)}
              className="appearance-none w-3 h-3 rounded-full
                         ring-1 ring-gray-800 checked:ring-2 checked:ring-gray-800
                         bg-[#94a3b8] checked:bg-gray-600"
            />
            Each Value
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-800">
            <input
              type="radio"
              name="chain-mode-betr"
              value="chain"
              checked={chainMode}
              onChange={() => setChainMode(true)}
              className="appearance-none w-3 h-3 rounded-full
                         ring-1 ring-gray-800 checked:ring-2 checked:ring-gray-800
                         bg-[#94a3b8] checked:bg-gray-600"
            />
            Full Chain
          </label>
        </div>
      </div>

      {outputMode === 'grid' ? (
        <BETRManual
          valuesFreeRNG={valuesFreeRNG}
          grayscale={grayscale}
          chainMode={chainMode}
        />
      ) : (
        <BETRImage
          valuesFreeRNG={valuesFreeRNG}
          grayscale={grayscale}
          chainMode={chainMode}
        />
      )}
    </div>
  );
}
