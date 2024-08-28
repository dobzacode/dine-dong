import FilterSortMenu from '@/components/home/filter-sort-menu';
import NearMeSection from '@/components/home/near-me-section';
import { Suspense } from 'react';

export default async function Home() {
  return (
    <section className="container flex flex-col items-center gap-xl px-2xl">
      <FilterSortMenu />
      <Suspense>
        <NearMeSection />
      </Suspense>
    </section>
  );
}
