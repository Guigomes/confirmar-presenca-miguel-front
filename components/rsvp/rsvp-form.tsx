'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateRsvp } from '@/lib/hooks/use-rsvp';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import { party } from '@/lib/config/party';

function rsvpErrorMessage(error: unknown): string {
  const code = (error as { code?: string } | null)?.code;
  if (code === 'permission-denied') {
    return 'O banco de dados ainda não está liberado para receber confirmações. Avise o organizador (regras do Firestore pendentes).';
  }
  if (code) {
    return `Não foi possível enviar sua resposta (${code}). Tente novamente.`;
  }
  return 'Não foi possível enviar sua resposta. Tente novamente.';
}

const rsvpSchema = z.object({
  attending: z.boolean(),
  guest_name: z.string().trim().min(2, 'Informe seu nome completo'),
  companions_count: z.coerce.number().int().min(0).max(20),
  message: z.string().trim().max(500).optional(),
});

type RsvpValues = z.infer<typeof rsvpSchema>;

export function RsvpForm() {
  const [submitted, setSubmitted] = useState(false);
  const [attended, setAttended] = useState(true);
  const createRsvp = useCreateRsvp();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<RsvpValues>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: { attending: true, guest_name: '', companions_count: 0, message: '' },
  });

  const attending = watch('attending');

  async function onSubmit(values: RsvpValues) {
    await createRsvp.mutateAsync(values);
    setAttended(values.attending);
    reset();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="card p-8 text-center border-t-4 border-t-brand-500">
        <p className="text-5xl mb-4">{attended ? '⚽' : '😢'}</p>
        <h3 className={cn('mb-2', attended ? 'font-display text-3xl text-brand-600 dark:text-brand-400' : 'text-xl font-bold text-gray-900 dark:text-gray-100')}>
          {attended ? 'GOOOOL! Presença confirmada!' : 'Que pena!'}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {attended
            ? `Você está escalado pra festa do ${party.childName}. Nos vemos em campo!`
            : `Obrigado por avisar — vamos sentir sua falta no aniversário do ${party.childName}.`}
        </p>
        <Button variant="secondary" onClick={() => setSubmitted(false)}>
          Enviar outra resposta
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card p-6 sm:p-8 space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
          Você vai poder vir?
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setValue('attending', true)}
            className={cn(
              'rounded-lg border px-4 py-3 text-sm font-semibold transition-colors',
              attending
                ? 'border-brand-600 bg-brand-50 text-brand-700 dark:border-brand-500 dark:bg-brand-950 dark:text-brand-300'
                : 'border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800'
            )}
          >
            ⚽ Tô dentro!
          </button>
          <button
            type="button"
            onClick={() => setValue('attending', false)}
            className={cn(
              'rounded-lg border px-4 py-3 text-sm font-semibold transition-colors',
              !attending
                ? 'border-red-500 bg-red-50 text-red-700 dark:border-red-500 dark:bg-red-950/40 dark:text-red-300'
                : 'border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800'
            )}
          >
            😢 Não vou poder ir
          </button>
        </div>
      </div>

      <Input
        label="Seu nome"
        placeholder="Nome completo"
        error={errors.guest_name?.message}
        {...register('guest_name')}
      />

      {attending && (
        <Input
          label="Quantidade de acompanhantes"
          type="number"
          min={0}
          max={20}
          error={errors.companions_count?.message}
          {...register('companions_count')}
        />
      )}

      <Textarea
        label={attending ? 'Mensagem para o Miguel (opcional)' : 'Deixe um recado (opcional)'}
        placeholder="Deixe um recado..."
        error={errors.message?.message}
        {...register('message')}
      />

      {createRsvp.isError && (
        <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 rounded-lg px-3 py-2">
          {rsvpErrorMessage(createRsvp.error)}
        </p>
      )}

      <Button
        type="submit"
        variant={attending ? 'primary' : 'danger'}
        className="w-full"
        size="lg"
        loading={createRsvp.isPending}
      >
        {attending ? 'Confirmar presença' : 'Avisar que não vou'}
      </Button>
    </form>
  );
}
