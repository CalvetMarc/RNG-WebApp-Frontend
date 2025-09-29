import { loadPcgWasm } from '../rngLib/pcg32_wasm_loader';

let pcgPromise = null;
async function getPcg() {
  if (!pcgPromise) pcgPromise = loadPcgWasm();
  return pcgPromise;
}

// 🔹 Internal helper to establish the seed
function getSeed(seedType = 'random', customSeed = '') {
  if (seedType === 'random') {
    return crypto.getRandomValues(new Uint32Array(1))[0] >>> 0;
  }
  return (Number.parseInt(customSeed, 10) >>> 0) || 0;
}

// 🔒 Internal function (not exported)
async function generateRandomValues(
  quantity = 1,
  min = 0,
  max = 100,
  seedType = 'random',
  customSeed = '',
  useU32 = false
) {
  const seedU32 = getSeed(seedType, customSeed);
  if (min > max) [min, max] = [max, min];

  const pcg = await getPcg();
  pcg.setSeed(seedU32);

  const values = [];

  if (useU32) {
    const minU = min >>> 0;
    const maxU = max >>> 0;
    const spanU = (maxU - minU + 1) >>> 0;

    for (let i = 0; i < quantity; i++) {
      const u = pcg.nextU32();        // 0..2^32-1
      const v = (u % spanU) + minU;   // mapejat a [minU,maxU]
      values.push(v >>> 0);
    }
  } else {
    const minS = min | 0;
    const maxS = max | 0;
    for (let i = 0; i < quantity; i++) {
      values.push(pcg.between(minS, maxS) | 0);
    }
  }

  return values;
}

/**
 * Public API → returns a single value [min,max] (inclusive).
 */
export async function pcgBetween(
  min,
  max,
  seedType = 'random',
  customSeed = '',
  useU32 = false
) {
  const values = await generateRandomValues(1, min, max, seedType, customSeed, useU32);
  return values[0];
}

/**
 * Public API → returns multiple values.
 */
export async function pcgSeries(
  quantity,
  min = 0,
  max = 100,
  seedType = 'random',
  customSeed = '',
  useU32 = false
) {
  return await generateRandomValues(quantity, min, max, seedType, customSeed, useU32);
}
