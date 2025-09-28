import React, { useRef, useState, useEffect } from 'react';
import {
  interpolateTurbo,
  interpolateSpectral,
  interpolateRdBu,
  interpolatePuOr,
  interpolateViridis,
  interpolateInferno,
  interpolateMagma,
  interpolatePlasma,
  interpolateCividis,
} from 'd3-scale-chromatic';

export default function VTCIManual({ valuesFreeRNG = [], colorMap = 'hsl', interpolationMode = 'fixed' }) {
  const [hovered, setHovered] = useState({ show: false, value: null, index: null, x: 0, y: 0 });
  const [timeOffset, setTimeOffset] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    let speed = 0;

    if (interpolationMode === 'mid') speed = 0.001;
    else if (interpolationMode === 'fast') speed = 0.01;

    if (speed === 0) return;

    const interval = setInterval(() => {
      setTimeOffset((prev) => (prev + speed) % 1);
    }, 10); // constant interval

    return () => clearInterval(interval);
  }, [interpolationMode]);

  if (valuesFreeRNG.length === 0) return null;

  const total = valuesFreeRNG.length;
  const columns = Math.ceil(Math.sqrt(total));
  const maxVal = Math.max(...valuesFreeRNG);
  const minVal = Math.min(...valuesFreeRNG);
  const norm = (v) => (v - minVal) / (maxVal - minVal || 1);

  const getColormapColor = (intensity) => {
    switch (colorMap) {
      case 'hsl':
        return `hsl(${(1 - intensity) * 240}, 100%, 60%)`;
      case 'turbo':
        return interpolateTurbo(intensity);
      case 'spectral':
        return interpolateSpectral(intensity);
      case 'rdBu':
        return interpolateRdBu(intensity);
      case 'puOr':
        return interpolatePuOr(intensity);
      case 'viridis':
        return interpolateViridis(intensity);
      case 'inferno':
        return interpolateInferno(intensity);
      case 'magma':
        return interpolateMagma(intensity);
      case 'plasma':
        return interpolatePlasma(intensity);
      case 'cividis':
        return interpolateCividis(intensity);
      default:
        return `hsl(${(1 - intensity) * 240}, 100%, 60%)`;
    }
  };

  return (
    <div className="w-full flex justify-center mt-8 relative" ref={containerRef}>
      <div className="w-[90%] max-w-5xl px-4 bg-[#b0cad2] rounded-lg py-6">
        {/* GRID DE COLORS */}
        <div
          className="w-full max-w-[500px] aspect-square mx-auto grid gap-[1px]"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {valuesFreeRNG.map((val, i) => {
            let intensity = norm(val);
            if (interpolationMode !== 'fixed') {
              intensity = (intensity + timeOffset) % 1;
            }

            const color = getColormapColor(intensity);

            return (
              <div
                key={i}
                className="w-full aspect-square"
                style={{ backgroundColor: color }}
                onMouseEnter={(e) => {
                  const rect = containerRef.current.getBoundingClientRect();
                  setHovered({
                    show: true,
                    value: val,
                    index: i,
                    x: e.clientX - rect.left + 12,
                    y: e.clientY - rect.top + 12,
                  });
                }}
                onMouseMove={(e) => {
                  const rect = containerRef.current.getBoundingClientRect();
                  setHovered((prev) => ({
                    ...prev,
                    x: e.clientX - rect.left + 24,
                    y: e.clientY - rect.top + 22,
                  }));
                }}
                onMouseLeave={() =>
                  setHovered({ show: false, value: null, index: null, x: 0, y: 0 })
                }
              />
            );
          })}
        </div>

        {/* TÍTOL */}
        <h2 className="text-center mt-4 text-base text-gray-800 font-medium">
          Value to Color Interpolation
        </h2>
      </div>

      {/* TOOLTIP */}
      {hovered.show && (
        <div
          className="absolute z-50 bg-white border border-black text-black shadow-lg text-xs rounded px-3 py-2 pointer-events-none"
          style={{
            top: hovered.y,
            left: hovered.x,
          }}
        >
          <strong>Value:</strong> {hovered.value}
          <br />
          <strong>Index:</strong> {hovered.index}
        </div>
      )}
    </div>
  );
}
