import React, { useEffect, useRef } from 'react';

export default function BETRImage({ valuesFreeRNG = [], grayscale = false, chainMode = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!valuesFreeRNG.length) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    const bytes = [];

    if (chainMode) {
      // 🔗 FULL CHAIN: concatenar tots els bytes
      for (const num of valuesFreeRNG) {
        bytes.push((num >> 24) & 0xff);
        bytes.push((num >> 16) & 0xff);
        bytes.push((num >> 8) & 0xff);
        bytes.push(num & 0xff);
      }
    } else {
      // 🧩 EACH VALUE: cada enter → 3 bytes RGB
      for (const num of valuesFreeRNG) {
        const r = (num >> 16) & 0xff;
        const g = (num >> 8) & 0xff;
        const b = num & 0xff;
        bytes.push(r, g, b);
      }
    }

    // Calcular dimensions i preparar píxels
    const pixelCount = Math.ceil(bytes.length / 3);
    const size = Math.ceil(Math.sqrt(pixelCount));
    canvas.width = size;
    canvas.height = size;

    const imageData = ctx.createImageData(size, size);

    for (let i = 0; i < pixelCount; i++) {
      const r = bytes[i * 3] ?? 0;
      const g = bytes[i * 3 + 1] ?? 0;
      const b = bytes[i * 3 + 2] ?? 0;
      const offset = i * 4;

      if (grayscale) {
        const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
        imageData.data[offset] = gray;
        imageData.data[offset + 1] = gray;
        imageData.data[offset + 2] = gray;
      } else {
        imageData.data[offset] = r;
        imageData.data[offset + 1] = g;
        imageData.data[offset + 2] = b;
      }

      imageData.data[offset + 3] = 255; // Alpha
    }

    ctx.putImageData(imageData, 0, 0);
  }, [valuesFreeRNG, grayscale, chainMode]);

  return (
  <div className="w-full mt-8">
    {/* Full-bleed a mòbil; normal a md+ */}
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
      <div className="flex justify-center pl-5 md:pl-0 pr-5 md:pr-0 pt-10 md:pt-0 ">
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
  Accepta:
  - grayscale: true → converteix a tons de gris
  - chainMode: true → usa tots els bytes concatenats com a stream
*/
