import React, { useEffect, useRef } from 'react';

export default function BETRImage({ values = [], grayscale = false, chainMode = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!Array.isArray(values) || values.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: false });
    ctx.imageSmoothingEnabled = false;

    // Construeix buffer de bytes
    const bytes = [];
    if (chainMode) {
      // FULL CHAIN: concatena tots els bytes de cada uint32
      for (let i = 0; i < values.length; i++) {
        const n = values[i] >>> 0; // assegura uint32
        bytes.push((n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff);
      }
    } else {
      // EACH VALUE: cada enter → 3 bytes RGB (R,G,B)
      for (let i = 0; i < values.length; i++) {
        const n = values[i] >>> 0; // assegura uint32
        bytes.push((n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff);
      }
    }

    // Dimensions del canvas
    const pixelCount = Math.ceil(bytes.length / 3);
    const size = Math.ceil(Math.sqrt(pixelCount));
    canvas.width = size;
    canvas.height = size;

    const imageData = ctx.createImageData(size, size);
    const data = imageData.data;

    // Omple píxels
    for (let i = 0, j = 0; i < pixelCount; i++, j += 4) {
      const r = bytes[i * 3] ?? 0;
      const g = bytes[i * 3 + 1] ?? 0;
      const b = bytes[i * 3 + 2] ?? 0;

      if (grayscale) {
        const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
        data[j] = gray; data[j + 1] = gray; data[j + 2] = gray;
      } else {
        data[j] = r; data[j + 1] = g; data[j + 2] = b;
      }
      data[j + 3] = 255;
    }

    ctx.putImageData(imageData, 0, 0);
  }, [values, grayscale, chainMode]);

  return (
    <div className="w-full mt-8">
      {/* Full-bleed a mòbil; normal a md+ */}
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
            style={{ imageRendering: 'pixelated' }}
          />
        </div>

        <h2 className="text-center mt-4 text-base text-gray-800 font-medium pt-3 md:pt-0 pb-5 md:pb-0">
          Bitwise Extraction to Color
        </h2>
      </div>
    </div>
  );
}

/*
  Props:
  - values: array d'enters (uint32 recomanat)
  - grayscale: true → converteix a tons de gris
  - chainMode: true → usa tots els bytes concatenats com a stream
*/
