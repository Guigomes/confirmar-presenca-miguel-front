import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AdminSignOut } from '@/components/layout/admin-sign-out';
import type { UserRole } from '@/types/database';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single();
  const typedProfile = profile as { role: UserRole; full_name: string | null } | null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="container-app py-2 flex items-center justify-between text-sm">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
              Painel
            </Link>
            <span className="text-gray-300 dark:text-gray-700">/</span>
            <span className="text-gray-700 dark:text-gray-300">
              {typedProfile?.role === 'admin' ? 'Organizador' : 'Convidado'}
            </span>
          </div>
          <AdminSignOut />
        </div>
      </div>

      <div className="container-app py-8">
        {typedProfile?.role !== 'admin' ? (
          <div className="card p-8 text-center">
            <p className="text-4xl mb-3">🔒</p>
            <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Acesso restrito</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Sua conta ainda não tem permissão de organizador. Peça para um administrador liberar seu acesso.
            </p>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
