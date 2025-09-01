import { useEffect, useRef, useState } from "react";

// Tooltip reutilitzable amb direcció: up | down | left | right
export default function Tooltip({
  text,
  from = "down",
  children,
  autoCloseMs = 1500, // temps que roman obert després d'un tap
}) {
  const map = {
    down: { boxPos: "top-full mt-2 left-1/2 -translate-x-1/2", arrowPos: "-top-1 left-1/2 -translate-x-1/2", enter: "translate-y-1", enterTo: "translate-y-0" },
    up:   { boxPos: "bottom-full mb-2 left-1/2 -translate-x-1/2", arrowPos: "-bottom-1 left-1/2 -translate-x-1/2", enter: "-translate-y-1", enterTo: "translate-y-0" },
    left: { boxPos: "right-full mr-2 top-1/2 -translate-y-1/2", arrowPos: "-right-1 top-1/2 -translate-y-1/2", enter: "-translate-x-1", enterTo: "translate-x-0" },
    right:{ boxPos: "left-full ml-2 top-1/2 -translate-y-1/2", arrowPos: "-left-1 top-1/2 -translate-y-1/2", enter: "translate-x-1", enterTo: "translate-x-0" },
  };
  const cfg = map[from] ?? map.down;

  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const timerRef = useRef(null);

  // Obrir amb click/tap (mòbil)
  const onClickTrigger = () => {
    setOpen(true);
    if (autoCloseMs) {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setOpen(false), autoCloseMs);
    }
  };

  // Tancar en clicar fora
  useEffect(() => {
    const handleDocClick = (e) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", handleDocClick);
    return () => document.removeEventListener("click", handleDocClick);
  }, []);

  // Neteja del timer
  useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <div
      ref={rootRef}
      className="relative inline-block group focus-within:outline-none"
      onClick={onClickTrigger} // ← tap/click mostra el tooltip en mòbil
      onMouseLeave={() => setOpen(false)} // per si cliques i mous el ratolí fora a desktop
    >
      {/* Trigger */}
      <div className="inline-flex items-center gap-1">{children}</div>

      {/* Tooltip box */}
      <div
        role="tooltip"
        className={[
          "absolute z-50 whitespace-nowrap px-2 py-1 text-xs font-medium text-gray-300 bg-gray-800 rounded-md shadow",
          // Visibilitat: obert per estat (tap) o per hover/focus (desktop/teclat)
          open ? "opacity-100" : "opacity-0",
          "group-hover:opacity-100 group-focus-within:opacity-100",
          // Animació slide suau
          "transition duration-150 ease-out",
          open ? cfg.enterTo : cfg.enter,
          `group-hover:${cfg.enterTo} group-focus-within:${cfg.enterTo}`,
          // Posicionament
          "pointer-events-none", // el tooltip no captura el pointer (evita parpelleig)
          cfg.boxPos,
        ].join(" ")}
      >
        {text}
        {/* Punta (bafarada) */}
        <div className={["absolute w-2 h-2 bg-gray-800 rotate-45", cfg.arrowPos].join(" ")} />
      </div>
    </div>
  );
}
