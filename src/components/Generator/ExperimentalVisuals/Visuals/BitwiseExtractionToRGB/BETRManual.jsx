import React, { useState, useRef, useEffect, useCallback } from 'react';
import InfoTooltip from '../../../../../components/Tooltip';

export default function BETRManual({ values = [], grayscale = false, chainMode = false }) {
  const [hovered, setHovered] = useState({ show: false, value: null, index: null, x: 0, y: 0 });
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const pixelRef = useRef([]);
  const columnsRef = useRef(0);

  useEffect(() => {
    if (!Array.isArray(values) || values.length === 0) return;

    const pixelValues = [];

    if (chainMode) {
      const allBytes = [];
      for (let i = 0; i < values.length; i++) {
        const n = values[i] >>> 0;
        allBytes.push((n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff);
      }
      for (let i = 0; i < allBytes.length; i += 3) {
        const r = allBytes[i] ?? 0;
        const g = allBytes[i + 1] ?? 0;
        const b = allBytes[i + 2] ?? 0;
        if (grayscale) {
          const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
          pixelValues.push({ r: gray, g: gray, b: gray, gray });
        } else {
          pixelValues.push({ r, g, b });
        }
      }
    } else {
      for (let i = 0; i < values.length; i++) {
        const n = values[i] >>> 0;
        const r = (n >>> 16) & 0xff;
        const g = (n >>> 8) & 0xff;
        const b = n & 0xff;
        if (grayscale) {
          const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
          pixelValues.push({ r: gray, g: gray, b: gray, gray });
        } else {
          pixelValues.push({ r, g, b });
        }
      }
    }

    pixelRef.current = pixelValues;
    const total = pixelValues.length;
    const columns = Math.ceil(Math.sqrt(total));
    columnsRef.current = columns;

    const canvas = canvasRef.current;
    canvas.width = columns;
    canvas.height = columns;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    const imageData = ctx.createImageData(columns, columns);
    const data = imageData.data;

    for (let i = 0; i < total; i++) {
      const px = pixelValues[i];
      const off = i * 4;
      data[off] = px.r;
      data[off + 1] = px.g;
      data[off + 2] = px.b;
      data[off + 3] = 255;
    }

    ctx.putImageData(imageData, 0, 0);
  }, [values, grayscale, chainMode]);

  const handleMouseMove = useCallback((e) => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const px = Math.floor((e.clientX - rect.left) * scaleX);
    const py = Math.floor((e.clientY - rect.top) * scaleY);
    const idx = py * columnsRef.current + px;
    const pixel = pixelRef.current[idx];

    if (pixel) {
      const containerRect = container.getBoundingClientRect();
      const valueLabel = grayscale
        ? `${pixel.gray}`
        : `(${pixel.r}, ${pixel.g}, ${pixel.b})`;
      setHovered({
        show: true,
        value: valueLabel,
        index: idx,
        x: e.clientX - containerRect.left + 24,
        y: e.clientY - containerRect.top + 22,
      });
    } else {
      setHovered(prev => prev.show ? { show: false, value: null, index: null, x: 0, y: 0 } : prev);
    }
  }, [grayscale]);

  const handleMouseLeave = useCallback(() => {
    setHovered({ show: false, value: null, index: null, x: 0, y: 0 });
  }, []);

  if (!Array.isArray(values) || values.length === 0) return null;

  return (
    <div ref={containerRef} className="relative w-full mt-8">
      <div
        className="
          bg-[#b0cad2]
          w-screen mx-[calc(50%-50vw)] rounded-none py-0 px-0
          md:w-[90%] md:mx-auto md:rounded-lg md:py-6 md:px-4
        "
      >
        <div className="flex justify-center pl-5 md:pl-0 pr-5 md:pr-0 pt-10 md:pt-0">
          <canvas
            ref={canvasRef}
            className="border border-gray-400 w-full max-w-[500px] aspect-square"
            style={{ imageRendering: 'pixelated', cursor: 'crosshair' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          />
        </div>

        <h2 className="text-center mt-4 text-base text-gray-800 font-medium pt-3 md:pt-0 pb-5 md:pb-0 flex items-center justify-center gap-1.5">
          Bitwise Extraction to Color
          <InfoTooltip text="Extracts RGB bytes directly from each generated number and renders them as pixels. Visible patterns in the image suggest the RNG has structural bias." from="up">
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-600 text-white text-[10px] font-bold cursor-help">i</span>
          </InfoTooltip>
        </h2>
      </div>

      {hovered.show && (
        <div
          className="absolute z-50 bg-white border border-black text-black shadow-lg text-xs rounded px-3 py-2 pointer-events-none"
          style={{ top: hovered.y, left: hovered.x }}
        >
          <strong>{grayscale ? 'Gray' : 'RGB'}:</strong> {hovered.value}
          <br />
          <strong>Index:</strong> {hovered.index}
        </div>
      )}
    </div>
  );
}
