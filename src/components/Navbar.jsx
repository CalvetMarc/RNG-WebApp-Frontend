import { useState } from 'react';
import { FaLinkedin, FaEnvelope, FaGithub, FaFileArchive } from 'react-icons/fa';

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
        <div className="hidden md:block absolute inset-0">
          <div className="relative h-full">
            {/* ajusta aquest GAP a la distància centre↔enllaç (en px) */}
            {/** 120px és un bon punt de partida */}
            <a
              href="/"
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 hover:text-blue-400"
              style={{ left: 'calc(50% - 120px)' }}
            >
              Home
            </a>

            <a
              href="/visualizer"
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 hover:text-blue-400"
              style={{ left: '50%' }}
            >
              Visualizer
            </a>

            <a
              href="/generator"
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 hover:text-blue-400"
              style={{ left: 'calc(50% + 120px)' }}
            >
              Generator
            </a>
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

            {/* Icòna DownloadZip amb efecte hover */}
            <a
              href="/download/freeprng.zip" // ← canvia-ho a la URL real del teu .zip
              className="hover:text-blue-400 text-3xl"
            >
              <FaFileArchive />
            </a>
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
              <a href="/visualizer" className="text-blue-400 text-lg hover:text-blue-300" onClick={() => setMenuOpen(false)}>Visualizer</a>
              <a href="/generator" className="text-blue-400 text-lg hover:text-blue-300" onClick={() => setMenuOpen(false)}>Generator</a>

              {/* Icòna DownloadZip també al menú mòbil */}
              <a
              href="https://github.com/CalvetMarc/pcg32-prng"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 text-3xl"
              >
                <FaGithub />
              </a>

              {/* Icòna DownloadZip amb efecte hover */}
              <a
                href="/download/freeprng.zip" // ← canvia-ho a la URL real del teu .zip
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
