import * as Tone from 'tone';
import React, { useEffect, useRef, useState } from 'react';

export default function MelodyPartitura({ events = [], loopEnd = 4 }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [size, setSize] = useState({ width: 800, height: 160 }); // mida CSS

  // 🔎 Observa canvis d'amplada del contenidor
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = Math.min(entry.contentRect.width, 800); // màxim 800
      const h = w < 768 ? 140 : 160;                    // una mica més baix a mòbil
      setSize({ width: w, height: h });
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => { setLoading(true); }, [events]);

  useEffect(() => {
    if (!events.length || loopEnd === 0) return;

    const init = async () => {
      cancelAnimationFrame(animationRef.current);
      await new Promise((res) => setTimeout(res, 400));

      let attempts = 0;
      while (Tone.Transport.state !== 'started' && attempts < 20) {
        await new Promise((res) => setTimeout(res, 30));
        attempts++;
      }
      await new Promise((res) => setTimeout(res, 200));

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      // 🖥️ Escalat per DPR perquè es vegi nítid
      const dpr = window.devicePixelRatio || 1;
      canvas.style.width  = `${size.width}px`;
      canvas.style.height = `${size.height}px`;
      canvas.width  = Math.floor(size.width  * dpr);
      canvas.height = Math.floor(size.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // escala el “món” a unitats CSS

      const offsetY = -1.5 * 13;
      const noteY = {
        C4: 120 + 3 * 6.5 + offsetY,
        D4: 120 + 2 * 6.5 + offsetY,
        E4: 120 + 1 * 6.5 + offsetY,
        G4: 120 - 1 * 6.5 + offsetY,
        A4: 120 - 2 * 6.5 + offsetY,
        C5: 120 - 4 * 6.5 + offsetY,
      };

      // 📏 Pots ajustar pxPerSec segons l’amplada si vols
      const pxPerSec = size.width >= 700 ? 200 : 140;
      const noteHeight = 10;
      const centerX = size.width / 2;

      const draw = (elapsedSec) => {
        ctx.clearRect(0, 0, size.width, size.height);

        // Fons
        ctx.fillStyle = '#e5e7eb';
        ctx.fillRect(0, 0, size.width, size.height);

        // Línies de pentagrama
        const staffTop = 55;
        const staffSpacing = 13;
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
          const y = staffTop + i * staffSpacing;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(size.width, y);
          ctx.stroke();
        }

        // Títol
        ctx.font = 'bold 20px Inter, sans-serif';
        ctx.fillStyle = '#1E2A38';
        ctx.fillText('𝄞  – C Major – ', 10, 25);
        const baseWidth = ctx.measureText('𝄞  – C Major – ').width;
        ctx.fillStyle = '#3DA9FC'; ctx.fillText('Even', 10 + baseWidth, 25);
        const evenWidth = ctx.measureText('Even').width;
        ctx.fillStyle = '#1E2A38'; ctx.fillText(' / ', 10 + baseWidth + evenWidth, 25);
        ctx.fillStyle = '#4ADEDE'; ctx.fillText('Odd', 10 + baseWidth + evenWidth + ctx.measureText(' / ').width, 25);

        // Notes
        for (let i = 0; i < events.length; i++) {
          const [time, { note, duration, original }] = events[i];
          const x = time * pxPerSec - (Tone.Transport.seconds % loopEnd) * pxPerSec + centerX;
          const w = duration * pxPerSec;
          const y = noteY[note] || 100;
          if (x + w < 0 || x > size.width) continue;

          const isEven = typeof original === 'number' && original % 2 === 0;
          ctx.fillStyle = isEven ? '#3DA9FC' : '#4ADEDE';
          ctx.fillRect(x, y - noteHeight / 2, w, noteHeight);

          ctx.strokeStyle = 'rgba(71, 71, 71, 1)';
          ctx.lineWidth = 4;
          ctx.strokeRect(x, y - noteHeight / 2, w, noteHeight);
        }

        // Indicador
        ctx.fillStyle = '#F87171';
        ctx.fillRect(centerX - 1, 0, 2, size.height);
      };

      const tick = () => {
        draw(Tone.Transport.seconds % loopEnd);
        animationRef.current = requestAnimationFrame(tick);
      };

      setLoading(false);
      tick();
    };

    init();
    return () => cancelAnimationFrame(animationRef.current);
  }, [events, loopEnd, size]);

  return (
    <div className="w-full flex justify-center mt-2 mb-10">
      <div ref={containerRef} className="w-full max-w-5xl px-4 bg-[#b0cad2] rounded-lg py-6 relative">
        {loading && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <p className="text-sm text-gray-600 animate-pulse">🎼 Loading sheet music...</p>
          </div>
        )}
        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            className={`rounded ${loading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          />
        </div>
      </div>
    </div>
  );
}
