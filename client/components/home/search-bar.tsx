'use client';

import { useDebounce } from '@/hooks/use-debounce';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Input } from '../ui/input';

export default function SearchBar({ className }: { className?: string }) {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('name') ?? '');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const router = useRouter();

  const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    if (debouncedSearchTerm.trim() === '') {
      return;
    }
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('name', debouncedSearchTerm);
    console.log(searchParams.get('name'), searchTerm, debouncedSearchTerm);
    const url = new URL(window.location.href);
    url.search = newSearchParams.toString();
    router.push(url.toString());
  }, [debouncedSearchTerm]);

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
