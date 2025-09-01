// src/rngLib/pcg32_wasm_loader.js

// On servim els artefactes Emscripten (copiats a /public)
const LOCAL_BASE = '';
const GLUE_JS    = `/pcg_rng.js`;

let cached = null; // evita recàrregues

export async function loadPcgWasm() {
  if (cached) return cached;

  // Import dinàmic del glue JS (Emscripten ESM)
  const ModuleFactory = (await import(/* @vite-ignore */ `${GLUE_JS}?module`)).default;

  // Indiquem a Emscripten on és el .wasm (mateixa carpeta)
  const Module = await ModuleFactory({
    locateFile: (path) => `${LOCAL_BASE}/${path}`, // ex: "pcg_rng.wasm" → "/wasm/pcg_rng.wasm"
  });

  // --- signatures i64 -> BigInt ---
  const set_seed          = Module.cwrap('set_seed',          null,     ['bigint']); // uint64_t
  const reset_rng         = Module.cwrap('reset_rng',         null,     ['bigint']); // uint64_t
  const get_state         = Module.cwrap('get_state',         'bigint', []);         // uint64_t
  const set_state         = Module.cwrap('set_state',         null,     ['bigint']); // uint64_t

  // --- la resta són i32/double ---
  const pcg32             = Module.cwrap('pcg32',             'number', []);
  const pcg_normalized    = Module.cwrap('pcg_normalized',    'number', []);
  const pcg_between       = Module.cwrap('pcg_between',       'number', ['number','number','number','number']);
  const pcg_between_u32   = Module.cwrap('pcg_between_u32',   'number', ['number','number','number','number']);
  const pcg_between_float = Module.cwrap('pcg_between_float', 'number', ['number','number']);
  const pcg_bool          = Module.cwrap('pcg_bool',          'number', []);

  const toU32BigInt = (x) => BigInt(x >>> 0);

  cached = {
    // 🌱 Seed/state
    setSeed:  (seed) => set_seed(toU32BigInt(seed)),
    reset:    (seed) => reset_rng(toU32BigInt(seed)),
    getState: ()     => get_state(),             // BigInt
    setState: (s)    => set_state(toU32BigInt(s)),

    // 🔢 Core
    pcg32:      () => pcg32() >>> 0,
    normalized: () => pcg_normalized(),

    // 🎲 Rangs
    between:    (min, max, incMin = true, incMax = true) =>
                  pcg_between(min|0, max|0, incMin ? 1 : 0, incMax ? 1 : 0) | 0,

    betweenU32: (min, max, incMin = true, incMax = true) =>
                  pcg_between_u32(min >>> 0, max >>> 0, incMin ? 1 : 0, incMax ? 1 : 0) >>> 0,

    betweenFloat: (min, max) => +pcg_between_float(+min, +max),

    // 🔘 Bool
    bool: () => !!pcg_bool(),
  };

  return cached;
}
