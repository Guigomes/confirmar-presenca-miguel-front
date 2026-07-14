'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import type { UserProfile } from '@/types/database';

let _client: ReturnType<typeof createClient> | null = null;
function getClient() {
  if (!_client) _client = createClient();
  return _client;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getClient().auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const { data: { subscription } } = getClient().auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
}

export function useProfile() {
  const { user } = useUser();
  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async (): Promise<UserProfile | null> => {
      if (!user) return null;
      const { data, error } = await getClient()
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
    staleTime: 300_000,
  });
}

export function useSignIn() {
  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { data, error } = await getClient().auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    },
  });
}

export function useSignUp() {
  return useMutation({
    mutationFn: async ({ email, password, fullName }: { email: string; password: string; fullName: string }) => {
      const { data, error } = await getClient().auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (error) throw error;
      return data;
    },
  });
}

export function useSignOut() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { error } = await getClient().auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      qc.clear();
    },
  });
}
