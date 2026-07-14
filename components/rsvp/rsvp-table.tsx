'use client';

import { useMemo, useState } from 'react';
import { useDeleteRsvp } from '@/lib/hooks/use-rsvp';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { cn } from '@/lib/utils/cn';
import { timeAgo } from '@/lib/utils/date';
import type { Rsvp } from '@/types/rsvp';

type SortKey = 'guest_name' | 'attending' | 'companions_count' | 'message' | 'created_at';
type SortDirection = 'asc' | 'desc';

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: 'guest_name', label: 'Convidado' },
  { key: 'attending', label: 'Status' },
  { key: 'companions_count', label: 'Acompanhantes' },
  { key: 'message', label: 'Mensagem' },
  { key: 'created_at', label: 'Respondido' },
];

export function RsvpTable({ rsvps }: { rsvps: Rsvp[] }) {
  const deleteRsvp = useDeleteRsvp();
  const [sortKey, setSortKey] = useState<SortKey>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  }

  const sorted = useMemo(() => {
    const dir = sortDirection === 'asc' ? 1 : -1;
    return [...rsvps].sort((a, b) => {
      switch (sortKey) {
        case 'guest_name':
          return dir * a.guest_name.localeCompare(b.guest_name, 'pt-BR');
        case 'attending':
          return dir * (Number(a.attending) - Number(b.attending));
        case 'companions_count':
          return dir * (a.companions_count - b.companions_count);
        case 'message':
          return dir * (a.message ?? '').localeCompare(b.message ?? '', 'pt-BR');
        case 'created_at':
          return dir * a.created_at.localeCompare(b.created_at);
        default:
          return 0;
      }
    });
  }, [rsvps, sortKey, sortDirection]);

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
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 text-left text-xs text-gray-500 dark:text-gray-400">
              {COLUMNS.map((col) => (
                <th key={col.key} className="px-4 py-3 font-medium whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => toggleSort(col.key)}
                    className="inline-flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    {col.label}
                    <span className={cn('text-[10px]', sortKey !== col.key && 'opacity-0')}>
                      {sortDirection === 'asc' ? '▲' : '▼'}
                    </span>
                  </button>
                </th>
              ))}
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {sorted.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                  {r.guest_name}
                </td>
                <td className="px-4 py-3">
                  {r.attending ? (
                    <Badge className="bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                      Vai
                    </Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                      Não vai
                    </Badge>
                  )}
                </td>
                <td className="px-4 py-3">
                  {r.attending ? (
                    <Badge className="bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                      +{r.companions_count}
                    </Badge>
                  ) : (
                    <span className="text-gray-400 dark:text-gray-600">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400 min-w-[180px] max-w-xs whitespace-normal break-words">
                  {r.message || '—'}
                </td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  {timeAgo(r.created_at)}
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
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
    </div>
  );
}
