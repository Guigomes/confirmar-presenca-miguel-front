'use client';

import { useMemo, useState } from 'react';
import { useDeleteRsvp } from '@/lib/hooks/use-rsvp';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { cn } from '@/lib/utils/cn';
import { timeAgo } from '@/lib/utils/date';
import type { Rsvp } from '@/types/rsvp';

type SortKey = 'guest_name' | 'attending' | 'companions_count';
type SortDirection = 'asc' | 'desc';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'guest_name', label: 'Nome' },
  { key: 'attending', label: 'Status' },
  { key: 'companions_count', label: 'Convidados' },
];

export function RsvpTable({ rsvps }: { rsvps: Rsvp[] }) {
  const deleteRsvp = useDeleteRsvp();
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  }

  const sorted = useMemo(() => {
    if (!sortKey) return [...rsvps].sort((a, b) => b.created_at.localeCompare(a.created_at));

    const dir = sortDirection === 'asc' ? 1 : -1;
    return [...rsvps].sort((a, b) => {
      switch (sortKey) {
        case 'guest_name':
          return dir * a.guest_name.localeCompare(b.guest_name, 'pt-BR');
        case 'attending':
          return dir * (Number(a.attending) - Number(b.attending));
        case 'companions_count':
          return dir * (a.companions_count - b.companions_count);
        default:
          return 0;
      }
    });
  }, [rsvps, sortKey, sortDirection]);

  if (!rsvps.length) {
    return (
      <EmptyState
        icon="⚽"
        title="Nenhuma confirmação ainda"
        description="Assim que os convidados confirmarem presença, eles aparecerão aqui."
      />
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Ordenar por:</span>
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => toggleSort(opt.key)}
            className={cn(
              'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors',
              sortKey === opt.key
                ? 'border-brand-600 bg-brand-50 text-brand-700 dark:border-brand-500 dark:bg-brand-950 dark:text-brand-300'
                : 'border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800'
            )}
          >
            {opt.label}
            {sortKey === opt.key && <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {sorted.map((r) => (
          <div key={r.id} className="card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 dark:text-gray-100">{r.guest_name}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{timeAgo(r.created_at)}</p>
              </div>
              <button
                onClick={() => {
                  if (confirm(`Remover a confirmação de ${r.guest_name}?`)) {
                    deleteRsvp.mutate(r.id);
                  }
                }}
                className="shrink-0 text-xs text-red-600 dark:text-red-400 hover:underline"
              >
                Remover
              </button>
            </div>

            <div className="flex items-center gap-2 mt-2">
              {r.attending ? (
                <Badge className="bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                  Vai
                </Badge>
              ) : (
                <Badge className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                  Não vai
                </Badge>
              )}
              {r.attending && (
                <Badge className="bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                  +{r.companions_count} acompanhante{r.companions_count === 1 ? '' : 's'}
                </Badge>
              )}
            </div>

            {r.message && (
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap break-words">
                {r.message}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
