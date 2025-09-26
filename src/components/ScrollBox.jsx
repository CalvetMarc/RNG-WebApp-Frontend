import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./ScrollBox.module.css";

export default function ScrollBox({
  height,
  children,
  className = "",
  thumbMin = 24,
  railWidth = 16,
  railGap = 8,
}) {
  const listRef = useRef(null);
  const contentRef = useRef(null);
  const [thumb, setThumb] = useState({ h: 0, top: 0, hasOverflow: false });

  const dragRef = useRef({
    active: false,
    startY: 0,
    startTop: 0,
    ch: 0,
    sh: 0,
    maxTop: 0,
  });

  const recompute = () => {
    const el = listRef.current;
    if (!el) return;

    const ch = el.clientHeight;
    const sh = el.scrollHeight;
    const hasOverflow = sh > ch + 0.5;

    // 👇 clamp de scrollTop per evitar valors negatius o > sh-ch (iOS rubber-banding)
    const maxScroll = Math.max(0, sh - ch);
    const clampedScrollTop = Math.max(0, Math.min(el.scrollTop, maxScroll));

    const h = hasOverflow ? Math.max((ch / Math.max(1, sh)) * ch, thumbMin) : ch;
    const maxTop = ch - h;

    // 👇 sempre clamp del top
    const top = hasOverflow
      ? Math.max(0, Math.min(maxTop, (clampedScrollTop / Math.max(1, (sh - ch))) * maxTop))
      : 0;

    setThumb({ h, top, hasOverflow });
  };

  const onRailClick = (e) => {
    if (!thumb.hasOverflow) return;
    const rail = e.currentTarget.getBoundingClientRect();
    const clickY = e.clientY - rail.top;

    const ch = listRef.current.clientHeight;
    const sh = listRef.current.scrollHeight;
    const h = thumb.h;
    const maxTop = ch - h;

    let targetTop = Math.max(0, Math.min(maxTop, clickY - h / 2));
    const ratio = maxTop > 0 ? targetTop / maxTop : 0;

    // 👇 també clamp del scroll objectiu
    const maxScroll = Math.max(0, sh - ch);
    listRef.current.scrollTop = Math.max(0, Math.min(maxScroll, ratio * maxScroll));

    requestAnimationFrame(recompute);
  };

  const onThumbPointerDown = (e) => {
    if (!thumb.hasOverflow) return;
    const el = listRef.current;
    if (!el) return;

    e.currentTarget.setPointerCapture?.(e.pointerId);

    const ch = el.clientHeight;
    const sh = el.scrollHeight;

    dragRef.current.active = true;
    dragRef.current.startY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    dragRef.current.startTop = thumb.top;
    dragRef.current.ch = ch;
    dragRef.current.sh = sh;
    dragRef.current.maxTop = ch - thumb.h;

    document.body.style.userSelect = "none";
  };

  const onThumbPointerMove = (e) => {
    if (!dragRef.current.active) return;
    const el = listRef.current;
    if (!el) return;

    const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    const dy = clientY - dragRef.current.startY;

    const newTop = Math.max(0, Math.min(dragRef.current.maxTop, dragRef.current.startTop + dy));
    const ratio = dragRef.current.maxTop > 0 ? newTop / dragRef.current.maxTop : 0;

    const maxScroll = Math.max(0, dragRef.current.sh - dragRef.current.ch);
    el.scrollTop = Math.max(0, Math.min(maxScroll, ratio * maxScroll));

    // update immediat sense transicions → zero jitter
    setThumb((t) => ({ ...t, top: newTop }));
  };

  const endDrag = () => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    document.body.style.userSelect = "";
    requestAnimationFrame(recompute);
  };

  useEffect(() => {
    window.addEventListener("pointermove", onThumbPointerMove, { passive: true });
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
    return () => {
      window.removeEventListener("pointermove", onThumbPointerMove);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
    };
  }, []);

  useEffect(() => {
    recompute();
    const el = listRef.current;
    if (!el) return;

    const roScroller = new ResizeObserver(recompute);
    roScroller.observe(el);

    const roContent = new ResizeObserver(recompute);
    if (contentRef.current) roContent.observe(contentRef.current);

    window.addEventListener("resize", recompute);

    return () => {
      roScroller.disconnect();
      roContent.disconnect();
      window.removeEventListener("resize", recompute);
    };
  }, []);

  useLayoutEffect(() => {
    const id = requestAnimationFrame(recompute);
    return () => cancelAnimationFrame(id);
  });

  const pr = railWidth + railGap;

  return (
    <div
      className="relative overscroll-contain"
      style={{ height, touchAction: "pan-y" }}  // 👈 limita gestos i overscroll
    >
      {/* Scroller (amaguem la nativa només aquí) */}
      <div
        ref={listRef}
        onScroll={recompute}
        className={`overflow-y-auto [-webkit-overflow-scrolling:touch] ${styles.scrollHidden} ${className}`}
        style={{ height: "100%", paddingRight: pr }}
      >
        <div ref={contentRef} className="space-y-2">
          {children}
        </div>
      </div>

      {/* Rail + thumb */}
      <div
        className="absolute right-0 top-0 h-full"
        style={{ width: railWidth }}
        onPointerDown={onRailClick}
        aria-hidden="true"
      >
        <div
          className="absolute right-0 top-0 h-full rounded-md bg-gray-500"
          style={{ width: railWidth }}
        />
        <div
          role="scrollbar"
          aria-orientation="vertical"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={
            thumb.hasOverflow
              ? Math.round(
                  (thumb.top / Math.max(1, (listRef.current?.clientHeight || 1) - thumb.h)) * 100
                )
              : 0
          }
          // 👇 sense transició per evitar jitter; afegeix 'hover:transition-transform' si la vols al ratolí
          className="absolute right-0 rounded-md bg-gray-700 cursor-pointer touch-none will-change-transform"
          style={{
            width: railWidth,
            height: `${thumb.h}px`,
            transform: `translateY(${thumb.top}px)`,
          }}
          onPointerDown={onThumbPointerDown}
        />
      </div>
    </div>
  );
}
