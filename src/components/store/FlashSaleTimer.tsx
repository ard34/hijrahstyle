'use client';

import { useState, useEffect } from 'react';
import { Flame } from 'lucide-react';

export default function FlashSaleTimer() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 15,
    minutes: 32,
    seconds: 18,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (num: number) => String(num).padStart(2, '0');

  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] font-bold text-slate-400 hidden sm:inline uppercase tracking-wider">
        Berakhir dalam:
      </span>
      <div className="flex items-center gap-1.5 font-mono text-xs font-black">
        <div className="px-2.5 py-1.5 rounded-xl bg-blue-950/80 border border-blue-500/40 text-blue-400 shadow-sm flex flex-col items-center min-w-[2.2rem]">
          <span>{pad(timeLeft.hours)}</span>
          <span className="text-[8px] font-sans text-slate-400 font-semibold">Jam</span>
        </div>
        <span className="text-blue-400 font-bold">:</span>
        <div className="px-2.5 py-1.5 rounded-xl bg-blue-950/80 border border-blue-500/40 text-blue-400 shadow-sm flex flex-col items-center min-w-[2.2rem]">
          <span>{pad(timeLeft.minutes)}</span>
          <span className="text-[8px] font-sans text-slate-400 font-semibold">Mnt</span>
        </div>
        <span className="text-blue-400 font-bold">:</span>
        <div className="px-2.5 py-1.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-400 shadow-sm flex flex-col items-center min-w-[2.2rem] animate-pulse">
          <span>{pad(timeLeft.seconds)}</span>
          <span className="text-[8px] font-sans text-slate-400 font-semibold">Dtk</span>
        </div>
      </div>
    </div>
  );
}
