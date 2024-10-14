'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SideMenu() {
  const pathname = usePathname();

  return (
    <aside className="flex w-full min-w-fit flex-col gap-md max-laptop-sm:px-sm laptop:w-1/3">
      <h1 className="heading-h1 whitespace-nowrap font-medium">Mes commandes</h1>
      <nav className="[&>a]:heading-h4 flex gap-md laptop-sm:flex-col laptop-sm:gap-sm">
        <Link
          className={pathname === '/commandes/ventes' ? '' : 'text-grayed'}
          href="/commandes/ventes"
        >
          Ventes
        </Link>
        <Link
          className={pathname === '/commandes/achats' ? '' : 'text-grayed'}
          href="/commandes/achats"
        >
          Achats
        </Link>
      </nav>
    </aside>
  );
}
