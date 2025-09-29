import React, { useState, useRef } from 'react';

export default function BETRManual({ values = [], grayscale = false, chainMode = false }) {
  const [hovered, setHovered] = useState({ show: false, value: null, index: null, x: 0, y: 0 });
  const containerRef = useRef(null);

  if (!Array.isArray(values) || values.length === 0) return null;

  const pixelValues = [];

  if (chainMode) {
    // FULL CHAIN: converteix cada uint32 a 4 bytes i concatena; cada 3 bytes → 1 píxel
    const allBytes = [];
    for (let i = 0; i < values.length; i++) {
      const n = values[i] >>> 0; // assegura uint32
      allBytes.push((n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff);
    }
    for (let i = 0; i < allBytes.length; i += 3) {
      const r = allBytes[i] ?? 0;
      const g = allBytes[i + 1] ?? 0;
      const b = allBytes[i + 2] ?? 0;
      if (grayscale) {
        const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
        pixelValues.push({ gray });
      } else {
        pixelValues.push({ r, g, b });
      }
    }
  } else {
    // EACH VALUE: cada enter → 3 bytes RGB directes
    for (let i = 0; i < values.length; i++) {
      const n = values[i] >>> 0; // assegura uint32
      const r = (n >>> 16) & 0xff;
      const g = (n >>> 8) & 0xff;
      const b = n & 0xff;
      if (grayscale) {
        const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
        pixelValues.push({ gray });
      } else {
        pixelValues.push({ r, g, b });
      }
    }
  }

  const total = pixelValues.length;
  const columns = Math.ceil(Math.sqrt(total));

  return (
    <div ref={containerRef} className="relative w-full mt-8">
      {/* Full-bleed a mòbil; compacte a md+ */}
      <div
        className="
          bg-[#b0cad2]
          w-screen mx-[calc(50%-50vw)] rounded-none py-0 px-0
          md:w-[90%] md:mx-auto md:rounded-lg md:py-6 md:px-4
        "
      >
        {/* GRID */}
        <div className="flex justify-center pl-5 md:pl-0 pr-5 md:pr-0 pt-10 md:pt-0">
          <div
            className="border border-gray-400 w-full max-w-[500px] aspect-square grid gap-[1px]"
            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
          >
            {pixelValues.map((val, i) => {
              const color = grayscale
                ? `rgb(${val.gray}, ${val.gray}, ${val.gray})`
                : `rgb(${val.r}, ${val.g}, ${val.b})`;
              const valueLabel = grayscale
                ? `${val.gray}`
                : `(${val.r}, ${val.g}, ${val.b})`;

              return (
                <div
                  key={i}
                  className="w-full aspect-square"
                  style={{ backgroundColor: color }}
                  onMouseEnter={(e) => {
                    const rect = containerRef.current.getBoundingClientRect();
                    setHovered({
                      show: true,
                      value: valueLabel,
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
        </div>

        {/* Títol */}
        <h2 className="text-center mt-4 text-base text-gray-800 font-medium pt-3 md:pt-0 pb-5 md:pb-0">
          Bitwise Extraction to Color
        </h2>
      </div>

      {/* Tooltip */}
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
