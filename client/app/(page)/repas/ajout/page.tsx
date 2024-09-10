import MealForm from '@/components/meal/meal-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Création de repas | Accueil',
  description: 'Création de repas'
};

export default async function Home() {
  return (
    <section className="section-py container mx-auto flex h-full max-w-[1200px] flex-col justify-center">
      <MealForm />
    </section>
  );
}
