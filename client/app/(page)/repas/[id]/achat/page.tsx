import MealResume from '@/components/meal/achat/meal-resume';
import Checkout from '@/components/meal/achat/stripe/checkout';
import { getMealDetails } from '@/lib/meal/meal-fetch';
import { getUserInformations } from '@/lib/user/user-fetch';
import { getErrorMessage } from '@/lib/utils';
import { getSession } from '@auth0/nextjs-auth0';
import { kv } from '@vercel/kv';
import { Logger } from 'next-axiom';
import { notFound, redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: { id: string } }) {
  const session = await getSession();
  const log = new Logger();

  if (!session?.user?.sub) {
    redirect(`/repas/${params.id}`);
  }

  let user;
  try {
    user = await getUserInformations(
      { sub: session.user.sub as string },
      { next: { tags: [`user-informations-${session.user.sub}`] } }
    );
  } catch (error) {
    const message = getErrorMessage(error);
    console.log(message);
    error instanceof Error && log.error(`Error fetching user informations: ${message}`);
    await log.flush();
    redirect(`/repas/${params.id}`);
  }

  const paymentIntentUserSub = await kv.get(params.id);

  if (paymentIntentUserSub && paymentIntentUserSub !== user.user_sub) {
    log.error(
      `Payment intent user sub mismatch: ${JSON.stringify(paymentIntentUserSub)} !== ${user.user_sub}`
    );
    await log.flush();
    redirect(`/repas/${params.id}`);
  }

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
      log.error(`Meal not found: ${message}`);
      await log.flush();
      return notFound();
    }
    error instanceof Error && log.error(`Error fetching meal details: ${message}`);
    await log.flush();
    redirect(`/`);
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
