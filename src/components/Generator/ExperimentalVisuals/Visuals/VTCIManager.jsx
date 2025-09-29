import React, { useState } from 'react';
import VTCIImage from './ValueToColorInterpolation/VTCIImage';

export default function VTCIManager({ values = [] }) {
  const [colorMap, setColorMap] = useState('hsl');
  const [interpolationMode, setInterpolationMode] = useState('fixed');
  const [curveMode, setCurveMode] = useState('linear');

  return (
    <div className="w-full flex flex-col mt-10 px-6 items-center">
      {/* Contenidor centrat dels selectors */}
      <div className="flex flex-col md:flex-row flex-wrap gap-6 mb-0 justify-center">
        {/* Selector de colormap */}
        <div className="flex gap-3 bg-[#b0cad2] px-6 py-3 rounded-lg shadow min-w-[270px] items-center justify-center">
          <label className="text-sm text-gray-800 font-medium">Color Map:</label>
          <select
            value={colorMap}
            onChange={(e) => setColorMap(e.target.value)}
            className="text-sm text-gray-800 bg-gray-100 border border-gray-400 rounded px-3 py-1"
          >
            <option value="hsl">HSL</option>
            <option value="turbo">Turbo</option>
            <option value="spectral">Spectral</option>
            <option value="rdBu">RdBu</option>
            <option value="puOr">PuOr</option>
            <option value="viridis">Viridis</option>
            <option value="inferno">Inferno</option>
            <option value="magma">Magma</option>
            <option value="plasma">Plasma</option>
            <option value="cividis">Cividis</option>
          </select>
        </div>

        {/* Velocitat d'interpolació */}
        <div className="flex gap-6 bg-[#b0cad2] px-6 py-3 rounded-lg shadow min-w-[270px] justify-center">
          {['fixed', 'mid', 'fast'].map((mode) => (
            <label key={mode} className="flex items-center gap-2 text-sm text-gray-800">
              <input
                type="radio"
                name="interpolation-speed"
                value={mode}
                checked={interpolationMode === mode}
                onChange={() => setInterpolationMode(mode)}
                className="appearance-none w-3 h-3 rounded-full ring-1 ring-gray-800 checked:ring-2 checked:ring-gray-800 bg-[#94a3b8] checked:bg-gray-600"
              />
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </label>
          ))}
        </div>

        {/* Corba */}
        <div className="flex gap-6 bg-[#b0cad2] px-6 py-3 rounded-lg shadow min-w-[270px] justify-center">
          {['linear', 'exp', 'log'].map((curve) => (
            <label key={curve} className="flex items-center gap-2 text-sm text-gray-800">
              <input
                type="radio"
                name="curve-mode"
                value={curve}
                checked={curveMode === curve}
                onChange={() => setCurveMode(curve)}
                className="appearance-none w-3 h-3 rounded-full ring-1 ring-gray-800 checked:ring-2 checked:ring-gray-800 bg-[#94a3b8] checked:bg-gray-600"
              />
              {curve.charAt(0).toUpperCase() + curve.slice(1)}
            </label>
          ))}
        </div>
      </div>

      {/* Renderització */}
      <VTCIImage
        values={values}
        colorMap={colorMap}
        interpolationMode={interpolationMode}
        curveMode={curveMode}
      />
    </div>
  );
}
