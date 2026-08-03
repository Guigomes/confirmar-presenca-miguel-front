'use client';

import { useEffect, useState } from 'react';

/** Quanto tempo depois de carregar a página o dino aparece (ms) */
const DELAY_MS = 10_000;

/**
 * Surpresa: 10 segundos depois de carregar a página, um dinossauro amarelo
 * atravessa a tela sendo montado por um cavalo vermelho. Some sozinho no fim.
 */
export function DinoRide() {
  const [running, setRunning] = useState(false);

  useEffect(() => {
    // Respeita quem prefere menos animação
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const timer = setTimeout(() => setRunning(true), DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  if (!running) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-2 z-40 overflow-hidden sm:bottom-6"
      aria-hidden="true"
    >
      <div
        className="dino-cross w-[220px] sm:w-[300px]"
        onAnimationEnd={(e) => {
          // Só o fim da travessia encerra (as animações internas são infinitas)
          if (e.target === e.currentTarget) setRunning(false);
        }}
      >
        <svg
          viewBox="0 0 300 210"
          className="h-auto w-full drop-shadow-[0_6px_10px_rgba(0,0,0,0.25)]"
          role="img"
        >
          <g transform="translate(0,26)">
            {/* ---------- Dinossauro amarelo ---------- */}
            <g className="dino-body">
              {/* Perna traseira de trás (mais escura, dá profundidade) */}
              <path
                className="dino-step-b"
                d="M 80,118 L 68,150 L 76,168"
                fill="none"
                stroke="#ca8a04"
                strokeWidth="17"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Corpo + rabo + pescoço */}
              <path
                d="M 10,100 C 36,106 60,100 80,88 C 96,78 104,66 120,58
                   C 132,44 146,28 166,22 L 196,34
                   C 190,44 182,52 172,58 C 158,72 150,88 148,104
                   C 146,120 140,130 128,136 C 112,144 92,144 74,140
                   C 54,134 32,124 18,114 C 11,109 8,104 10,100 Z"
                fill="#facc15"
              />

              {/* Placas nas costas */}
              <path d="M 58,96 L 66,80 L 74,92 Z" fill="#f59e0b" />
              <path d="M 80,86 L 88,68 L 96,80 Z" fill="#f59e0b" />
              <path d="M 104,68 L 110,50 L 120,62 Z" fill="#f59e0b" />
              <path d="M 128,50 L 134,32 L 144,44 Z" fill="#f59e0b" />

              {/* Barriga mais clara */}
              <path
                d="M 44,124 C 66,136 100,140 124,130 C 116,138 96,142 76,139 C 62,136 52,131 44,124 Z"
                fill="#fde047"
              />

              {/* Cabeça */}
              <path
                d="M 168,22 C 182,10 206,8 222,16 C 234,22 250,26 254,36
                   C 257,45 249,52 240,51 L 214,49
                   C 200,54 184,50 176,42 C 170,36 165,28 168,22 Z"
                fill="#facc15"
              />
              {/* Boca */}
              <path
                d="M 214,49 C 228,52 242,49 252,42"
                fill="none"
                stroke="#ca8a04"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* Olho */}
              <circle cx="205" cy="28" r="7" fill="#ffffff" />
              <circle cx="207" cy="29" r="3.5" fill="#1f2937" />
              {/* Narina */}
              <circle cx="245" cy="33" r="2.5" fill="#ca8a04" />

              {/* Bracinho de T-rex */}
              <path
                className="dino-step-b"
                d="M 150,92 L 162,100 L 158,110"
                fill="none"
                stroke="#eab308"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Perna traseira da frente */}
              <path
                className="dino-step-a"
                d="M 104,118 L 108,150 L 122,170"
                fill="none"
                stroke="#eab308"
                strokeWidth="19"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>

            {/* ---------- Cavalo vermelho montando o dino ---------- */}
            <g className="dino-rider">
              {/* Patas do lado de trás (mais escuras) */}
              <path
                d="M 92,50 L 82,68"
                fill="none"
                stroke="#991b1b"
                strokeWidth="7"
                strokeLinecap="round"
              />
              <path
                d="M 122,50 L 128,68"
                fill="none"
                stroke="#991b1b"
                strokeWidth="7"
                strokeLinecap="round"
              />
              {/* Rabo esvoaçante */}
              <path
                d="M 80,32 C 66,22 56,30 54,42 C 53,50 58,55 63,53"
                fill="none"
                stroke="#991b1b"
                strokeWidth="9"
                strokeLinecap="round"
              />
              {/* Corpo */}
              <ellipse cx="106" cy="40" rx="30" ry="18" fill="#dc2626" />
              {/* Pescoço */}
              <path
                d="M 120,34 L 138,6 L 152,12 L 132,44 Z"
                fill="#dc2626"
                stroke="#dc2626"
                strokeWidth="7"
                strokeLinejoin="round"
              />
              {/* Cabeça com focinho comprido */}
              <path
                d="M 136,6 C 142,-4 154,-8 162,-2 L 178,10 C 184,14 183,22 177,24
                   C 171,26 165,22 161,17 L 144,15 Z"
                fill="#dc2626"
                stroke="#dc2626"
                strokeWidth="5"
                strokeLinejoin="round"
              />
              {/* Orelha */}
              <path d="M 139,1 L 140,-11 L 149,-3 Z" fill="#b91c1c" />
              {/* Crina */}
              <path
                d="M 139,3 C 131,11 127,23 125,37"
                fill="none"
                stroke="#7f1d1d"
                strokeWidth="8"
                strokeLinecap="round"
              />
              {/* Olho e narina */}
              <circle cx="154" cy="4" r="3.2" fill="#ffffff" />
              <circle cx="155" cy="4.5" r="1.7" fill="#1f2937" />
              <circle cx="175" cy="18" r="2" fill="#7f1d1d" />
              {/* Cabresto */}
              <path
                d="M 163,6 L 170,20"
                fill="none"
                stroke="#7f1d1d"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Sela */}
              <path
                d="M 92,26 C 100,21 114,21 122,27"
                fill="none"
                stroke="#7f1d1d"
                strokeWidth="6"
                strokeLinecap="round"
              />
              {/* Patas da frente segurando o pescoço do dino */}
              <path
                d="M 94,50 L 88,70"
                fill="none"
                stroke="#dc2626"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <path
                d="M 126,50 L 136,66"
                fill="none"
                stroke="#dc2626"
                strokeWidth="8"
                strokeLinecap="round"
              />
              {/* Rédeas: das patas do cavalo até o focinho do dino */}
              <path
                d="M 136,64 C 168,62 202,58 230,50"
                fill="none"
                stroke="#7f1d1d"
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
