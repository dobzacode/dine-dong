import MealResume from '@/components/meal/achat/meal-resume';
import Checkout from '@/components/meal/achat/stripe/checkout';
import { getMealDetails } from '@/lib/meal/meal-fetch';
import { getSessionOrRedirect } from '@/lib/server-only-utils';
import { getUserInformations } from '@/lib/user/user-fetch';
import { getErrorMessage } from '@/lib/utils';
import { kv } from '@vercel/kv';
import { notFound, redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: { id: string } }) {
  const session = await getSessionOrRedirect(`/repas/${params.id}`);

  const user = await getUserInformations(
    { sub: session.user.sub },
    { next: { tags: [`user-informations-${session.user.sub}`] } }
  );

  if (user instanceof Error) {
    const message = getErrorMessage(user);
    throw new Error(`Error fetching user informations: ${message}`);
  }

  const paymentIntentUserSub = await kv.get(params.id);

  if (paymentIntentUserSub && paymentIntentUserSub !== user.user_sub) {
    throw new Error(
      `Payment intent user sub mismatch: ${JSON.stringify(paymentIntentUserSub)} !== ${user.user_sub}`
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
    throw new Error(`Error fetching meal details: ${message}`);
  }

  if (meal.user_sub === session.user.sub) {
    return redirect(`/commandes/ventes`);
  }

  return (
    <section className="section-px shadow-primary-40 section-py container flex flex-col justify-center gap-sm tablet:flex-row laptop-sm:max-w-[1000px]">
      <MealResume meal={meal} />
      <aside className="min-w-fit tablet:w-1/3">
        <Checkout
          ownerSub={meal.user_sub}
          user={user}
          isNewPaymentIntent={paymentIntentUserSub === null}
          mealId={meal.meal_id}
          amount={meal.price}
          description={`${meal.name}:${meal.meal_id} par ${user.username}`}
        />
      </aside>
    </section>
  );
}
