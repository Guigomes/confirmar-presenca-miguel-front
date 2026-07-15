'use client';

import { useEffect, useMemo, useState } from 'react';
import { useDeleteRsvp, useUpdateRsvp, type RsvpEditValues } from '@/lib/hooks/use-rsvp';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/ui/empty-state';
import { cn } from '@/lib/utils/cn';
import { timeAgo } from '@/lib/utils/date';
import type { Rsvp } from '@/types/rsvp';

type SortKey = 'guest_name' | 'attending' | 'companions_total';
type SortDirection = 'asc' | 'desc';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'guest_name', label: 'Nome' },
  { key: 'attending', label: 'Status' },
  { key: 'companions_total', label: 'Convidados' },
];

function companionsTotal(r: Rsvp) {
  return r.companions_3plus + r.companions_under3;
}

function parseCompanions(value: string): number {
  const n = Number(value);
  if (value.trim() === '' || Number.isNaN(n)) return 0;
  return Math.min(Math.max(Math.trunc(n), 0), 20);
}

function useEscapeKey(onEscape: () => void) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onEscape();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onEscape]);
}

function DeleteConfirmModal({
  rsvp,
  pending,
  onCancel,
  onConfirm,
}: {
  rsvp: Rsvp;
  pending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  useEscapeKey(onCancel);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={() => !pending && onCancel()}
      role="dialog"
      aria-modal="true"
      aria-label={`Remover resposta de ${rsvp.guest_name}`}
    >
      <div
        className="card w-full max-w-sm p-6 text-center border-t-4 border-t-red-500 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-4xl mb-3">🟥</p>
        <h3 className="font-display text-xl text-gray-900 dark:text-gray-100 mb-1">
          Cartão vermelho?
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          A resposta de <span className="font-semibold text-gray-900 dark:text-gray-100">{rsvp.guest_name}</span>
          {' '}vai ser removida da lista.
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 mb-5">
          Essa ação não pode ser desfeita.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" onClick={onCancel} disabled={pending}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={pending}>
            Remover
          </Button>
        </div>
      </div>
    </div>
  );
}

function EditRsvpModal({
  rsvp,
  pending,
  onCancel,
  onSave,
}: {
  rsvp: Rsvp;
  pending: boolean;
  onCancel: () => void;
  onSave: (values: RsvpEditValues) => void;
}) {
  const [attending, setAttending] = useState(rsvp.attending);
  // string em vez de number: permite apagar o campo (ficar vazio) enquanto
  // digita, sem "grudar" em 0 a cada tecla apertada.
  const [companions3plus, setCompanions3plus] = useState(String(rsvp.companions_3plus));
  const [companionsUnder3, setCompanionsUnder3] = useState(String(rsvp.companions_under3));

  useEscapeKey(onCancel);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={() => !pending && onCancel()}
      role="dialog"
      aria-modal="true"
      aria-label={`Editar resposta de ${rsvp.guest_name}`}
    >
      <div
        className="card w-full max-w-sm p-6 border-t-4 border-t-brand-500 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-4xl text-center mb-3">✏️</p>
        <h3 className="font-display text-xl text-gray-900 dark:text-gray-100 mb-1 text-center">
          Editar resposta
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 text-center">
          {rsvp.guest_name}
        </p>

        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Vai participar?</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setAttending(true)}
              className={cn(
                'rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors',
                attending
                  ? 'border-brand-600 bg-brand-50 text-brand-700 dark:border-brand-500 dark:bg-brand-950 dark:text-brand-300'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800'
              )}
            >
              ⚽ Vai
            </button>
            <button
              type="button"
              onClick={() => setAttending(false)}
              className={cn(
                'rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors',
                !attending
                  ? 'border-red-500 bg-red-50 text-red-700 dark:border-red-500 dark:bg-red-950/40 dark:text-red-300'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800'
              )}
            >
              😢 Não vai
            </button>
          </div>
        </div>

        {attending && (
          <div className="mb-5">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Acompanhantes</p>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="3 anos ou mais"
                type="number"
                min={0}
                max={20}
                value={companions3plus}
                onChange={(e) => setCompanions3plus(e.target.value)}
              />
              <Input
                label="Menos de 3 anos"
                type="number"
                min={0}
                max={20}
                value={companionsUnder3}
                onChange={(e) => setCompanionsUnder3(e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" onClick={onCancel} disabled={pending}>
            Cancelar
          </Button>
          <Button
            onClick={() =>
              onSave({
                attending,
                companions_3plus: parseCompanions(companions3plus),
                companions_under3: parseCompanions(companionsUnder3),
              })
            }
            loading={pending}
          >
            Salvar
          </Button>
        </div>
      </div>
    </div>
  );
}

export function RsvpTable({ rsvps }: { rsvps: Rsvp[] }) {
  const deleteRsvp = useDeleteRsvp();
  const updateRsvp = useUpdateRsvp();
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [toDelete, setToDelete] = useState<Rsvp | null>(null);
  const [toEdit, setToEdit] = useState<Rsvp | null>(null);

  function confirmDelete() {
    if (!toDelete) return;
    deleteRsvp.mutate(toDelete.id, {
      onSuccess: () => setToDelete(null),
    });
  }

  function saveEdit(values: RsvpEditValues) {
    if (!toEdit) return;
    updateRsvp.mutate(
      { id: toEdit.id, values },
      { onSuccess: () => setToEdit(null) }
    );
  }

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
        case 'companions_total':
          return dir * (companionsTotal(a) - companionsTotal(b));
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
              <div className="shrink-0 flex items-center gap-3">
                <button
                  onClick={() => setToEdit(r)}
                  className="text-xs text-brand-600 dark:text-brand-400 hover:underline"
                >
                  Editar
                </button>
                <button
                  onClick={() => setToDelete(r)}
                  className="text-xs text-red-600 dark:text-red-400 hover:underline"
                >
                  Remover
                </button>
              </div>
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
              {r.attending && r.companions_3plus > 0 && (
                <Badge className="bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                  +{r.companions_3plus} (3+ anos)
                </Badge>
              )}
              {r.attending && r.companions_under3 > 0 && (
                <Badge className="bg-gold/20 text-yellow-700 dark:bg-gold/10 dark:text-gold">
                  +{r.companions_under3} (-3 anos)
                </Badge>
              )}
              {r.attending && r.companions_3plus === 0 && r.companions_under3 === 0 && (
                <span className="text-xs text-gray-400 dark:text-gray-600">sozinho(a)</span>
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

      {toDelete && (
        <DeleteConfirmModal
          rsvp={toDelete}
          pending={deleteRsvp.isPending}
          onCancel={() => !deleteRsvp.isPending && setToDelete(null)}
          onConfirm={confirmDelete}
        />
      )}

      {toEdit && (
        <EditRsvpModal
          rsvp={toEdit}
          pending={updateRsvp.isPending}
          onCancel={() => !updateRsvp.isPending && setToEdit(null)}
          onSave={saveEdit}
        />
      )}
    </div>
  );
}
