'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import type { Rsvp, RsvpFormValues } from '@/types/rsvp';

const RSVPS_COLLECTION = 'rsvps';

export function useCreateRsvp() {
  return useMutation({
    mutationFn: async (values: RsvpFormValues) => {
      await addDoc(collection(db, RSVPS_COLLECTION), {
        guest_name: values.guest_name,
        attending: values.attending,
        companions_3plus: values.attending ? values.companions_3plus : 0,
        companions_under3: values.attending ? values.companions_under3 : 0,
        message: values.message || null,
        created_at: serverTimestamp(),
      });
    },
  });
}

export function useRsvps() {
  return useQuery({
    queryKey: ['rsvps'],
    queryFn: async (): Promise<Rsvp[]> => {
      const snapshot = await getDocs(
        query(collection(db, RSVPS_COLLECTION), orderBy('created_at', 'desc'))
      );
      return snapshot.docs.map((d) => {
        const data = d.data();
        const createdAt = data.created_at instanceof Timestamp ? data.created_at.toDate() : new Date();
        return {
          id: d.id,
          guest_name: data.guest_name,
          attending: data.attending ?? true,
          // Respostas antigas só tinham "companions_count" (sem faixa etária);
          // tratamos como 3+ anos, já que era a única categoria na época.
          companions_3plus: data.companions_3plus ?? data.companions_count ?? 0,
          companions_under3: data.companions_under3 ?? 0,
          message: data.message ?? null,
          created_at: createdAt.toISOString(),
        };
      });
    },
  });
}

export function useDeleteRsvp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await deleteDoc(doc(db, RSVPS_COLLECTION, id));
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rsvps'] });
    },
  });
}
