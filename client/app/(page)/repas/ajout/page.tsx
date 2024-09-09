import MealForm from '@/components/meal/meal-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Création de repas | Accueil',
  description: 'Création de repas'
};

export default async function Home() {
  return (
    <section className="container mx-auto flex h-full max-w-[1200px] justify-center pt-3xl">
      <MealForm />
    </section>
  );
}
