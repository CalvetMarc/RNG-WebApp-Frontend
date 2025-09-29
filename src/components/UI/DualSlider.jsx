import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from "react";
import * as Slider from "@radix-ui/react-slider";

const DualSlider = forwardRef(function DualSlider(
  {
    minLimit,
    maxLimit,
    minValue,
    maxValue,
    onChange,
    barSizePercentage = 96.5, // opcional, igual que al teu SingleSlider
    minGap = 1,               // separació mínima entre thumbs en unitats reals
  },
  ref
) {
  const clampReal = (v) => Math.min(Math.max(v, minLimit), maxLimit);
  const toInternal = (real) => clampReal(real) - minLimit;
  const toReal = (internal) => clampReal(internal + minLimit);

  const INTERNAL_MIN = 0;
  const INTERNAL_MAX = useMemo(
    () => Math.max(minGap, maxLimit - minLimit),
    [minLimit, maxLimit, minGap]
  );

  // Estat intern (Radix treballa amb arrays de valors)
  const [internalMin, setInternalMin] = useState(toInternal(minValue));
  const [internalMax, setInternalMax] = useState(toInternal(maxValue));

  // Inputs (text) visibles
  const [minInputVal, setMinInputVal] = useState(String(clampReal(minValue)));
  const [maxInputVal, setMaxInputVal] = useState(String(clampReal(maxValue)));

  // Sync inicial/extern
  useEffect(() => {
    setInternalMin(toInternal(minValue));
    setMinInputVal(String(clampReal(minValue)));
  }, [minValue, minLimit, maxLimit]);

  useEffect(() => {
    setInternalMax(toInternal(maxValue));
    setMaxInputVal(String(clampReal(maxValue)));
  }, [maxValue, minLimit, maxLimit]);

  // Notifica cap amunt quan canvia l’interval intern
  useEffect(() => {
    const rMin = toReal(internalMin);
    const rMax = toReal(internalMax);
    onChange?.(rMin, rMax);
    setMinInputVal(String(rMin));
    setMaxInputVal(String(rMax));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [internalMin, internalMax]);

  // API imperativa
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

  // Gestor Radix: evita que es creuin i respecta minGap
  const handleValueChange = ([a, b]) => {
    if (b - a < minGap) {
      const mid = (a + b) / 2;
      a = Math.round(mid - minGap / 2);
      b = Math.round(mid + minGap / 2);
    }
    a = Math.max(INTERNAL_MIN, Math.min(a, INTERNAL_MAX - minGap));
    b = Math.min(INTERNAL_MAX, Math.max(b, INTERNAL_MIN + minGap));
    setInternalMin(a);
    setInternalMax(b);
  };

  // Inputs manuals
  const handleMinInputChange = (e) => {
    const raw = e.target.value;
    setMinInputVal(raw);
    const n = Number(raw);
    if (!Number.isNaN(n)) {
      const v = clampReal(n);
      if (v <= toReal(internalMax - minGap)) setInternalMin(toInternal(v));
    }
  };

  const handleMaxInputChange = (e) => {
    const raw = e.target.value;
    setMaxInputVal(raw);
    const n = Number(raw);
    if (!Number.isNaN(n)) {
      const v = clampReal(n);
      if (v >= toReal(internalMin + minGap)) setInternalMax(toInternal(v));
    }
  };

  // 🔒 Evita que el clic/touch/tecles als inputs moguin el slider
  const stop = (e) => e.stopPropagation();

  return (
    <div className="relative w-full mt-6">
      <div className="flex items-center justify-between w-full">
        <div className="text-xs font-semibold text-[#1e2a38] pr-2 pb-0.5">
          {minLimit}
        </div>

        <div className="relative flex-grow -translate-x-2.5">
          <div className="mx-auto" style={{ width: `${barSizePercentage}%` }}>
            <Slider.Root
              className="relative flex items-center select-none touch-none h-10"
              min={INTERNAL_MIN}
              max={INTERNAL_MAX}
              step={1}
              value={[internalMin, internalMax]}
              onValueChange={handleValueChange}
            >
              {/* Pista */}
              <Slider.Track className="relative h-2 w-full rounded bg-[#94a3b8] overflow-hidden">
                <Slider.Range className="absolute h-full bg-gray-500" />
              </Slider.Track>

              {/* Thumb MIN */}
              <Slider.Thumb
                className="block h-4 w-4 rounded-full bg-[#1e2a38]"
                aria-label="Minimum value"
              >
                {/* Input sobre el polsador (més separat) */}
                <input
                  type="text"
                  value={minInputVal}
                  onChange={handleMinInputChange}
                  onPointerDown={stop}
                  onMouseDown={stop}
                  onTouchStart={stop}
                  onClick={stop}
                  onPointerUp={stop}
                  onMouseUp={stop}
                  onTouchEnd={stop}
                  onKeyDown={stop}
                  className="absolute w-[56px] -top-7 left-1/2 -translate-x-1/2
                             text-sm font-bold text-center text-[#1e2a38]
                             bg-gray-100 border border-gray-300 rounded"
                />
              </Slider.Thumb>

              {/* Thumb MAX */}
              <Slider.Thumb
                className="block h-4 w-4 rounded-full bg-[#1e2a38]"
                aria-label="Maximum value"
              >
                {/* Input sota el polsador (més separat) */}
                <input
                  type="text"
                  value={maxInputVal}
                  onChange={handleMaxInputChange}
                  onPointerDown={stop}
                  onMouseDown={stop}
                  onTouchStart={stop}
                  onClick={stop}
                  onPointerUp={stop}
                  onMouseUp={stop}
                  onTouchEnd={stop}
                  onKeyDown={stop}
                  className="absolute w-[56px] top-5.5 left-1/2 -translate-x-1/2
                             text-sm font-bold text-center text-[#1e2a38]
                             bg-gray-100 border border-gray-300 rounded"
                />
              </Slider.Thumb>
            </Slider.Root>
          </div>
        </div>

        <div className="text-xs font-semibold text-[#1e2a38] pr-3.5 pb-0.75 -translate-x-2.5">
          {maxLimit}
        </div>
      </div>
    </div>
  );
});

export default DualSlider;
