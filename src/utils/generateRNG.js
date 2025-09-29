// utils/generateRNG.js
import { loadPcgWasm } from '../rngLib/pcg32_wasm_loader';

let pcgPromise = null;
async function getPcg() {
  if (!pcgPromise) pcgPromise = loadPcgWasm();
  return pcgPromise;
}

function nextU32FromBetween(pcg) {
  const hi = pcg.between(0, 0xFFFF) | 0; // 16 bits alts
  const lo = pcg.between(0, 0xFFFF) | 0; // 16 bits baixos
  return (((hi & 0xFFFF) << 16) | (lo & 0xFFFF)) >>> 0; // uint32
}

// Decideix seed (intern)
function resolveSeed(seedMode = 'random', seedInput = '') {
  if (seedMode === 'fixed') {
    const n = Number.parseInt(String(seedInput), 10);
    return (Number.isFinite(n) ? n : 0) >>> 0;
  }
  try {
    return (crypto.getRandomValues(new Uint32Array(1))[0]) >>> 0;
  } catch {
    return ((Date.now() ^ (performance.now() * 1000) ^ (Math.random() * 1e9)) >>> 0);
  }
}

/** API pública → retorna múltiples valors (inclusiu). */
export async function pcgSeries(
  quantity = 1000,
  min = 0,
  max = 100,
  seedMode = 'random',   // 'random' | 'fixed'
  seedInput = '',        // si 'fixed', s'usarà aquest valor
  useU32 = false
) {
  const pcg = await getPcg();

  // Normalitza el rang
  if (min > max) { const t = min; min = max; max = t; }

  const seed = resolveSeed(seedMode, seedInput);
  pcg.setSeed(seed);

  const values = new Array(quantity);

  if (useU32) {
    // 🔁 sense betweenU32: fem servir 2×between(0..0xFFFF) per formar un uint32
    const minU = min >>> 0;
    const maxU = max >>> 0;
    const spanU = ((maxU - minU + 1) >>> 0) || 0x100000000; // evita 0 si [0, 2^32-1]
    for (let i = 0; i < quantity; i++) {
      const u = nextU32FromBetween(pcg);           // 0..2^32-1
      values[i] = ((u % spanU) + minU) >>> 0;      // mapeig inclusiu
    }
  } else {
    const minS = min | 0, maxS = max | 0;
    for (let i = 0; i < quantity; i++) {
      values[i] = (pcg.between(minS, maxS) | 0);
    }
  }

  return values;
}

/** API pública → un sol valor [min,max] (inclusiu). */
export async function pcgBetween(min, max, seedMode = 'random', seedInput = '', useU32 = false) {
  const arr = await pcgSeries(1, min, max, seedMode, seedInput, useU32);
  return arr[0];
}
