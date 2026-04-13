import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function Tooltip({
  text,
  from = "down",
  children,
  autoCloseMs = 2500,
}) {
  const map = {
    down: { boxPos: "top-full mt-2 left-1/2 -translate-x-1/2", arrowPos: "-top-1 left-1/2 -translate-x-1/2" },
    up:   { boxPos: "bottom-full mb-2 left-1/2 -translate-x-1/2", arrowPos: "-bottom-1 left-1/2 -translate-x-1/2" },
    left: { boxPos: "right-full mr-2 top-1/2 -translate-y-1/2", arrowPos: "-right-1 top-1/2 -translate-y-1/2" },
    right:{ boxPos: "left-full ml-2 top-1/2 -translate-y-1/2", arrowPos: "-left-1 top-1/2 -translate-y-1/2" },
  };
  const cfg = map[from] ?? map.down;

  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const timerRef = useRef(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const onClickTrigger = () => {
    setOpen(true);
    if (autoCloseMs) {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setOpen(false), autoCloseMs);
    }
  };

  useEffect(() => {
    const handleDocClick = (e) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", handleDocClick);
    return () => document.removeEventListener("click", handleDocClick);
  }, []);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <div
      ref={rootRef}
      className="relative inline-block group focus-within:outline-none"
      onClick={onClickTrigger}
      onMouseLeave={() => setOpen(false)}
    >
      <div className="inline-flex items-center gap-1">{children}</div>

      {/* Desktop: tooltip relativo al trigger */}
      {!isMobile && (
        <div
          role="tooltip"
          className={[
            "absolute z-50 px-3 py-2 text-xs font-medium text-gray-300 bg-gray-800 rounded-md shadow w-[400px] text-left",
            open ? "opacity-100" : "opacity-0",
            "group-hover:opacity-100 group-focus-within:opacity-100",
            "transition-opacity duration-150 ease-out",
            "pointer-events-none",
            cfg.boxPos,
          ].join(" ")}
        >
          {text}
          <div className={["absolute w-2 h-2 bg-gray-800 rotate-45", cfg.arrowPos].join(" ")} />
        </div>
      )}

      {/* Mobile: portal al body para evitar que transform rompa fixed */}
      {isMobile && open && createPortal(
        <div
          role="tooltip"
          className="fixed z-[9999] left-4 right-4 bottom-6 px-4 py-3 text-sm font-medium text-gray-300 bg-gray-800 rounded-lg shadow-lg text-left pointer-events-none"
          style={{ position: "fixed" }}
        >
          {text}
        </div>,
        document.body
      )}
    </div>
  );
}
