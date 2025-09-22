import React, {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';

const DualSlider = forwardRef(function DualSlider(
  { minLimit, maxLimit, minValue, maxValue, onChange },
  ref
) {
  const clampReal = (v) => Math.min(Math.max(v, minLimit), maxLimit);
  const toInternal = (real) => clampReal(real) - minLimit;
  const toReal = (internal) => clampReal(internal + minLimit);

  const INTERNAL_MIN = 0;
  const INTERNAL_MAX = Math.max(1, maxLimit - minLimit); // evita div/0

  const [internalMin, setInternalMin] = useState(toInternal(minValue));
  const [internalMax, setInternalMax] = useState(toInternal(maxValue));

  const [minInputVal, setMinInputVal] = useState(String(clampReal(minValue)));
  const [maxInputVal, setMaxInputVal] = useState(String(clampReal(maxValue)));

  const [minThumbLeft, setMinThumbLeft] = useState(0);
  const [maxThumbLeft, setMaxThumbLeft] = useState(0);

  const rangeRef = useRef(null);

  // 🔁 Notifica pare + inputs quan canvia l’estat intern
  useEffect(() => {
    const rMin = toReal(internalMin);
    const rMax = toReal(internalMax);
    onChange?.(rMin, rMax);
    setMinInputVal(String(rMin));
    setMaxInputVal(String(rMax));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [internalMin, internalMax]);

  // 🎯 Reposiciona thumbs segons ample del track
  useLayoutEffect(() => {
    const trackWidth = rangeRef.current?.offsetWidth || 0;
    const thumbWidth = 24;
    const usable = Math.max(0, trackWidth - thumbWidth);
    setMinThumbLeft((internalMin / INTERNAL_MAX) * usable + thumbWidth / 2);
    setMaxThumbLeft((internalMax / INTERNAL_MAX) * usable + thumbWidth / 2);
  }, [internalMin, internalMax, INTERNAL_MAX]);

  // 🔄 Sync amb canvis de props (per si el pare canvia minValue/maxValue)
  useEffect(() => {
    setInternalMin(toInternal(minValue));
  }, [minValue, minLimit, maxLimit]);

  useEffect(() => {
    setInternalMax(toInternal(maxValue));
  }, [maxValue, minLimit, maxLimit]);

  // 🧰 API imperativa per moure el slider des del pare
  useImperativeHandle(ref, () => ({
    setRange(realMin, realMax) {
      const a = clampReal(realMin);
      const b = clampReal(realMax);
      const lo = Math.min(a, b);
      const hi = Math.max(a, b);
      setInternalMin(toInternal(lo));
      setInternalMax(toInternal(hi));
      setMinInputVal(String(lo));
      setMaxInputVal(String(hi));
    },
  }));

  const handleMinInputChange = (e) => {
    const val = Number(e.target.value);
    setMinInputVal(e.target.value);
    if (!Number.isNaN(val)) {
      const v = clampReal(val);
      if (v < toReal(internalMax)) setInternalMin(toInternal(v));
    }
  };

  const handleMaxInputChange = (e) => {
    const val = Number(e.target.value);
    setMaxInputVal(e.target.value);
    if (!Number.isNaN(val)) {
      const v = clampReal(val);
      if (v > toReal(internalMin)) setInternalMax(toInternal(v));
    }
  };

  return (
    <div className="relative w-full mt-6">
      <div className="flex items-center justify-between w-full">
        <div className="text-xs font-semibold text-[#1e2a38] pr-2 pb-0.5">{minLimit}</div>

        <div className="relative flex-grow -translate-x-2.5">
          {/* Inputs centrats sobre cada thumb */}
          <input
            type="text"
            value={minInputVal}
            onChange={handleMinInputChange}
            className="absolute w-[48px] text-sm font-bold text-center text-[#1e2a38] bg-gray-100 border border-gray-300 rounded"
            style={{ transform: 'translateX(-50%)', left: `${minThumbLeft}px`, top: '-37px' }}
          />
          <input
            type="text"
            value={maxInputVal}
            onChange={handleMaxInputChange}
            className="absolute w-[48px] text-sm font-bold text-center text-[#1e2a38] bg-gray-100 border border-gray-300 rounded"
            style={{ transform: 'translateX(-50%)', left: `${maxThumbLeft}px`, top: '23px' }}
          />

          {/* Sliders */}
          <input
            ref={rangeRef}
            type="range"
            min={INTERNAL_MIN}
            max={INTERNAL_MAX}
            value={internalMin}
            step={1}
            onChange={(e) => {
              const v = Math.min(Number(e.target.value), internalMax - 1);
              setInternalMin(v);
            }}
            className="absolute appearance-none w-full h-2 bg-transparent z-50 pointer-events-auto thumb-min"
            style={{ top: '-6px' }}
          />

          <input
            type="range"
            min={INTERNAL_MIN}
            max={INTERNAL_MAX}
            value={internalMax}
            step={1}
            onChange={(e) => {
              const v = Math.max(Number(e.target.value), internalMin + 1);
              setInternalMax(v);
            }}
            className="absolute appearance-none w-full h-2 bg-transparent z-40 pointer-events-auto thumb-max"
            style={{ top: '6px' }}
          />

          {/* Barra visual */}
          <div className="relative w-[96.5%] mx-auto h-2 bg-[#94a3b8] rounded overflow-hidden mt-0">
            <div
              className="absolute h-full bg-gray-600"
              style={{
                left: `${(internalMin / INTERNAL_MAX) * 100}%`,
                width: `${((internalMax - internalMin) / INTERNAL_MAX) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="text-xs font-semibold text-[#1e2a38] pr-3.5 pb-0.75 -translate-x-2.5">{maxLimit}</div>
      </div>
    </div>
  );
});

export default DualSlider;
