'use client';

import SearchBar from '@/components/home/search-bar';
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../button';
import { Skeleton } from '../skeleton';

export default function Header() {
  const pathname = usePathname();
  const { user, isLoading, error } = useUser();

  console.log(user);

  return (
    <header>
      <section className="relative z-50 flex items-center justify-between bg-transparent px-2xl py-xl">
        <Link href="/">
          <p className="heading-h1 font-bold">Dine Dong</p>
        </Link>
        <SearchBar />
        <nav>
          {!isLoading ? (
            <Button variant={user && 'ghost'} asChild>
              <a href={`/api/auth/${user ? 'logout' : 'login'}`}>
                {user ? 'Se déconnecter' : 'Se connecter'}
              </a>
            </Button>
          ) : (
            <Skeleton className="h-[32px] w-[140px] rounded-xs" />
          )}
        </nav>
      </section>
    </header>
  );
}
