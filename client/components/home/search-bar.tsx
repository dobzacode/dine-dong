'use client';

import { useDebounce } from '@/hooks/use-debounce';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Input } from '../ui/input';

export default function SearchBar({ className }: { className?: string }) {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 200);
  const router = useRouter();

  const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const currentUrl = new URL(window.location.href);
    const newSearchParams = new URLSearchParams(currentUrl.search);

    debouncedSearchTerm.trim().length > 0
      ? newSearchParams.set('name', debouncedSearchTerm)
      : newSearchParams.delete('name');

    if (currentUrl.pathname !== '/') {
      currentUrl.pathname = '/';
    }

    currentUrl.search = newSearchParams.toString();
    router.push(currentUrl.toString());
  }, [debouncedSearchTerm, router]);

  return (
    <form className={cn('', className)}>
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
