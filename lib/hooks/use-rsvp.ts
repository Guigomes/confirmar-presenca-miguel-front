'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { Rsvp, RsvpFormValues } from '@/types/database';

let _client: ReturnType<typeof createClient> | null = null;
function getClient() {
  if (!_client) _client = createClient();
  return _client;
}

export function useCreateRsvp() {
  return useMutation({
    mutationFn: async (values: RsvpFormValues) => {
      const { data, error } = await getClient()
        .from('rsvps')
        .insert({
          guest_name: values.guest_name,
          companions_count: values.companions_count,
          message: values.message || null,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
  });
}

export function useRsvps() {
  return useQuery({
    queryKey: ['rsvps'],
    queryFn: async (): Promise<Rsvp[]> => {
      const { data, error } = await getClient()
        .from('rsvps')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useDeleteRsvp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await getClient().from('rsvps').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rsvps'] });
    },
  });
}
