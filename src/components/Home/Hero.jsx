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
    <section className="w-full py-16 md:py-28">
      {/* CONTAINER: ample topall i padding responsiu */}
      <div
        className="
          mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-10
          grid items-center gap-10 lg:gap-16
          md:grid-cols-[minmax(260px,42%)_minmax(0,1fr)]
        "
      >
        {/* GIF */}
        <div className="justify-self-center md:justify-self-end mt-6 md:mt-0">
          <img
            src={gifPreview}
            alt="rng gif"
            className="w-[clamp(260px,38vw,520px)] h-auto object-contain select-none pointer-events-none"
          />
        </div>

        {/* TEXT + BOTONS */}
        <div className="max-w-[680px] justify-self-start text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-700 mb-8 lg:mb-6 leading-tight">
            Generate high-quality random numbers instantly
          </h1>

          <p className="text-gray-600 text-base sm:text-lg md:text-xl">
            A robust and efficient PRNG based on PCG32, accessible through your account and designed
            for seamless integration into apps, simulations, and custom tools via API.
          </p>

          <div className="flex flex-col sm:flex-row items-center md:items-start justify-center md:justify-start gap-4 mt-10 md:mt-6">
            <Link
              to="/dashboard"
              className="button2 w-40 h-12 inline-flex items-center justify-center select-none touch-manipulation"
            >
              Try Dashboard
            </Link>

            {isTouch ? (
              <Tooltip text="Coming soon" from="down">
                <Link to="" className="inline-block" onClick={(e) => e.preventDefault()}>
                  <button className="button2 w-40">View API Docs</button>
                </Link>
              </Tooltip>
            ) : (
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
