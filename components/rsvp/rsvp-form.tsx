'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateRsvp } from '@/lib/hooks/use-rsvp';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { party } from '@/lib/config/party';

const rsvpSchema = z.object({
  guest_name: z.string().trim().min(2, 'Informe seu nome completo'),
  companions_count: z.coerce.number().int().min(0).max(20),
  message: z.string().trim().max(500).optional(),
});

type RsvpValues = z.infer<typeof rsvpSchema>;

export function RsvpForm() {
  const [submitted, setSubmitted] = useState(false);
  const createRsvp = useCreateRsvp();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RsvpValues>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: { guest_name: '', companions_count: 0, message: '' },
  });

  async function onSubmit(values: RsvpValues) {
    await createRsvp.mutateAsync(values);
    reset();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="card p-8 text-center">
        <p className="text-5xl mb-4">🎉</p>
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Presença confirmada!
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Nos vemos no aniversário do {party.childName}. Obrigado por confirmar!
        </p>
        <Button variant="secondary" onClick={() => setSubmitted(false)}>
          Confirmar outra pessoa
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card p-6 sm:p-8 space-y-4">
      <Input
        label="Seu nome"
        placeholder="Nome completo"
        error={errors.guest_name?.message}
        {...register('guest_name')}
      />
      <Input
        label="Quantidade de acompanhantes"
        type="number"
        min={0}
        max={20}
        error={errors.companions_count?.message}
        {...register('companions_count')}
      />
      <Textarea
        label="Mensagem para o Miguel (opcional)"
        placeholder="Deixe um recado..."
        error={errors.message?.message}
        {...register('message')}
      />

      {createRsvp.isError && (
        <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 rounded-lg px-3 py-2">
          Não foi possível confirmar sua presença. Tente novamente.
        </p>
      )}

      <Button type="submit" className="w-full" size="lg" loading={createRsvp.isPending}>
        Confirmar presença
      </Button>
    </form>
  );
}
