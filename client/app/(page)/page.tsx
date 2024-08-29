import FilterSortMenu from '@/components/home/filter-sort-menu';
import MealsSection from '@/components/home/meals-section';

export default async function Home() {
  return (
    <section className="container flex flex-col items-center gap-xl px-2xl">
      <FilterSortMenu />

        <MealsSection />
  
    </section>
  );
}
