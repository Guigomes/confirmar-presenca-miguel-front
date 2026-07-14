'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { onAuthStateChanged, signInWithRedirect, signOut as firebaseSignOut, type User } from 'firebase/auth';
import { auth, googleProvider, consumeGoogleRedirectResult } from '@/lib/firebase/client';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [redirectError, setRedirectError] = useState<unknown>(null);

  useEffect(() => {
    consumeGoogleRedirectResult().catch((err) => setRedirectError(err));

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { user, loading, redirectError };
}

export function useSignInWithGoogle() {
  return useMutation({
    // Redirects the whole page to Google and back — more reliable than a
    // popup on mobile browsers, which often block or silently drop popups.
    mutationFn: async () => {
      await signInWithRedirect(auth, googleProvider);
    },
  });
}

export function useSignOut() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await firebaseSignOut(auth);
    },
    onSuccess: () => {
      qc.clear();
    },
  });
}
