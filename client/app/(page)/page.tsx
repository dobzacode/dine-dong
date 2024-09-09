import FilterSortMenu from '@/components/home/filter-sort-menu';
import MealsSection from '@/components/home/meals-section';
import SearchBar from '@/components/home/search-bar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dine Dong | Accueil',
  description: "Accueil de l'application"
};

export default async function Home() {
  return (
    <>
      <SearchBar className="section-px w-full tablet:hidden laptop:px-0" />
      <section className="section-px container flex flex-col items-center gap-sm">
        <FilterSortMenu />
        <MealsSection />
      </section>
    </>
  );
}
