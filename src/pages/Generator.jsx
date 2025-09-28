import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RedDice from '../components/Generator/RedDice';
import CoinSpriteFlipSheet from '../components/Generator/CoinSpriteFlipSheet';
import coinSheet from '../assets/coin_sheet.png';
import Wheel from '../components/Generator/Wheel';
import Slot from '../components/Generator/Slot';   // 🔹 importa el nou component

export default function Generator() {
  const [lastCoinResult, setLastCoinResult] = useState('heads'); // 'heads' | 'tails' | null
  const [lastDiceResult, setLastDiceResult] = useState(20);      // 1..20 | null
  const [diceCycles, setDiceCycles] = useState(1 + Math.floor(Math.random() * 4));
  const [lastSlotResult, setLastSlotResult] = useState('Jackpot Win');    // 🔹 estat per al slot

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-[64px]">
        <div className="mx-auto max-w-[1100px] px-4 md:px-8 py-10">

          {/* GRID: 2 columnes a partir de md, files automàtiques */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">

            {/* Bloc: Moneda */}
            <div className="rounded-2xl bg-[#b0cad2] p-6 md:p-8 shadow-lg h-full flex flex-col">
              <p className="text-center text-gray-500">Click the coin to flip.</p>
              <div className="mt-6 flex items-center justify-center flex-1">
                <CoinSpriteFlipSheet
                  sheetSrc={coinSheet}
                  size={150}
                  msPerFrame={50}
                  minStepMs={15}
                  maxStepMs={35}
                  cycles={2}
                  turnsMultiplier={2}
                  headIndex={0}
                  tailIndex={9}
                  onEnd={(side) => setLastCoinResult(side)}
                />
              </div>
              <p className="mt-6 text-center text-gray-700">
                Result: <span className="font-semibold">
                  {lastCoinResult ? lastCoinResult.toUpperCase() : '—'}
                </span>
              </p>
            </div>

            {/* Bloc: Dau */}
            <div className="rounded-2xl bg-[#b0cad2] p-6 md:p-8 shadow-lg h-full flex flex-col">
              <p className="text-center text-gray-500">Click the dice to roll.</p>
              <div className="mt-6 flex items-center justify-center flex-1">
                <RedDice
                  size={200}
                  msPerFrame={50}
                  cycles={diceCycles}
                  onEnd={(n) => {
                    setLastDiceResult(n);
                    setDiceCycles(1 + Math.floor(Math.random() * 4));
                  }}
                />
              </div>
              <p className="mt-6 text-center text-gray-700">
                Result: <span className="font-semibold">
                  {lastDiceResult !== null ? lastDiceResult : '—'}
                </span>
              </p>
            </div>

            {/* ───────────── 2a FILA ───────────── */}

            {/* Bloc: Wheel */}
            <div className="rounded-2xl bg-[#b0cad2] p-6 md:p-8 shadow-lg h-full flex flex-col">
              <p className="text-center text-gray-500">Tap the center to spin.</p>
              <div className="mt-6 flex items-center justify-center flex-1">
                <Wheel
                  size={260}
                  onEnd={(label, idx) => {
                    console.log("Wheel result:", label, idx);
                  }}
                />
              </div>
            </div>

            {/* Slot */}
            <div className="rounded-2xl bg-[#b0cad2] p-6 md:p-8 shadow-lg h-full flex flex-col">
              <p className="text-center text-gray-500">Pull the lever to play.</p>
              <div className="mt-6 flex items-center justify-center flex-1">
                <Slot
                  size={320}
                  onStart={() => setLastSlotResult('...')}
                  onEnd={(result /*, mids*/ ) => setLastSlotResult(result)}
                />
              </div>
              <p className="mt-6 text-center text-gray-700">
                Result: <span className="font-semibold">{lastSlotResult ?? '—'}</span>
              </p>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
