// utils/generateRNG.js
import MersenneTwister from 'mersenne-twister';
import seedrandom from 'seedrandom';
import { loadPcgWasm } from '../rngLib/pcg32_wasm_loader';

// Cache the WASM module so we don't reload it
let pcgPromise = null;
async function getPcg() {
  if (!pcgPromise) pcgPromise = loadPcgWasm();
  return pcgPromise;
}

/**
 * Generate values with the 3 RNGs and return all series + the selected one.
 * - RNG1 = PCG32 (WASM)
 * - RNG2 = MT19937 (mersenne-twister)
 * - RNG3 = seedrandom.xorwow
 *
 * @param {'RNG1'|'RNG2'|'RNG3'} rngModel  which series is considered "active" for visuals
 * @param {number} seed                    preferably uint32
 * @param {number} min
 * @param {number} max
 * @param {number} quantity
 * @param {boolean} useU32                 if true, use uint32 arithmetic (art mode)
 */
export async function generateRandomValues(
  rngModel = 'RNG1',
  seed = Date.now(),
  min = 0,
  max = 100,
  quantity = 1000,
  useU32 = false
) {
  const seedU32 = seed >>> 0;

  // Ensure min <= max (UI should already do this, but just in case)
  if (min > max) [min, max] = [max, min];

  // Engines
  const pcg = await getPcg();
  pcg.setSeed(seedU32); // deterministic for the same seed (no setState(0)!)

  const mt = new MersenneTwister(seedU32);
  const srng = seedrandom.xorwow(String(seedU32));

  // Buffers
  const rng1 = []; // PCG32
  const rng2 = []; // MT19937
  const rng3 = []; // seedrandom.xorwow

  // Pre-casts
  const minS = (min | 0);
  const maxS = (max | 0);
  const minU = (min >>> 0);
  const maxU = (max >>> 0);

  for (let i = 0; i < quantity; i++) {
    // PCG: use dedicated uint32/int functions
    const v1 = useU32
      ? pcg.betweenU32(minU, maxU)
      : pcg.between(minS, maxS);
    rng1.push(v1);

    // MT & xorwow: when useU32, compute with uint32 span without bitwise truncation
    if (useU32) {
      const spanU = (maxU - minU + 1); // <= 2^32, safe in JS Number (53-bit mantissa)
      const v2 = Math.floor(mt.random() * spanU) + minU;
      const v3 = Math.floor(srng() * spanU) + minU;
      rng2.push(v2 >>> 0);
      rng3.push(v3 >>> 0);
    } else {
      const spanS = (maxS - minS + 1);
      const v2 = Math.floor(mt.random() * spanS) + minS;
      const v3 = Math.floor(srng() * spanS) + minS;
      rng2.push(v2 | 0);
      rng3.push(v3 | 0);
    }
  }

  const selected =
    rngModel === 'RNG1' ? rng1 :
    rngModel === 'RNG2' ? rng2 :
    rng3;

  return {
    rng1,
    rng2,
    rng3,
    selected,
    selectedKey: rngModel,
    meta: { seed: seedU32, min, max, quantity, useU32 },
  };
}
