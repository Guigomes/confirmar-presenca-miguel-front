import type { Rsvp } from '@/types/rsvp';

export function RsvpSummary({ rsvps }: { rsvps: Rsvp[] }) {
  const confirmed = rsvps.filter((r) => r.attending);
  const declined = rsvps.filter((r) => !r.attending);
  const total3plus = confirmed.reduce((sum, r) => sum + 1 + r.companions_3plus, 0);
  const totalUnder3 = confirmed.reduce((sum, r) => sum + r.companions_under3, 0);

  return (
    <div className="mb-6">
      <div className="grid grid-cols-3 gap-3">
        <div className="card p-4">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Confirmados</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{confirmed.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Total de convidados</p>
          <p className="text-2xl font-bold text-brand-600 dark:text-brand-400">{total3plus + totalUnder3}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Não vão</p>
          <p className="text-2xl font-bold text-gray-400 dark:text-gray-500">{declined.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-3">
        <div className="card p-4">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">3 anos ou mais</p>
          <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{total3plus}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Menos de 3 anos</p>
          <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{totalUnder3}</p>
        </div>
      </div>
    </div>
  );
}
