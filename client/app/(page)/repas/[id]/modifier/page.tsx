import MealForm from '@/components/meal/meal-form';
import { getMealDetails } from '@/lib/meal/meal-fetch';
import { getSessionOrRedirect } from '@/lib/server-only-utils';
import { getErrorMessage } from '@/lib/utils';
import { type Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Création de repas | Accueil',
  description: 'Création de repas'
};

export default async function Page({ params }: { params: { id: string } }) {
  const meal = await getMealDetails(params, {
    next: {
      tags: [`meal-details-${params.id}`]
    }
  });

  if (meal instanceof Error) {
    const message = getErrorMessage(meal);
    if (message.includes('404')) {
      return notFound();
    }
    throw new Error(`Error fetching meal details ${params.id}: ${message}`);
  }

  const session = await getSessionOrRedirect();

  if (session.user.sub !== meal.user_sub) {
    redirect('/');
  }

  return (
    <section className="section-py container mx-auto flex h-full max-w-[1200px] flex-col justify-center">
      <MealForm mealId={params.id} meal={meal} sub={session.user.sub} token={session.accessToken} />
    </section>
  );
}
