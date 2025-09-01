import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import gifPreview from '../../assets/dices2big.gif';
import Tooltip from '../Tooltip';

export default function Hero() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(hover: none)');
    const update = () => setIsTouch(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  return (
    <section className="w-full px-8 py-20 md:py-40 flex justify-center">
      {/* WRAPPER CENTRAL */}
      <div className="flex items-center gap-12 md:gap-40 flex-col md:flex-row w-auto mx-auto">
        {/* GIF */}
        <div className="flex justify-center md:justify-end mt-10 md:mt-0">
          <img
            src={gifPreview}
            alt="rng gif"
            className="w-[260px] h-[200px] -mb-4 scale-[1.4] md:w-[420px] md:h-[320px] md:scale-[1.6] md:mb-0 md:-translate-x-6 object-contain"
          />
        </div>

        {/* TEXT + BOTONS */}
        <div className="max-w-[800px] text-center md:text-left -translate-y-2 mt-2 md:mt-0 -md:translate-y-2 md:-translate-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-700 mb-14 md:mb-6">
            Generate high-quality random numbers instantly
          </h1>
          <p className="text-gray-600 text-lg md:text-xl">
            A robust and efficient PRNG based on PCG32, accessible through your account and designed for seamless integration into apps, simulations, and custom tools via API.
          </p>

          <div className="flex flex-col sm:flex-row items-center md:items-start justify-center md:justify-start gap-4 mt-12 md:mt-6 mb-6 md:mb-0">

           <Link
            to="/dashboard"
            className="button2 w-40 h-12 inline-flex items-center justify-center select-none touch-manipulation"
          >
            Try Dashboard
          </Link>


            {/* View API Docs — mòbil vs PC */}
            {isTouch ? (
              // ─── MÒBIL: Link + button2 (no navegar; només tooltip)
              <Tooltip text="Coming soon" from="down">
                <Link to="" className="inline-block" onClick={(e) => e.preventDefault()}>
                  <button className="button2 w-40">View API Docs</button>
                </Link>
              </Tooltip>
            ) : (
              // ─── PC: botó desactivat amb estil button2
              <Tooltip text="Coming soon" from="down">
                <button disabled className="button2 w-40 cursor-not-allowed">
                  View API Docs
                </button>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
