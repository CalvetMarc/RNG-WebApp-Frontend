import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GoldCoinFlip from '../components/Generator/GoldCoinFlip';
import RedDice from '../components/Generator/RedDice';

export default function Generator() {
  const [lastCoinResult, setLastCoinResult] = useState('heads'); // 'heads' | 'tails' | null
  const [lastDiceResult, setLastDiceResult] = useState(20);      // 1..20 | null

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-[64px]">
        <div className="mx-auto max-w-[1100px] px-4 md:px-8 py-10">

          {/* 🔲 Fila amb 2 columnes, targetes estirades a la mateixa alçada */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Bloc: Moneda */}
            <div className="rounded-2xl bg-[#b0cad2] p-6 md:p-8 shadow-lg h-full flex flex-col">
              <p className="text-center text-gray-500">Click the coin to flip.</p>

              {/* Zona central que creix per empènyer el "Result" avall */}
              <div className="mt-6 flex items-center justify-center flex-1">
                <GoldCoinFlip
                  size={200}
                  msPerFrame={50}
                  cycles={1}
                  result="random"
                  onEnd={(r) => setLastCoinResult(r)}
                />
              </div>

              <p className="mt-6 text-center text-gray-700">
                Result:{' '}
                <span className="font-semibold">
                  {lastCoinResult ? lastCoinResult.toUpperCase() : '—'}
                </span>
              </p>
            </div>

            {/* Bloc: Dau */}
            <div className="rounded-2xl bg-[#b0cad2] p-6 md:p-8 shadow-lg h-full flex flex-col">
              <p className="text-center text-gray-500">Click the dice to roll.</p>

              {/* Mateixa estratègia: que la zona de la imatge ocupi l’espai */}
              <div className="mt-6 flex items-center justify-center flex-1">
                <RedDice
                  size={200}
                  msPerFrame={50}
                  cycles={2}
                  onEnd={(n) => setLastDiceResult(n)}
                />
              </div>

              <p className="mt-6 text-center text-gray-700">
                Result:{' '}
                <span className="font-semibold">
                  {lastDiceResult !== null ? lastDiceResult : '—'}
                </span>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
