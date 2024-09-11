import SearchBar from '@/components/home/search-bar';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Suspense } from 'react';
import { buttonVariants } from '../button';
import { Skeleton } from '../skeleton';
import UserSection from './user-section';

export default function Header() {
  return (
    <header className="section-px relative z-50 flex w-screen items-center justify-between overflow-hidden bg-transparent py-md laptop:px-2xl">
      <Link href="/">
        <p className="heading-h1 font-bold">Dine Dong</p>
      </Link>
      <SearchBar className="hidden tablet:block" />
      <nav className="flex gap-lg">
        <Suspense fallback={<Skeleton className="h-button w-[140px] rounded-xs" />}>
          <UserSection />
        </Suspense>
        <Link className={cn(buttonVariants({ variant: 'default' }))} href="/repas/ajout">
          Vendre un repas
        </Link>
      </nav>
    </header>
  );
}
