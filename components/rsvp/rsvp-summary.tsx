import type { Rsvp } from '@/types/database';

export function RsvpSummary({ rsvps }: { rsvps: Rsvp[] }) {
  const totalConfirmations = rsvps.length;
  const totalGuests = rsvps.reduce((sum, r) => sum + 1 + r.companions_count, 0);

  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      <div className="card p-4">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Confirmações</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalConfirmations}</p>
      </div>
      <div className="card p-4">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Total de convidados</p>
        <p className="text-2xl font-bold text-brand-600 dark:text-brand-400">{totalGuests}</p>
      </div>
    </div>
  );
}
