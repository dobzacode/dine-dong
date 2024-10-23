import MealForm from '@/components/meal/meal-form';
import { buttonVariants } from '@/components/ui/button';
import { getMealDetails } from '@/lib/meal/meal-fetch';
import { getSessionOrRedirect } from '@/lib/server-only-utils';
import { cn, getErrorMessage } from '@/lib/utils';
import { kv } from '@vercel/kv';
import { type Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Création de repas | Accueil',
  description: 'Création de repas'
};

export default async function Page({ params }: { params: { id: string } }) {
  const paymentIntentUserId = await kv.get(params.id);

  if (paymentIntentUserId) {
    return (
      <main className="flex min-h-[calc(100vh-11.7rem)] flex-col items-center justify-center px-lg py-lg">
        <section className="flex flex-col items-center justify-center gap-md">
          <p className="body max-w-[400px] text-center">
            Une tentative de paiement est déjà en cours pour ce repas, veuillez réessayer plus tard.
          </p>
          <Link className={cn(buttonVariants({ variant: 'default' }))} href="/">
            Retour à la page d&apos;accueil
          </Link>
        </section>
      </main>
    );
  }

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

  if (meal.is_ordered) {
    return (
      <main className="flex min-h-[calc(100vh-11.7rem)] flex-col items-center justify-center px-lg py-lg">
        <section className="flex flex-col items-center justify-center gap-md">
          <p className="body max-w-[400px] text-center">
            Le repas a déjà été commandé par un autre utilisateur, veuillez réessayer plus tard.
          </p>
          <Link className={cn(buttonVariants({ variant: 'default' }))} href="/">
            Retour à la page d&apos;accueil
          </Link>
        </section>
      </main>
    );
  }

  return (
    <section className="section-py container mx-auto flex h-full max-w-[1200px] flex-col justify-center">
      <MealForm mealId={params.id} meal={meal} sub={session.user.sub} token={session.accessToken} />
    </section>
  );
}
