import React, { useEffect, useMemo, useState } from "react";
import * as Slider from "@radix-ui/react-slider";

export default function SingleSlider({
  min,
  max,
  value,
  onChange,
  barSizePercentage = 96.5,
}) {
  const INTERNAL_MIN = 0;
  const INTERNAL_MAX = useMemo(() => Math.max(1, max - min), [min, max]);
  const toInternal = (real) => real - min;
  const toReal = (internal) => internal + min;

  const [internalVal, setInternalVal] = useState(toInternal(value));
  const [inputVal, setInputVal] = useState(String(value));

  useEffect(() => {
    setInternalVal(toInternal(value));
    setInputVal(String(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, min, max]);

  useEffect(() => {
    const real = toReal(internalVal);
    onChange?.(real);
    setInputVal(String(real));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [internalVal]);

  const handleInputChange = (e) => {
    const valStr = e.target.value;
    setInputVal(valStr);
    const n = Number(valStr);
    if (!Number.isNaN(n) && n >= min && n <= max) {
      setInternalVal(toInternal(n));
    }
  };

  return (
    <div className="relative w-full mt-6">
      <div className="flex items-center justify-between w-full">
        <div className="text-xs font-semibold text-[#1e2a38] pr-2 pb-0.5">{min}</div>

        <div className="relative flex-grow -translate-x-2.5">
          <div className="mx-auto" style={{ width: `${barSizePercentage}%` }}>
            <Slider.Root
              className="relative flex items-center select-none touch-none h-6"
              min={INTERNAL_MIN}
              max={INTERNAL_MAX}
              step={1}
              value={[internalVal]}
              onValueChange={([v]) => setInternalVal(v)}
            >
              <Slider.Track className="relative h-2 w-full rounded bg-[#94a3b8] overflow-hidden">
                <Slider.Range className="absolute h-full bg-gray-500" />
              </Slider.Track>

              <Slider.Thumb
                className="block h-4 w-4 rounded-full bg-[#1e2a38] shadow"
                aria-label="Value"
              >
                <input
                  type="text"
                  value={inputVal}
                  onChange={handleInputChange}
                  // ⚠️ Aturem només la propagació; no fem preventDefault
                  onPointerDown={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                  onPointerUp={(e) => e.stopPropagation()}
                  onMouseUp={(e) => e.stopPropagation()}
                  onTouchEnd={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                  className="absolute w-[48px] -top-7 left-1/2 -translate-x-1/2
                             text-sm font-bold text-center text-[#1e2a38]
                             bg-gray-100 border border-gray-300 rounded"
                />
              </Slider.Thumb>
            </Slider.Root>
          </div>
        </div>

        <div className="text-xs font-semibold text-[#1e2a38] pr-3.5 pb-0.75 -translate-x-2.5">{max}</div>
      </div>
    </div>
  );
}
