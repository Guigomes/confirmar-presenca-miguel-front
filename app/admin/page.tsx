'use client';

import { useRsvps } from '@/lib/hooks/use-rsvp';
import { RsvpSummary } from '@/components/rsvp/rsvp-summary';
import { RsvpTable } from '@/components/rsvp/rsvp-table';
import { PageSpinner } from '@/components/ui/spinner';

export default function AdminDashboard() {
  const { data: rsvps, isLoading } = useRsvps();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Confirmações</h1>

      {isLoading ? (
        <PageSpinner />
      ) : (
        <>
          <RsvpSummary rsvps={rsvps ?? []} />
          <RsvpTable rsvps={rsvps ?? []} />
        </>
      )}
    </div>
  );
}
