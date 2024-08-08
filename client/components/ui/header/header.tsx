'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
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
        <p className="heading-h1 font-bold">Ding Dong</p>
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
