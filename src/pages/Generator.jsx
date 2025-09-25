import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GoldCoinFlip from '../components/Generator/GoldCoinFlip';

export default function Generator() {
  const [lastResult, setLastResult] = useState('heads'); // 'heads' | 'tails' | null

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* contingut principal: deixa espai per la nav fixa (64px) */}
      <main className="flex-1 pt-[64px]">
        <div className="mx-auto max-w-[1100px] px-4 md:px-8 py-10">

          {/* 🔲 Conjunt amb fons: títol + moneda + resultat */}
          <div className="mt-10 flex justify-center">
            <div className="w-full max-w-[420px] rounded-2xl bg-[#b0cad2] p-6 md:p-8 shadow-lg bg-[#b0cad2]">
              <p className="text-center text-gray-500">
                Click the coin to flip.
              </p>

              <div className="mt-6 flex items-center justify-center">
                <GoldCoinFlip
                  size={200}
                  msPerFrame={50}
                  cycles={1}
                  result="random"
                  onEnd={(r) => setLastResult(r)}
                />
              </div>

              <p className="mt-6 text-center text-gray-700">
                Result:{' '}
                <span className="font-semibold">
                  {lastResult ? lastResult.toUpperCase() : '—'}
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
