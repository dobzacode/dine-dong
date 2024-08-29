'use client';

import SearchBar from '@/components/home/search-bar';
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import { Button } from '../button';
import { Skeleton } from '../skeleton';

export default function Header() {
  const { user, isLoading } = useUser();

  return (
    <header className="section-px relative z-50 flex w-screen items-center justify-between overflow-hidden bg-transparent py-md laptop:px-2xl">
      <Link href="/">
        <p className="heading-h1 font-bold">Dine Dong</p>
      </Link>
      <SearchBar className="hidden tablet:block" />
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
    </header>
  );
}
