'use client';

import { useDebounce } from '@/hooks/use-debounce';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Input } from '../ui/input';

function updateSearchParams(
  currentUrl: URL,
  debouncedSearchTerm: string,
  router: ReturnType<typeof useRouter>
) {
  const newSearchParams = new URLSearchParams(currentUrl.search);
  debouncedSearchTerm.trim().length > 0
    ? newSearchParams.set('name', debouncedSearchTerm)
    : newSearchParams.delete('name');
  currentUrl.search = newSearchParams.toString();
  router.push(currentUrl.toString());
}

export default function SearchBar({ className }: { className?: string }) {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 200);
  const router = useRouter();
  const pathname = usePathname();

  const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    if (pathname !== '/') {
      return;
    }
    updateSearchParams(new URL(window.location.href), debouncedSearchTerm, router);
  }, [debouncedSearchTerm, router, pathname]);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateSearchParams(new URL(window.location.origin), searchTerm, router);
  };

  return (
    <form onSubmit={onSubmit} className={cn('', className)}>
      <div className="flex h-fit w-full items-center justify-center gap-sm rounded-full border border-input bg-background px-3 ring-offset-background focus-within:ring-1 focus-within:ring-ring tablet:w-fit">
        <Search className="stroke-foreground" size={16} />
        <Input
          color="primary"
          className="border-none focus-visible:ring-0"
          placeholder="Rechercher un repas..."
          value={searchTerm}
          onChange={handleSearchTermChange}
        />
      </div>
    </form>
  );
}
