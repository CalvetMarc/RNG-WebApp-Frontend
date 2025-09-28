import React, { useEffect, useRef, useState } from 'react';
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

export default function VTCIImage({
  valuesFreeRNG = [],
  colorMap = 'hsl',
  interpolationMode = 'fixed',
  curveMode = 'linear',
}) {
  const canvasRef = useRef(null);
  const [timeOffset, setTimeOffset] = useState(0);

  useEffect(() => {
    let speed = 0;
    if (interpolationMode === 'mid') speed = 0.001;
    else if (interpolationMode === 'fast') speed = 0.01;
    if (speed === 0) return;

    const interval = setInterval(() => {
      setTimeOffset((prev) => (prev + speed) % 1);
    }, 10);

    return () => clearInterval(interval);
  }, [interpolationMode]);

  useEffect(() => {
    if (!valuesFreeRNG.length) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    const total = valuesFreeRNG.length;
    const size = Math.ceil(Math.sqrt(total));
    canvas.width = size;
    canvas.height = size;

    const imageData = ctx.createImageData(size, size);

    const max = Math.max(...valuesFreeRNG);
    const min = Math.min(...valuesFreeRNG);
    const norm = (v) => (v - min) / (max - min || 1);

    const applyCurve = (x) => {
      switch (curveMode) {
        case 'exp':
          return Math.pow(x, 2);
        case 'log':
          return Math.log1p(x * 9) / Math.log(10);
        case 'linear':
        default:
          return x;
      }
    };

    function hslToRgb(h, s, l) {
      h /= 360;
      s /= 100;
      l /= 100;
      let r, g, b;

      if (s === 0) {
        r = g = b = l;
      } else {
        const hue2rgb = (p, q, t) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1 / 6) return p + (q - p) * 6 * t;
          if (t < 1 / 2) return q;
          if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
          return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
      }

      return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    const getRGB = (intensity) => {
      if (colorMap === 'grayscale') {
        const gray = Math.round(intensity * 255);
        return [gray, gray, gray];
      }

      if (colorMap === 'hsl') {
        const hue = (1 - intensity) * 240;
        return hslToRgb(hue, 100, 50);
      }

      let colorStr;
      switch (colorMap) {
        case 'turbo':
          colorStr = interpolateTurbo(intensity);
          break;
        case 'spectral':
          colorStr = interpolateSpectral(intensity);
          break;
        case 'rdBu':
          colorStr = interpolateRdBu(intensity);
          break;
        case 'puOr':
          colorStr = interpolatePuOr(intensity);
          break;
        case 'viridis':
          colorStr = interpolateViridis(intensity);
          break;
        case 'inferno':
          colorStr = interpolateInferno(intensity);
          break;
        case 'magma':
          colorStr = interpolateMagma(intensity);
          break;
        case 'plasma':
          colorStr = interpolatePlasma(intensity);
          break;
        case 'cividis':
          colorStr = interpolateCividis(intensity);
          break;
        default:
          const fallbackHue = (1 - intensity) * 240;
          return hslToRgb(fallbackHue, 100, 50);
      }

      if (colorStr.startsWith('#')) {
        const hex = colorStr.slice(1);
        const bigint = parseInt(hex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return [r, g, b];
      }

      const match = colorStr.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (match) {
        return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
      }

      return [0, 0, 0];
    };

    for (let i = 0; i < size * size; i++) {
      let intensity = i < total ? norm(valuesFreeRNG[i]) : 0;
      intensity = applyCurve(intensity);
      if (interpolationMode !== 'fixed') {
        intensity = (intensity + timeOffset) % 1;
      }

      const [r, g, b] = getRGB(intensity);
      const offset = i * 4;
      imageData.data[offset] = r;
      imageData.data[offset + 1] = g;
      imageData.data[offset + 2] = b;
      imageData.data[offset + 3] = 255;
    }

    ctx.putImageData(imageData, 0, 0);
  }, [valuesFreeRNG, colorMap, interpolationMode, curveMode, timeOffset]);

  return (
  <div className="w-full mt-8">
    {/* Full-bleed a mòbil; compacte a desktop */}
    <div
      className="
        bg-[#b0cad2]
        w-screen
        mx-[calc(50%-50vw)]
        rounded-none
        py-0 px-0
        md:w-[90%] md:mx-auto md:rounded-lg md:py-6 md:px-4
      "
    >
      <div className="flex justify-center pl-5 md:pl-0 pr-5 md:pr-0 pt-10 md:pt-0">
        <canvas
          ref={canvasRef}
          className="border border-gray-400 w-full max-w-[500px] aspect-square"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>
      <h2 className="text-center mt-4 text-base text-gray-800 font-medium pt-3 md:pt-0 pb-5 md:pb-0">
        Value to Color Interpolation
      </h2>
    </div>
  </div>
);

}
