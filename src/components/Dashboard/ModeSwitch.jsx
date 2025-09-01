import { useEffect, useState } from 'react';
import Tooltip from '../Tooltip';

export default function ModeSwitch({ mode, setMode }) {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Detecta dispositius sense hover (tàctils)
    const mq = window.matchMedia('(hover: none)');
    const update = () => setIsTouch(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  return (
    <div className="flex justify-center md:justify-start">
      <div className="flex items-center gap-4 p-1 rounded-full">
        <button
          onClick={() => setMode('explore')}
          className={`${mode === 'explore' ? 'button' : 'button2'} w-35`}
        >
          Explore
        </button>

        {isTouch ? (
          // --- MÒBIL: disabled real + pointer-events-none al botó, wrapper rep el tap ---
          <Tooltip text="Coming soon" from="down">
            <div className="inline-block" onClick={(e) => e.preventDefault()}>
              <button
                disabled
                className={`${mode === 'enterprise' ? 'button' : 'button2'} w-35 cursor-not-allowed pointer-events-none`}
              >
                Enterprise
              </button>
            </div>
          </Tooltip>
        ) : (
          // --- PC: sense disabled real per conservar hover; bloquegem acció i traiem focus ---
          <Tooltip text="Coming soon" from="down">
            <button
              aria-disabled="true"
              tabIndex={-1}
              onClick={(e) => e.preventDefault()}
              onMouseUp={(e) => e.currentTarget.blur()}
              onTouchEnd={(e) => e.currentTarget.blur()}
              className={`${mode === 'enterprise' ? 'button' : 'button2'} w-35 cursor-not-allowed focus:outline-none focus:ring-0`}
            >
              Enterprise
            </button>
          </Tooltip>
        )}
      </div>
    </div>
  );
}
