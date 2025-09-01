import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';

function SingleSlider({
  min,
  max,
  value,
  onChange,
  barSizePercentage = 96.5, // ✅ Valor per defecte
}) {
  const INTERNAL_MIN = 0;
  const INTERNAL_MAX = max - min;

  const toInternal = (real) => real - min;
  const toReal = (internal) => internal + min;

  const [internalVal, setInternalVal] = useState(toInternal(value));
  const [inputVal, setInputVal] = useState(value.toString());
  const [thumbLeft, setThumbLeft] = useState(0);

  const rangeRef = useRef(null);

  useEffect(() => {
    const real = toReal(internalVal);
    onChange(real);
    setInputVal(real.toString());
  }, [internalVal]);

  useLayoutEffect(() => {
    const input = rangeRef.current;
    if (!input) return;

    const trackWidth = input.offsetWidth;
    const thumbWidth = 24;
    const left = (internalVal / INTERNAL_MAX) * (trackWidth - thumbWidth) + thumbWidth / 2;

    setThumbLeft(left);
  }, [internalVal, INTERNAL_MAX]);

  const handleInputChange = (e) => {
    const valStr = e.target.value;
    setInputVal(valStr);
    const val = Number(valStr);
    if (!isNaN(val) && val >= min && val <= max) {
      setInternalVal(toInternal(val));
    }
  };

  return (
    <div className="relative w-full mt-6">
      <div className="flex items-center justify-between w-full">
        <div className="text-xs font-semibold text-[#1e2a38] pr-2 pb-0.5">{min}</div>

        <div className="relative flex-grow -translate-x-2.5">
          <input
            type="text"
            value={inputVal}
            onChange={handleInputChange}
            className="absolute w-[48px] text-sm font-bold text-center text-[#1e2a38] bg-gray-100 border border-gray-300 rounded"
            style={{
              transform: "translateX(-50%)",
              left: `${thumbLeft}px`,
              top: "-37px",
            }}
          />

          <input
            ref={rangeRef}
            type="range"
            min={INTERNAL_MIN}
            max={INTERNAL_MAX}
            value={internalVal}
            step={1}
            onChange={(e) => setInternalVal(Number(e.target.value))}
            className="absolute appearance-none w-full h-2 bg-transparent z-10 pointer-events-auto thumb-min"
            style={{ top: "-6px" }}
          />

          {/* ✅ Aquí substituïm w-[96.5%] per style dinamitzat */}
          <div
            className="relative mx-auto h-2 bg-[#94a3b8] rounded overflow-hidden"
            style={{ width: `${barSizePercentage}%` }}
          >
            <div
              className="absolute h-full bg-gray-600"
              style={{
                width: `${(internalVal / INTERNAL_MAX) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="text-xs font-semibold text-[#1e2a38] pr-3.5 pb-0.75 -translate-x-2.5">{max}</div>
      </div>
    </div>
  );
}

export default SingleSlider;
