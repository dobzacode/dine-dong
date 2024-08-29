'use client';

import type { DietsEnum } from '@/types/schema';
import { useMemo, useState } from 'react';

import { type getMealsParams } from '@/lib/utils';
import { AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import MealSnippet from '../ui/header/meal/meal-snippet';

const MealsSection = () => {
  const [allLoaded, setAllLoaded] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const fetchOptions: getMealsParams[] = useMemo(() => {
    const diet = (searchParams.getAll('diet') as (keyof typeof DietsEnum)[]) || [];
    const name = searchParams.get('name') ?? undefined;
    const radius = parseInt(searchParams.get('radius') ?? '10', 10);
    const sort = (searchParams.get('sort') as 'distance' | 'price') ?? undefined;

    return new Array(10).fill(0).map((_, i) => ({
      offset: i,
      limit: 1,
      lat: 45.767572,
      lng: 4.833102,
      radius,
      diet,
      name,
      sort
    }));
  }, [searchParams]);

  return (
    <section className="grid w-full grid-cols-5 gap-x-md gap-y-2xl">
      <AnimatePresence mode="wait">
        {fetchOptions.map((fetchOpt, i) => (
          <MealSnippet
            key={`search-meal-${i}`}
            allLoaded={allLoaded}
            setAllLoaded={setAllLoaded}
            params={fetchOpt}
            index={i}
          />
        ))}
      </AnimatePresence>
    </section>
  );
};

MealsSection.displayName = 'MealsSection';

export default MealsSection;
