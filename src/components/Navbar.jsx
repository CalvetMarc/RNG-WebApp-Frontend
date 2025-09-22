import { useState } from 'react';
import Tooltip from './Tooltip';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-700 text-white px-6 py-4 shadow h-[64px] z-50">
      <div className="mx-auto relative h-full">
        {/* Free PRNG (desktop) */}
        <a
          href="/"
          className="absolute left-0 top-1/2 -translate-y-1/2 font-bold text-xl hidden md:block text-white no-underline cursor-pointer hover:!text-white focus:!text-white active:!text-white visited:!text-white"
        >
          Free PRNG
        </a>

        {/* Links centrats (desktop) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 gap-6 hidden md:flex">
          <a href="/" className="hover:text-blue-400">Home</a>
          <a href="/dashboard" className="hover:text-blue-400">Dashboard</a>
          <Tooltip text="Coming soon" from="down">
            <a href="" className="hover:text-blue-400">DocAPI</a>
          </Tooltip>
        </div>

        {/* Botons (desktop) */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden md:block">
          <div className="flex gap-4 justify-end">
            <Tooltip text="Coming soon" from="down">
              <button
                disabled
                className="bg-transparent border border-white px-4 py-1 rounded cursor-not-allowed w-25"
              >
                Sign Up
              </button>
            </Tooltip>

            <Tooltip text="Coming soon" from="down">
              <button
                disabled
                className="bg-blue-600 px-4 py-1 rounded cursor-not-allowed w-25"
              >
                Log In
              </button>
            </Tooltip>
          </div>
        </div>

        {/* Menú hamburguesa (mobile) */}
        <div className="md:hidden flex justify-between items-center h-full">
          <a
            href="/"
            className="font-bold text-xl text-white no-underline cursor-pointer hover:!text-white focus:!text-white active:!text-white visited:!text-white"
            onClick={() => setMenuOpen(false)}
          >
            Free PRNG
          </a>
          <button onClick={() => setMenuOpen(!menuOpen)} className="focus:outline-none z-20">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Panell desplegable (mobile) */}
        {menuOpen && (
          <div className="md:hidden fixed top-15 left-0 right-0 w-screen z-50 bg-gray-600 shadow-md">
            <div className="flex flex-col items-center justify-center gap-6 py-8">
              <a href="/" className="text-blue-400 text-lg hover:text-blue-300" onClick={() => setMenuOpen(false)}>Home</a>
              <a href="/dashboard" className="text-blue-400 text-lg hover:text-blue-300" onClick={() => setMenuOpen(false)}>Dashboard</a>
              <Tooltip text="Coming soon" from="left">
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="hover:text-blue-400"
                  aria-disabled="true"
                >
                  DocAPI
                </a>
              </Tooltip>

             <Tooltip text="Coming soon" from="left">
                <button
                  type="button"
                  aria-disabled="true"
                  onClick={(e) => e.preventDefault()}
                  onTouchEnd={(e) => e.currentTarget.blur()}
                  onMouseUp={(e) => e.currentTarget.blur()}
                  className="w-40 h-12 inline-flex items-center justify-center rounded cursor-not-allowed select-none focus:outline-none focus:ring-0 text-blue-400 border border-blue-400 hover:text-blue-300 hover:border-blue-300 bg-transparent"
                >
                  Sign Up
                </button>
              </Tooltip>

              <Tooltip text="Coming soon" from="left">
                <button
                  type="button"
                  aria-disabled="true"
                  onClick={(e) => e.preventDefault()}
                  onTouchEnd={(e) => e.currentTarget.blur()}
                  onMouseUp={(e) => e.currentTarget.blur()}
                  className="w-40 h-12 inline-flex items-center justify-center rounded cursor-not-allowed select-none focus:outline-none focus:ring-0 bg-blue-600 text-white hover:bg-blue-500"
                >
                  Log In
                </button>
              </Tooltip>



            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
