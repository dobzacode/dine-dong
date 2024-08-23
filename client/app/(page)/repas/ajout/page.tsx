import MealForm from '@/components/ui/meal-form';

export default async function Home() {
  return (
    <section className="container mx-auto flex max-w-[1200px] justify-center">
      <MealForm />
    </section>
  );
}
