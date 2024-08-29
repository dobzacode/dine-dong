'use client';

import type { DietsEnum } from '@/types/schema';
import { useEffect, useMemo } from 'react';

import { getMeals } from '@/lib/utils';

import { GetMealsResponse, MealWithAddressResponse } from '@/types/query';
import { useInfiniteQuery } from '@tanstack/react-query';
import { motion, type Variants } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { Skeleton } from '../ui/skeleton';
import MealSnippet, { MealSnippetSkeleton } from './meal/meal-snippet';
import Reset from './reset';

const delayFadeInVariant: Variants = {
  hidden: { opacity: 0 },
  enter: (custom) => ({
    opacity: 1,
    transition: { duration: 0.4, delay: 0.05 * custom }
  }),
  exit: { opacity: 0, transition: { duration: 0.5 } }
};

const MealsSection = () => {
  const searchParams = useSearchParams();

  const fetchOptions = useMemo(() => {
    const diet = (searchParams.getAll('diet') as (keyof typeof DietsEnum)[]) || [];
    const name = searchParams.get('name') ?? undefined;
    const radius = parseInt(searchParams.get('radius') ?? '10', 10);
    const sort = (searchParams.get('sort') as 'distance' | 'price') ?? undefined;
    const max_price = parseInt(searchParams.get('max_price') ?? '0') || undefined;

    return {
      lat: 45.767572,
      lng: 4.833102,
      radius,
      diet,
      name,
      sort,
      max_price
    };
  }, [searchParams]);

  const { data, isFetchingNextPage, fetchNextPage, isError, error } = useInfiniteQuery<
    GetMealsResponse,
    Error
  >({
    queryKey: ['search-meals', fetchOptions],
    //@ts-expect-error - type is valid
    queryFn: async ({ pageParam = 0 }) => {
      const response = await getMeals({ ...fetchOptions, offset: pageParam, limit: 20 });
      return response;
    },
    getNextPageParam: (lastPage, allPages) => (lastPage.hasMore ? allPages.length * 20 : undefined),
    refetchOnWindowFocus: false,
    retry: false
  });

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 2 &&
        !isFetchingNextPage
      ) {
        fetchNextPage()
          .then()
          .catch((error) => {
            console.error(error);
          });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchNextPage, isFetchingNextPage]);

  if (isError) {
    console.log(error instanceof Error ? error : 'Unknown error');
    return <div>Une erreur est survenue lors de la récupération des repas.</div>;
  }

  if (!data) {
    return (
      <div className="flex w-full flex-col gap-lg">
        <div className="flex w-full items-end justify-between gap-xs">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-9 w-36 rounded-full" />
        </div>
        <section className="flex w-full flex-wrap gap-md mobile-lg:grid mobile-lg:grid-cols-2 mobile-lg:gap-y-xl tablet:grid-cols-3 tablet:gap-x-md tablet:gap-y-2xl laptop:grid-cols-5">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              initial="hidden"
              className="w-full"
              exit="exit"
              animate="enter"
              key={`search-meal-skeleton-${i}`}
              variants={delayFadeInVariant}
              custom={i}
            >
              <MealSnippetSkeleton />
            </motion.div>
          ))}
        </section>
      </div>
    );
  }

  //@ts-expect-error - type is valid
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const allMeals = data.pages.flatMap((page) => page.meals ?? []) as MealWithAddressResponse[];

  //@ts-expect-error - type is valid
  // eslint-disable-next-line
  const totalCount = data?.pages?.[0]?.total;

  return (
    <div className="flex w-full flex-col gap-lg">
      <div className="flex w-full items-end justify-between gap-xs">
        <p className="body font-medium">{totalCount} repas</p>
        <Reset />
      </div>
      <section className="flex w-full flex-wrap gap-md mobile-lg:grid mobile-lg:grid-cols-2 mobile-lg:gap-y-xl tablet:grid-cols-3 tablet:gap-x-md tablet:gap-y-2xl laptop:grid-cols-5">
        {allMeals.map((meal, i) => (
          <MealSnippet key={`search-meal-${i}`} {...meal} />
        ))}
        {isFetchingNextPage &&
          Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              className="w-full"
              initial="hidden"
              exit="exit"
              animate="enter"
              key={`search-meal-skeleton-fetching-${i}`}
              variants={delayFadeInVariant}
              custom={i}
            >
              <MealSnippetSkeleton />
            </motion.div>
          ))}
      </section>
    </div>
  );
};

MealsSection.displayName = 'MealsSection';

export default MealsSection;
