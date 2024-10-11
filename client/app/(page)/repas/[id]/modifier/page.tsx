import MealForm from '@/components/meal/meal-form';
import { getMealDetails } from '@/lib/meal/meal-fetch';
import { getErrorMessage } from '@/lib/utils';
import { getSession } from '@auth0/nextjs-auth0';
import { type Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Création de repas | Accueil',
  description: 'Création de repas'
};

export default async function Home({ params }: { params: { id: string } }) {
  let meal;
  try {
    meal = await getMealDetails(params, {
      next: {
        tags: [`meal-details-${params.id}`]
      }
    });
  } catch (error) {
    const message = getErrorMessage(error);
    if (message.includes('404')) {
      return notFound();
    }
    redirect(`/`);
  }

  const session = await getSession();

  if (!session?.user?.sub || session.user.sub !== meal.user_sub || !session.accessToken) {
    redirect('/');
  }

  return (
    <section className="section-py container mx-auto flex h-full max-w-[1200px] flex-col justify-center">
      <MealForm
        mealId={params.id}
        meal={meal}
        sub={session.user.sub as string}
        token={session.accessToken}
      />
    </section>
  );
}
