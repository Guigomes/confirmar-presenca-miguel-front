import { RsvpForm } from '@/components/rsvp/rsvp-form';
import { party } from '@/lib/config/party';
import { formatLongDate } from '@/lib/utils/date';

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-brand-700 to-brand-900 text-white overflow-hidden">
        <div className="confetti-pattern absolute inset-0 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 hidden lg:flex flex-col justify-center pr-16 gap-2 pointer-events-none select-none" aria-hidden="true">
          <span className="text-[120px] leading-none text-white/10 -rotate-6">🎈</span>
          <span className="text-[64px] leading-none text-white/10 pl-12 rotate-3">🎁</span>
        </div>
        <div className="container-app py-14 sm:py-20 relative text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium text-brand-100 mb-6">
            🎉 Vem comemorar com a gente!
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-4">
            {party.title}
          </h1>
          <p className="text-brand-100 text-lg mb-8">
            Confirme sua presença e faça parte dessa festa!
          </p>
          <a
            href="#confirmar"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-brand-700 hover:bg-brand-50 transition-colors"
          >
            🎈 Confirmar presença
          </a>
        </div>
      </section>

      {/* Party info */}
      <section className="border-y border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
        <div className="container-app py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center gap-1">
              <span className="text-3xl">📅</span>
              <p className="font-semibold text-sm text-gray-900 dark:text-gray-100 capitalize">
                {formatLongDate(party.date)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">a partir das {party.time}</p>
            </div>
            <div className="flex flex-col items-center text-center gap-1">
              <span className="text-3xl">📍</span>
              <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">{party.location}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{party.address}</p>
            </div>
            <div className="flex flex-col items-center text-center gap-1">
              <span className="text-3xl">⏰</span>
              <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">Confirme até</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{formatLongDate(party.rsvpDeadline)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* RSVP form */}
      <div id="confirmar" className="container-app py-12 scroll-mt-16">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Confirme sua presença</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Preencha os dados abaixo para garantir seu lugar na festa.
          </p>
        </div>
        <RsvpForm />
      </div>
    </div>
  );
}
