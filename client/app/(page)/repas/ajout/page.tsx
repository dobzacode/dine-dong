import MealForm from '@/components/meal/meal-form';

export default async function Home() {
  return (
    <section className="container mx-auto flex h-full max-w-[1200px] justify-center pt-3xl">
      <MealForm />
    </section>
  );
}
