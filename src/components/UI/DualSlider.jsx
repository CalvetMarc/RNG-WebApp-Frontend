import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';

function DualSlider({ minLimit, maxLimit, minValue, maxValue, onChange }) {
  const toInternal = (real) => real - minLimit;
  const toReal = (internal) => internal + minLimit;
  const INTERNAL_MAX = maxLimit - minLimit;
  const INTERNAL_MIN = 0;

  const [internalMin, setInternalMin] = useState(toInternal(minValue));
  const [internalMax, setInternalMax] = useState(toInternal(maxValue));

  const [minInputVal, setMinInputVal] = useState(minValue.toString());
  const [maxInputVal, setMaxInputVal] = useState(maxValue.toString());

  const [minThumbLeft, setMinThumbLeft] = useState(0);
  const [maxThumbLeft, setMaxThumbLeft] = useState(0);

  const rangeRef = useRef(null);

  useEffect(() => {
    onChange(toReal(internalMin), toReal(internalMax));
    setMinInputVal(toReal(internalMin).toString());
    setMaxInputVal(toReal(internalMax).toString());
  }, [internalMin, internalMax]);

  useLayoutEffect(() => {
    const trackWidth = rangeRef.current?.offsetWidth || 0;
    const thumbWidth = 24;
    setMinThumbLeft((internalMin / INTERNAL_MAX) * (trackWidth - thumbWidth) + thumbWidth / 2);
    setMaxThumbLeft((internalMax / INTERNAL_MAX) * (trackWidth - thumbWidth) + thumbWidth / 2);
  }, [internalMin, internalMax, INTERNAL_MAX]);

  const handleMinInputChange = (e) => {
    const val = Number(e.target.value);
    setMinInputVal(e.target.value);
    if (!isNaN(val) && val >= minLimit && val < toReal(internalMax)) {
      setInternalMin(toInternal(val));
    }
  };

  const handleMaxInputChange = (e) => {
    const val = Number(e.target.value);
    setMaxInputVal(e.target.value);
    if (!isNaN(val) && val <= maxLimit && val > toReal(internalMin)) {
      setInternalMax(toInternal(val));
    }
  };

  return (
    <div className="relative w-full mt-6">
      <div className="flex items-center justify-between w-full">
        <div className="text-xs font-semibold text-[#1e2a38] pr-2 pb-0.5">{minLimit}</div>

        <div className="relative flex-grow -translate-x-2.5">
          {/* INPUTS centrats sobre cada thumb */}
          <input
            type="text"
            value={minInputVal}
            onChange={handleMinInputChange}
            className="absolute w-[48px] text-sm font-bold text-center text-[#1e2a38] bg-gray-100 border border-gray-300 rounded"
            style={{
              transform: 'translateX(-50%)',
              left: `${minThumbLeft}px`,
              top: '-37px',
            }}
          />
          <input
            type="text"
            value={maxInputVal}
            onChange={handleMaxInputChange}
            className="absolute w-[48px] text-sm font-bold text-center text-[#1e2a38] bg-gray-100 border border-gray-300 rounded"
            style={{
              transform: 'translateX(-50%)',
              left: `${maxThumbLeft}px`,
              top: '23px',
            }}
          />

          {/* Slider Thumbs */}
          <input
            ref={rangeRef}
            type="range"
            min={INTERNAL_MIN}
            max={INTERNAL_MAX}
            value={internalMin}
            step={1}
            onChange={(e) =>
              setInternalMin(Math.min(Number(e.target.value), internalMax - 1))
            }
            className="absolute appearance-none w-full h-2 bg-transparent z-50 pointer-events-auto thumb-min"
            style={{ top: '-6px' }}
          />

          <input
            type="range"
            min={INTERNAL_MIN}
            max={INTERNAL_MAX}
            value={internalMax}
            step={1}
            onChange={(e) =>
              setInternalMax(Math.max(Number(e.target.value), internalMin + 1))
            }
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
}

export default DualSlider;
