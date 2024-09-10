'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SideMenu() {
  const pathname = usePathname();

  return (
    <aside className="flex w-1/3 flex-col gap-md">
      <h1 className="heading-h1 font-medium">Paramètres</h1>
      <nav className="[&>a]:heading-h4 flex flex-col gap-sm">
        <Link
          className={pathname === '/parametres/profil' ? '' : 'text-grayed'}
          href="/parametres/profil"
        >
          Profil
        </Link>
        <Link
          className={pathname === '/parametres/compte' ? '' : 'text-grayed'}
          href="/parametres/compte"
        >
          Compte
        </Link>
      </nav>
    </aside>
  );
}
