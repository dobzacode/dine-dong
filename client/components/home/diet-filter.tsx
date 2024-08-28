'use client';

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { type DietsEnum } from '@/types/schema';
import { Check, ChevronDown, RotateCcw, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { dietEnum } from '../ui/meal-form/meal-schema';

const DietFilter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedDiets, setSelectedDiets] = useState<string[]>(searchParams.getAll('diet'));
  const [temporarySelectedDiets, setTemporarySelectedDiets] = useState<string[]>(selectedDiets);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const currentDiets = searchParams.getAll('diet');
    if (currentDiets.join() !== selectedDiets.join()) {
      setSelectedDiets(currentDiets);
      setTemporarySelectedDiets(currentDiets);
    }
  }, [searchParams, selectedDiets]);

  const handleDietChange = (diet: keyof typeof DietsEnum) => {
    const updatedDiets = (() => {
      if (diet === 'VEGETARIAN' && temporarySelectedDiets.includes('VEGAN')) {
        return [...temporarySelectedDiets.filter((d) => d !== 'VEGAN'), diet];
      } else if (diet === 'VEGAN' && temporarySelectedDiets.includes('VEGETARIAN')) {
        return [...temporarySelectedDiets.filter((d) => d !== 'VEGETARIAN'), diet];
      } else if (temporarySelectedDiets.includes(diet)) {
        return temporarySelectedDiets.filter((d) => d !== diet);
      } else {
        return [...temporarySelectedDiets, diet];
      }
    })();

    setTemporarySelectedDiets(updatedDiets);
  };

  const applyChanges = () => {
    setSelectedDiets(temporarySelectedDiets);

    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete('diet');
    temporarySelectedDiets.forEach((diet) => {
      newSearchParams.append('diet', diet);
    });

    const url = new URL(window.location.origin);
    url.search = newSearchParams.toString();
    router.push(url.toString());

    setIsOpen(false);
  };

  const handleReinitialize = () => {
    setSelectedDiets([]);
    setTemporarySelectedDiets([]);
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete('diet');
    const url = new URL(window.location.origin);
    url.search = newSearchParams.toString();
    router.push(url.toString());
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger
        className={cn(
          `body flex h-10 w-fit items-center justify-between gap-sm rounded-full border border-input bg-background px-3 py-2 ring-offset-background duration-medium focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-primary-900/[0.4] [&>span]:line-clamp-1`,
          selectedDiets.length > 0 && 'border-primary-900 bg-primary-900 text-white'
        )}
      >
        Régime
        <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit rounded-xs">
        <DropdownMenuLabel className="flex items-center justify-between gap-md">
          Régime alimentaire
          <X
            onClick={() => setIsOpen(false)}
            className="h-4 w-4 shrink-0 cursor-pointer opacity-50 duration-fast"
          />
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {dietEnum.map((diet) => (
          <DropdownMenuCheckboxItem
            onSelect={(e) => e.preventDefault()}
            key={diet.value}
            checked={temporarySelectedDiets.includes(diet.value)}
            onCheckedChange={() => handleDietChange(diet.value)}
          >
            {diet.label}
          </DropdownMenuCheckboxItem>
        ))}

        <DropdownMenuSeparator />

        <div className="flex justify-center">
          <DropdownMenuItem className="gap-sm" onSelect={handleReinitialize}>
            <RotateCcw className="h-4 w-4 opacity-50" />
            Réinitialiser
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-sm" onSelect={applyChanges}>
            <Check className="h-4 w-4 opacity-50" />
            Appliquer
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DietFilter;
