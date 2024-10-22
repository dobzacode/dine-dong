'use client';

import { useEffect, useMemo } from 'react';

import { useGeoLocation } from '@/hooks/use-geolocation';
import { getMeals, type getMealsParams } from '@/lib/meal/meal-fetch';
import { cn } from '@/lib/utils';
import type { MealWithAddressResponse, MealsPaginatedResponse } from '@/types/query';
import { useInfiniteQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useLogger } from 'next-axiom';
import Link from 'next/link';
import { delayFadeInVariant } from '../framer/div-variants';
import { buttonVariants } from '../ui/button';
import MealSnippet, { MealSnippetSkeleton } from './meal/meal-snippet';
import MealsSectionSkeleton from './meals-section-skeleton';

const MealsSection = ({
  prefetchMeals,
  fetchOptions: passedOptions,
  isUserPage
}: {
  prefetchMeals: MealsPaginatedResponse;
  fetchOptions: getMealsParams;
  isUserPage?: boolean;
}) => {
  const log = useLogger();

  const location = useGeoLocation();

  const fetchOptions = useMemo(() => {
    const lat = location?.lat ?? passedOptions.lat ?? 45.767572;
    const lng = location?.lng ?? passedOptions.lng ?? 4.833102;

    return {
      lat,
      lng,
      ...passedOptions
    };
  }, [location, passedOptions]);

  const { data, isFetchingNextPage, fetchNextPage, isError, error } = useInfiniteQuery<
    MealsPaginatedResponse,
    Error
  >({
    queryKey: ['search-meals', fetchOptions],
    //@ts-expect-error - type is valid<
    queryFn: async ({ pageParam = 0 }) => {
      const response = await getMeals({ ...fetchOptions, offset: pageParam, limit: 20 });
      return response;
    },
    initialData: { pages: [prefetchMeals], pageParams: [undefined] },
    getNextPageParam: (lastPage, allPages) => (lastPage.hasMore ? allPages.length * 20 : undefined),
    refetchOnWindowFocus: false,
    retry: false,
    refetchInterval: 60000
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
    if (error.message.includes('404')) {
      log.error('No meals found');
      return (
        <div className="flex w-full flex-col items-center justify-center gap-md">
          <h3 className="heading-h1">Aucun repas trouvé</h3>
          {typeof isUserPage === 'boolean' && isUserPage && (
            <Link className={cn(buttonVariants({ variant: 'default' }))} href="/nouveau/repas">
              Ajouter un repas
            </Link>
          )}
        </div>
      );
    }
    log.error('Error fetching meals', { error });
    return (
      <h3 className="heading-h1">Une erreur est survenue lors de la récupération des repas.</h3>
    );
  }

  if (!data) {
    return <MealsSectionSkeleton />;
  }

  //@ts-expect-error - type is valid
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const allMeals = data.pages.flatMap((page) => page.meals ?? []) as MealWithAddressResponse[];

  //@ts-expect-error - type is valid
  // eslint-disable-next-line
  const totalCount = data?.pages?.[0]?.total ?? 0;

  return (
    <div className="flex w-full flex-col gap-lg">
      <p className="body pt-sm font-medium">{totalCount} repas</p>

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
