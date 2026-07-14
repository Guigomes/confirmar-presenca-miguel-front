'use client';

import { useDeleteRsvp } from '@/lib/hooks/use-rsvp';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { timeAgo } from '@/lib/utils/date';
import type { Rsvp } from '@/types/rsvp';

export function RsvpTable({ rsvps }: { rsvps: Rsvp[] }) {
  const deleteRsvp = useDeleteRsvp();

  if (!rsvps.length) {
    return (
      <EmptyState
        icon="🎈"
        title="Nenhuma confirmação ainda"
        description="Assim que os convidados confirmarem presença, eles aparecerão aqui."
      />
    );
  }

  return (
    <div className="card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-800 text-left text-xs text-gray-500 dark:text-gray-400">
            <th className="px-4 py-3 font-medium">Convidado</th>
            <th className="px-4 py-3 font-medium">Acompanhantes</th>
            <th className="px-4 py-3 font-medium">Mensagem</th>
            <th className="px-4 py-3 font-medium">Confirmado</th>
            <th className="px-4 py-3 font-medium" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {rsvps.map((r) => (
            <tr key={r.id}>
              <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{r.guest_name}</td>
              <td className="px-4 py-3">
                <Badge className="bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                  +{r.companions_count}
                </Badge>
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400 max-w-xs truncate">
                {r.message || '—'}
              </td>
              <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {timeAgo(r.created_at)}
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => {
                    if (confirm(`Remover a confirmação de ${r.guest_name}?`)) {
                      deleteRsvp.mutate(r.id);
                    }
                  }}
                  className="text-xs text-red-600 dark:text-red-400 hover:underline"
                >
                  Remover
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
