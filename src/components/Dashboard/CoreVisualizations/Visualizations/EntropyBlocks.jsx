import { useEffect, useState, useRef } from 'react';

export default function EntropyBlocks({ valuesFreeRNG = [], blockSize = 100 }) {
  const [entropies, setEntropies] = useState([]);
  const [tooltip, setTooltip] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!valuesFreeRNG || valuesFreeRNG.length === 0) return;

    const computeEntropy = (block) => {
      const freqMap = {};
      block.forEach(val => {
        freqMap[val] = (freqMap[val] || 0) + 1;
      });

      const total = block.length;
      let entropy = 0;
      for (let key in freqMap) {
        const p = freqMap[key] / total;
        entropy -= p * Math.log2(p);
      }

      return {
        entropy: Number(entropy.toFixed(3)),
        uniqueCount: Object.keys(freqMap).length,
      };
    };

    const blocks = [];
    for (let i = 0; i < valuesFreeRNG.length; i += blockSize) {
      const block = valuesFreeRNG.slice(i, i + blockSize);
      if (block.length === blockSize) {
        blocks.push(computeEntropy(block));
      }
    }

    setEntropies(blocks);
  }, [valuesFreeRNG, blockSize]);

  return (
    <div className="w-full flex justify-center">
      <div className="w-[100%] md:w-[90%] max-w-6xl px-4 bg-[#b0cad2] rounded-lg pt-10 md:pt-18 pb-11">
        <div ref={containerRef} className="grid grid-cols-10 gap-1 relative">
          {entropies.map((block, index) => {
            const entropyRatio = block.entropy / Math.log2(blockSize);
            const hue = entropyRatio * 220;
            const lightness = 60;

            return (
              <div
                key={index}
                className="h-6 rounded cursor-pointer"
                style={{
                  backgroundColor: `hsl(${hue}, 100%, ${lightness}%)`,
                  transition: 'background-color 0.3s ease',
                }}
                onMouseMove={(e) => {
                  if (!containerRef.current) return;
                  const rect = containerRef.current.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;

                  const offsetX = x > rect.width / 2 ? -130 : 10;
                  const offsetY = y > rect.height / 2 ? -85 : 10;

                  setTooltip({
                    x: x + offsetX,
                    y: y + offsetY,
                    index,
                    entropy: block.entropy,
                    unique: block.uniqueCount,
                  });
                }}
                onMouseLeave={() => setTooltip(null)}
              />
            );
          })}

          {tooltip && (
            <div
              className="absolute z-50 bg-white border border-black text-black shadow-lg text-xs rounded px-3 py-2 pointer-events-none"
              style={{
                top: tooltip.y,
                left: tooltip.x,
                transition: 'opacity 0.1s ease-in-out',
              }}
            >
              <strong>Block #{tooltip.index}</strong><br />
              Entropy: {tooltip.entropy}<br />
              Unique: {tooltip.unique}<br />
              Range: [{tooltip.index * blockSize} – {(tooltip.index + 1) * blockSize - 1}]
            </div>
          )}
        </div>

        <h2 className="text-center mt-2 mb-0 md:mt-5 md:mb-3 text-base text-gray-800 font-medium translate-y-4">
          Entropy per Block (H from 0 to {Math.log2(blockSize).toFixed(2)})
        </h2>
      </div>
    </div>
  );
}
