import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaGithub, FaFileArchive } from 'react-icons/fa';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  // subratlla Home només a '/', i la resta a qualsevol subruta que comenci per aquell path
  const isActive = (path) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path);

  const navBase =
    'absolute top-1/2 -translate-x-1/2 -translate-y-1/2 hover:text-blue-400 transition-colors';
  const activeDeco = ' underline underline-offset-4 decoration-2';

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-700 text-white px-6 py-4 shadow h-[64px] z-50">
      <div className="mx-auto relative h-full">
        {/* Free PRNG (desktop) */}
        <Link
          to="/"
          className="absolute left-0 top-1/2 -translate-y-1/2 font-bold text-xl hidden md:block text-white no-underline cursor-pointer hover:!text-white focus:!text-white active:!text-white visited:!text-white"
          onClick={() => setMenuOpen(false)}
        >
          Free PRNG
        </Link>

        {/* Links centrats (desktop) */}
        <div className="hidden md:block absolute inset-0">
          <div className="relative h-full">
            {/* ajusta aquest GAP a la distància centre↔enllaç (en px). 120px és un bon punt de partida */}
            <Link
              to="/"
              aria-current={isActive('/') ? 'page' : undefined}
              className={navBase + (isActive('/') ? activeDeco : '')}
              style={{ left: '50%' }}
            >
              Home
            </Link>

            <Link
              to="/visualizer"
              aria-current={isActive('/visualizer') ? 'page' : undefined}
              className={navBase + (isActive('/visualizer') ? activeDeco : '')}
              style={{ left: 'calc(50% - 120px)' }}
            >
              Visualizer
            </Link>

            <Link
              to="/showcase"  // si la teva ruta real és /generate, canvia-ho aquí i a l'isActive
              aria-current={isActive('/showcase') ? 'page' : undefined}
              className={navBase + (isActive('/showcase') ? activeDeco : '')}
              style={{ left: 'calc(50% + 120px)' }}
            >
              Showcase
            </Link>
          </div>
        </div>

        {/* Botons (desktop) */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden md:block">
          <div className="flex gap-8 justify-end items-center">
            <a
              href="https://github.com/CalvetMarc/pcg32-prng"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 text-3xl"
            >
              <FaGithub />
            </a>

            <a
              href="/download/freeprng.zip"
              className="hover:text-blue-400 text-3xl"
            >
              <FaFileArchive />
            </a>
          </div>
        </div>

        {/* Menú hamburguesa (mobile) */}
        <div className="md:hidden flex justify-between items-center h-full">
          <Link
            to="/"
            className="font-bold text-xl text-white no-underline cursor-pointer hover:!text-white focus:!text-white active:!text-white visited:!text-white"
            onClick={() => setMenuOpen(false)}
          >
            Free PRNG
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="focus:outline-none z-20"
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
          <div className="md:hidden fixed left-0 right-0 w-screen z-50 bg-gray-600 shadow-md top-[64px]">
            <div className="flex flex-col items-center justify-center gap-6 py-8">
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                aria-current={isActive('/') ? 'page' : undefined}
                className={'text-blue-400 text-lg hover:text-blue-300' + (isActive('/') ? activeDeco : '')}
              >
                Home
              </Link>

              <Link
                to="/visualizer"
                onClick={() => setMenuOpen(false)}
                aria-current={isActive('/visualizer') ? 'page' : undefined}
                className={'text-blue-400 text-lg hover:text-blue-300' + (isActive('/visualizer') ? activeDeco : '')}
              >
                Visualizer
              </Link>

              <Link
                to="/generator"
                onClick={() => setMenuOpen(false)}
                aria-current={isActive('/generator') ? 'page' : undefined}
                className={'text-blue-400 text-lg hover:text-blue-300' + (isActive('/generator') ? activeDeco : '')}
              >
                Generator
              </Link>

              <a
                href="https://github.com/CalvetMarc/pcg32-prng"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 text-3xl"
              >
                <FaGithub />
              </a>

              <a
                href="/download/freeprng.zip"
                className="hover:text-blue-400 text-3xl"
              >
                <FaFileArchive />
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 