import Link from 'next/link';
import { party } from '@/lib/config/party';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 mt-16">
      <div className="container-app py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎈</span>
          <span>{party.title} © {new Date().getFullYear()}</span>
        </div>
        <div className="flex gap-4">
          <Link href="/#confirmar" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
            Confirmar presença
          </Link>
          <Link href="/login" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
            Organizadores
          </Link>
        </div>
      </div>
    </footer>
  );
}
