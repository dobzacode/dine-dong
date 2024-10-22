import FilterSortMenu from '@/components/home/filter-sort-menu';
import MealsPrefetch from '@/components/home/meals-prefetch';
import MealsSectionSkeleton from '@/components/home/meals-section-skeleton';
import SearchBar from '@/components/home/search-bar';
import { type getMealsParams } from '@/lib/meal/meal-fetch';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Dine Dong | Accueil',
  description: "Accueil de l'application"
};

export default async function Home({
  searchParams: { name, diet, radius, sort, max_price, lat, lng }
}: {
  searchParams: getMealsParams;
}) {
  return (
    <>
      <section className="section-px container flex flex-col items-center gap-sm">
        <SearchBar className="w-full laptop-sm:hidden" />
        <FilterSortMenu />
        <Suspense fallback={<MealsSectionSkeleton />}>
          <MealsPrefetch {...{ name, diet, radius, sort, max_price, lat, lng }} />
        </Suspense>
      </section>
    </>
  );
}
