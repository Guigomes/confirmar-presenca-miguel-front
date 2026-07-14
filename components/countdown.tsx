'use client';

import { useEffect, useState } from 'react';
import { party } from '@/lib/config/party';

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

function getTimeLeft(target: number): TimeLeft | null {
  const diff = target - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor(diff / 3_600_000) % 24,
    minutes: Math.floor(diff / 60_000) % 60,
    seconds: Math.floor(diff / 1_000) % 60,
  };
}

export function Countdown() {
  // null até montar no cliente, para não divergir do HTML renderizado no servidor
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null | 'pending'>('pending');

  useEffect(() => {
    const target = new Date(party.startsAt).getTime();
    setTimeLeft(getTimeLeft(target));
    const interval = setInterval(() => setTimeLeft(getTimeLeft(target)), 1000);
    return () => clearInterval(interval);
  }, []);

  if (timeLeft === null) {
    return (
      <div className="rounded-2xl bg-brand-950 text-white px-6 py-5 text-center shadow-lg">
        <p className="font-display text-2xl text-gold">⚽ É HOJE! BORA PRO JOGO! 🥳</p>
      </div>
    );
  }

  const units =
    timeLeft === 'pending'
      ? [
          { value: '--', label: 'dias' },
          { value: '--', label: 'horas' },
          { value: '--', label: 'min' },
          { value: '--', label: 'seg' },
        ]
      : [
          { value: String(timeLeft.days), label: 'dias' },
          { value: String(timeLeft.hours).padStart(2, '0'), label: 'horas' },
          { value: String(timeLeft.minutes).padStart(2, '0'), label: 'min' },
          { value: String(timeLeft.seconds).padStart(2, '0'), label: 'seg' },
        ];

  return (
    <div className="rounded-2xl bg-brand-950 px-4 py-5 sm:px-8 shadow-lg border-4 border-brand-800">
      <p className="text-center text-[11px] font-semibold uppercase tracking-[0.25em] text-brand-300 mb-3">
        ⏱ Contagem pro apito inicial
      </p>
      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        {units.map((u) => (
          <div key={u.label} className="text-center">
            <div className="rounded-xl bg-black/40 py-3 sm:py-4">
              <span className="scoreboard-digits font-display text-3xl sm:text-5xl text-gold">
                {u.value}
              </span>
            </div>
            <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-wider text-brand-200">
              {u.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
