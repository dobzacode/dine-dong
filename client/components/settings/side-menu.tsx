'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SideMenu() {
  const pathname = usePathname();

  return (
    <aside className="flex w-full flex-col gap-md max-laptop-sm:px-sm laptop:w-1/3">
      <h1 className="heading-h1 font-medium">Paramètres</h1>
      <nav className="[&>a]:heading-h4 flex gap-md laptop-sm:flex-col laptop-sm:gap-sm">
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
