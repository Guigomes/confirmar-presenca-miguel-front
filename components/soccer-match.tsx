'use client';

import { useEffect, useState } from 'react';
import { matchDelay } from '@/lib/config/animations';

/**
 * Segunda surpresa: logo depois que o dino atravessa a tela, um peixe e um
 * elefante aparecem batendo uma bola no rodapé da página. A cena entra,
 * troca alguns passes e sai sozinha.
 */
export function SoccerMatch() {
  const [running, setRunning] = useState(false);

  useEffect(() => {
    // Respeita quem prefere menos animação
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const timer = setTimeout(() => setRunning(true), matchDelay);
    return () => clearTimeout(timer);
  }, []);

  if (!running) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-2 z-40 flex justify-center overflow-hidden sm:bottom-6"
      aria-hidden="true"
    >
      <div
        className="match-scene w-[320px] sm:w-[460px]"
        onAnimationEnd={(e) => {
          // Só o fim da cena encerra (as animações internas são infinitas)
          if (e.target === e.currentTarget) setRunning(false);
        }}
      >
        <svg
          viewBox="0 0 460 230"
          className="h-auto w-full drop-shadow-[0_6px_10px_rgba(0,0,0,0.25)]"
          role="img"
        >
          {/* ---------- Peixe (goleiro improvisado, à esquerda) ---------- */}
          <g className="match-fish">
            <g transform="translate(24,74)">
              {/* Rabo */}
              <path d="M 8,58 L -18,34 L -18,84 Z" fill="#ea580c" />
              {/* Corpo */}
              <path
                d="M 8,58 C 28,22 88,20 112,56 C 90,94 28,96 8,58 Z"
                fill="#fb923c"
              />
              {/* Barriga clara */}
              <path
                d="M 24,76 C 48,92 84,88 106,66 C 92,92 42,98 24,76 Z"
                fill="#fed7aa"
              />
              {/* Nadadeira de cima */}
              <path d="M 48,28 L 60,6 L 76,30 Z" fill="#ea580c" />
              {/* Nadadeira lateral */}
              <path d="M 58,68 L 78,88 L 50,86 Z" fill="#ea580c" />
              {/* Escamas */}
              <path
                d="M 46,44 C 54,52 54,62 46,70 M 62,42 C 70,52 70,62 62,72 M 78,44 C 86,52 86,62 78,70"
                fill="none"
                stroke="#ea580c"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* Olho */}
              <circle cx="94" cy="46" r="9" fill="#ffffff" />
              <circle cx="97" cy="46" r="4.5" fill="#1f2937" />
              {/* Boca */}
              <path
                d="M 108,62 C 114,60 118,64 116,68"
                fill="none"
                stroke="#c2410c"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </g>
          </g>

          {/* ---------- Elefante (atacante, à direita) ---------- */}
          <g className="match-elephant">
            <g transform="translate(250,26)">
              {/* Pernas de trás */}
              <path
                d="M 150,120 L 150,168"
                fill="none"
                stroke="#6b7280"
                strokeWidth="26"
                strokeLinecap="round"
              />
              <path
                d="M 88,120 L 88,168"
                fill="none"
                stroke="#6b7280"
                strokeWidth="26"
                strokeLinecap="round"
              />
              {/* Rabo */}
              <path
                d="M 168,88 C 184,92 188,108 180,120"
                fill="none"
                stroke="#6b7280"
                strokeWidth="6"
                strokeLinecap="round"
              />
              {/* Corpo */}
              <ellipse cx="118" cy="92" rx="60" ry="48" fill="#9ca3af" />
              {/* Pernas da frente */}
              <path
                d="M 132,124 L 132,170"
                fill="none"
                stroke="#9ca3af"
                strokeWidth="28"
                strokeLinecap="round"
              />
              <path
                className="match-kick"
                d="M 74,120 L 66,168"
                fill="none"
                stroke="#9ca3af"
                strokeWidth="28"
                strokeLinecap="round"
              />
              {/* Cabeça */}
              <circle cx="52" cy="80" r="44" fill="#9ca3af" />
              {/* Orelha */}
              <ellipse cx="72" cy="70" rx="26" ry="32" fill="#6b7280" />
              {/* Tromba */}
              <path
                className="match-trunk"
                d="M 22,84 C 2,104 4,146 20,164"
                fill="none"
                stroke="#9ca3af"
                strokeWidth="20"
                strokeLinecap="round"
              />
              {/* Presa */}
              <path d="M 34,104 L 20,122 L 38,114 Z" fill="#f9fafb" />
              {/* Olho */}
              <circle cx="42" cy="62" r="8" fill="#ffffff" />
              <circle cx="39" cy="62" r="4" fill="#1f2937" />
              {/* Faixa de capitão, porque toda pelada tem um */}
              <path
                d="M 119,140 L 145,140"
                fill="none"
                stroke="#facc15"
                strokeWidth="9"
                strokeLinecap="round"
              />
            </g>
          </g>

          {/* ---------- Bola indo e voltando entre os dois ---------- */}
          <g className="match-ball">
            <g className="match-ball-spin">
              <circle cx="176" cy="176" r="17" fill="#ffffff" stroke="#d1d5db" strokeWidth="2" />
              {/* Gomo central */}
              <path
                d="M 176,168 L 183.6,173.5 L 180.7,182.5 L 171.3,182.5 L 168.4,173.5 Z"
                fill="#1f2937"
              />
              {/* Costuras saindo do gomo até a borda */}
              <path
                d="M 176,168 L 176,160 M 183.6,173.5 L 191.2,171 M 180.7,182.5 L 185.4,189
                   M 171.3,182.5 L 166.6,189 M 168.4,173.5 L 160.8,171"
                fill="none"
                stroke="#1f2937"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}
