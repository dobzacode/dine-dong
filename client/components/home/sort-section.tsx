'use client';

import { cn } from '@/lib/utils';
import { Check, ChevronDown, RotateCcw, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';

const SortSection = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialSortOption = searchParams.get('sort') ?? undefined;

  const [temporarySortOption, setTemporarySortOption] = useState<string | undefined>(
    initialSortOption
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleSortChange = (value: string) => {
    setTemporarySortOption(value);
  };

  const applyChanges = () => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (temporarySortOption) {
      newSearchParams.set('sort', temporarySortOption);
    } else {
      newSearchParams.delete('sort');
    }

    const url = new URL(window.location.origin);
    url.search = newSearchParams.toString();
    router.push(url.toString());

    setIsOpen(false);
  };

  const handleReinitialize = () => {
    setTemporarySortOption(undefined);

    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete('sort');

    const url = new URL(window.location.origin);
    url.search = newSearchParams.toString();
    router.push(url.toString());
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger
        className={cn(
          `body flex h-10 w-fit items-center justify-between gap-sm rounded-full border border-input bg-background px-3 py-2 ring-offset-background duration-medium focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-primary-900/[0.4] [&>span]:line-clamp-1`,
          searchParams.get('sort') && 'border-primary-900 bg-primary-900 text-white'
        )}
      >
        Trier
        <ChevronDown className="h-4 w-4 opacity-50" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit rounded-xs">
        <DropdownMenuLabel className="flex items-center justify-between">
          Trier par
          <X
            onClick={() => setIsOpen(false)}
            className="h-4 w-4 cursor-pointer opacity-50 duration-fast"
          />
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuRadioGroup value={temporarySortOption} onValueChange={handleSortChange}>
          <DropdownMenuRadioItem
            onSelect={(e) => e.preventDefault()}
            className="relative"
            value="distance"
          >
            Distance
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem onSelect={(e) => e.preventDefault()} value="prix">
            Prix
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator />

        <div className="flex justify-center">
          <DropdownMenuItem className="gap-sm" onSelect={handleReinitialize}>
            <RotateCcw className="h-4 w-4 shrink-0 opacity-50" />
            Réinitialiser
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-sm" onSelect={applyChanges}>
            <Check className="h-4 w-4 shrink-0 opacity-50" />
            Appliquer
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SortSection;
