import Link from 'next/link';
import { party } from '@/lib/config/party';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 mt-16 bg-brand-950 text-brand-100">
      <div className="container-app py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-lg">⚽</span>
          <span>{party.title} © {new Date().getFullYear()}</span>
        </div>
        <div className="flex gap-4">
          <Link href="/#confirmar" className="hover:text-white transition-colors">
            Confirmar presença
          </Link>
          <a href={party.mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            Como chegar
          </a>
          <Link href="/login" className="hover:text-white transition-colors">
            Organizadores
          </Link>
        </div>
      </div>
    </footer>
  );
}
