import React, { useEffect, useRef, useState } from "react";
import styles from "./ScrollBox.module.css";

export default function ScrollBox({ height, children, className = "" }) {
  const listRef = useRef(null);
  const [thumb, setThumb] = useState({ h: 0, top: 0, hasOverflow: false });

  const recompute = () => {
    const el = listRef.current;
    if (!el) return;
    const ch = el.clientHeight;
    const sh = el.scrollHeight;
    const hasOverflow = sh > ch + 0.5;

    const h = hasOverflow ? Math.max((ch / sh) * ch, 24) : ch;
    const maxTop = ch - h;
    const top = hasOverflow ? Math.min(maxTop, (el.scrollTop / (sh - ch)) * maxTop) : 0;

    setThumb({ h, top, hasOverflow });
  };

  useEffect(() => {
    recompute();
    const el = listRef.current;
    if (!el) return;
    const ro = new ResizeObserver(recompute);
    ro.observe(el);
    window.addEventListener("resize", recompute);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", recompute);
    };
  }, []);

  return (
    <div className="relative" style={{ height }}>
      <div
        ref={listRef}
        onScroll={recompute}
        className={`space-y-2 overflow-y-auto pr-3 [-webkit-overflow-scrolling:touch] ${styles.scrollHidden} ${className}`}
        style={{ height: "100%" }}
      >
        {children}
      </div>

      {/* rail + thumb fals */}
      <div
        className="pointer-events-none absolute right-0 top-0 h-full w-2.5"
        aria-hidden="true"
      >
        <div className="absolute right-0 top-0 h-full w-2.5 rounded-md bg-black/5" />
        <div
          className="absolute right-0 rounded-md bg-black/45 transition-transform"
          style={{
            width: "10px",
            height: `${thumb.h}px`,
            transform: `translateY(${thumb.top}px)`,
          }}
        />
      </div>
    </div>
  );
}
