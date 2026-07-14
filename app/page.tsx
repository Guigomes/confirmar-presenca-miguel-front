import Image from 'next/image';
import { RsvpForm } from '@/components/rsvp/rsvp-form';
import { Countdown } from '@/components/countdown';
import { party } from '@/lib/config/party';
import { formatDate, formatLongDate } from '@/lib/utils/date';

export default function HomePage() {
  const datePill = `${formatDate(party.date, 'dd MMM').toUpperCase()} | ${formatDate(party.date, 'EEEE').toUpperCase()} | ${party.time.replace(':00', 'H')}`;

  return (
    <div>
      {/* Hero: campo de futebol */}
      <section className="relative bg-gradient-to-b from-brand-600 via-brand-700 to-brand-900 text-white overflow-hidden">
        <div className="grass-stripes absolute inset-0 pointer-events-none" />
        <div className="grass-texture absolute inset-0 pointer-events-none opacity-60" />

        {/* Linhas do campo: círculo central + linha do meio */}
        <div className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2 h-[340px] w-[340px] sm:h-[460px] sm:w-[460px] rounded-full border-[3px] border-white/25 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/25 pointer-events-none" />

        {/* Bolas decorativas */}
        <span className="absolute -left-4 top-10 text-6xl opacity-20 -rotate-12 pointer-events-none select-none" aria-hidden="true">⚽</span>
        <span className="absolute right-6 top-24 text-4xl opacity-20 rotate-12 pointer-events-none select-none" aria-hidden="true">⚽</span>
        <span className="absolute right-16 bottom-16 text-7xl opacity-15 rotate-6 pointer-events-none select-none hidden sm:block" aria-hidden="true">🥅</span>

        <div className="container-app pt-12 pb-20 sm:pt-16 sm:pb-24 relative text-center">
          <div className="mx-auto mb-5 h-28 w-28 sm:h-36 sm:w-36 rounded-full border-4 border-gold shadow-xl overflow-hidden relative ring-4 ring-brand-900/40">
            <Image src="/miguel-hero.jpg" alt={party.childName} fill sizes="144px" className="object-cover" priority />
          </div>

          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-brand-50 mb-6">
            📣 Convocação especial
          </div>

          <p className="font-semibold text-brand-100 uppercase tracking-[0.3em] text-xs sm:text-sm mb-2">
            A festa de
          </p>
          <h1 className="font-display leading-none mb-1">
            <span className="block text-6xl sm:text-8xl drop-shadow-[0_4px_0_rgba(0,0,0,0.25)]">
              {party.age} ANOS
            </span>
            <span className="block text-3xl sm:text-5xl text-gold -rotate-2 mt-2 drop-shadow-[0_3px_0_rgba(0,0,0,0.25)]">
              do {party.childName}
            </span>
          </h1>

          <div className="inline-flex items-center rounded-full bg-black/50 backdrop-blur-sm px-5 py-2 mt-6 text-sm sm:text-base font-bold tracking-wide capitalize">
            {datePill}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#confirmar"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 font-display text-lg text-brand-700 hover:bg-brand-50 transition-colors shadow-lg"
            >
              ⚽ Confirmar presença
            </a>
            <a
              href={party.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/40 px-6 py-3 font-semibold text-white hover:bg-white/10 transition-colors"
            >
              📍 Ver no mapa
            </a>
          </div>
        </div>
      </section>

      {/* Placar: contagem regressiva */}
      <div className="container-app -mt-10 sm:-mt-12 relative z-10">
        <Countdown />
      </div>

      {/* Ficha do jogo */}
      <section className="container-app py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="card p-5 text-center border-t-4 border-t-brand-500">
            <span className="text-3xl">⏰</span>
            <p className="font-bold text-sm text-gray-900 dark:text-gray-100 capitalize mt-2">
              {formatLongDate(party.date)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">bola rolando a partir das {party.time}</p>
          </div>
          <div className="card p-5 text-center border-t-4 border-t-brand-500">
            <span className="text-3xl">🏟️</span>
            <p className="font-bold text-sm text-gray-900 dark:text-gray-100 mt-2">{party.location}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{party.address}</p>
            <a
              href={party.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
            >
              📍 Como chegar
            </a>
          </div>
          <div className="card p-5 text-center border-t-4 border-t-gold">
            <span className="text-3xl">🟨</span>
            <p className="font-bold text-sm text-gray-900 dark:text-gray-100 mt-2">Por favor, confirme até</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 capitalize">{formatLongDate(party.rsvpDeadline)}</p>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">senão é cartão amarelo! 😂</p>
          </div>
        </div>
      </section>

      {/* Confirmação de presença */}
      <div id="confirmar" className="container-app pb-14 scroll-mt-16">
        <div className="text-center mb-6">
          <h2 className="font-display text-3xl text-brand-700 dark:text-brand-400 mb-1">
            Entra pro time! ⚽
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            O craque já tá escalado — agora só falta você!
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,340px)_1fr] lg:items-start">
          {/* Figurinha do craque */}
          <div className="mx-auto w-full max-w-[280px] lg:max-w-none">
            <div className="-rotate-2 rounded-xl overflow-hidden shadow-xl ring-1 ring-black/10 transition-transform hover:rotate-0 duration-300">
              <Image
                src="/miguel-figurinha.jpg"
                alt={`Figurinha do ${party.childName}, craque da festa`}
                width={800}
                height={800}
                sizes="(min-width: 1024px) 340px, 280px"
                className="w-full h-auto"
              />
            </div>
            <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-4">
              Figurinha oficial do craque da festa ⭐
            </p>
          </div>

          <RsvpForm />
        </div>
      </div>
    </div>
  );
}
