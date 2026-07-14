import type { Rsvp } from '@/types/rsvp';

export function RsvpSummary({ rsvps }: { rsvps: Rsvp[] }) {
  const confirmed = rsvps.filter((r) => r.attending);
  const declined = rsvps.filter((r) => !r.attending);
  const totalGuests = confirmed.reduce((sum, r) => sum + 1 + r.companions_count, 0);

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      <div className="card p-4">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Confirmados</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{confirmed.length}</p>
      </div>
      <div className="card p-4">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Total de convidados</p>
        <p className="text-2xl font-bold text-brand-600 dark:text-brand-400">{totalGuests}</p>
      </div>
      <div className="card p-4">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Não vão</p>
        <p className="text-2xl font-bold text-gray-400 dark:text-gray-500">{declined.length}</p>
      </div>
    </div>
  );
}
