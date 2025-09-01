// IMPORTANT: aquest fitxer viu a src/workers/
// Envia un "ready" immediat per comprovar que està viu
self.postMessage({ type: 'ready' });

function fallbackTriple(seed, quantity) {
  const a = new Uint32Array(quantity);
  const b = new Uint32Array(quantity);
  const c = new Uint32Array(quantity);
  let s1 = (seed >>> 0) || 0x9e3779b9;
  let s2 = (seed ^ 0x6a09e667) >>> 0;
  let s3 = (seed ^ 0x3c6ef372) >>> 0;
  for (let i = 0; i < quantity; i++) {
    s1 = (Math.imul(s1, 1664525) + 1013904223) | 0; a[i] = s1 >>> 0;
    s2 = (Math.imul(s2, 22695477) + 1) | 0;        b[i] = s2 >>> 0;
    s3 = (Math.imul(s3, 1103515245) + 12345) | 0;  c[i] = s3 >>> 0;
  }
  return { RNG1: a, RNG2: b, RNG3: c };
}

function histogram256(u32arr) {
  const bins = new Uint32Array(256);
  for (let i = 0; i < u32arr.length; i++) bins[(u32arr[i] >>> 24) & 0xff]++;
  return bins;
}

self.addEventListener('message', async (e) => {
  const { jobId, seed, quantity } = e.data || {};
  try {
    let mod = null;
    try {
      // ⬅️ Vite-friendly: resol la ruta des del worker
      mod = await import(new URL('../utils/generateRNG.js', import.meta.url));
    } catch (impErr) {
      // Si falla, continuem amb fallback però no fem timeout
      console.warn('[worker] dynamic import failed, using fallback:', impErr);
    }

    let RNG1, RNG2, RNG3;
    if (mod?.generateTripleU32) {
      const res = await mod.generateTripleU32(seed, quantity);
      RNG1 = res.RNG1; RNG2 = res.RNG2; RNG3 = res.RNG3;
    } else {
      ({ RNG1, RNG2, RNG3 } = fallbackTriple(seed, quantity));
    }

    const h1 = histogram256(RNG1);
    const h2 = histogram256(RNG2);
    const h3 = histogram256(RNG3);

    self.postMessage(
      {
        jobId,
        ok: true,
        length: quantity,
        buffers: {
          RNG1: RNG1.buffer,
          RNG2: RNG2.buffer,
          RNG3: RNG3.buffer,
        },
        histograms: {
          RNG1: h1.buffer,
          RNG2: h2.buffer,
          RNG3: h3.buffer,
        },
      },
      [RNG1.buffer, RNG2.buffer, RNG3.buffer, h1.buffer, h2.buffer, h3.buffer]
    );
  } catch (err) {
    self.postMessage({ jobId, ok: false, error: String(err?.message ?? err) });
  }
});
