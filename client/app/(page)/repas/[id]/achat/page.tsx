import Checkout from '@/components/stripe/checkout';
import { getMealDetails } from '@/lib/meal/meal-fetch';
import { getUserInformations } from '@/lib/user/user-fetch';
import { getErrorMessage } from '@/lib/utils';
import { getSession } from '@auth0/nextjs-auth0';
import { kv } from '@vercel/kv';
import { notFound, redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: { id: string } }) {
  const session = await getSession();

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
    redirect(`/repas/${params.id}`);
  }

  const paymentIntentUserId = await kv.get(params.id);

  if (paymentIntentUserId && paymentIntentUserId !== user.user_sub) {
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
      return notFound();
    }
    redirect(`/`);
  }

  return (
    <section className="section-px shadow-primary-40 section-py container flex flex-col justify-center gap-sm tablet:flex-row">
      <aside className="w-1/3 min-w-fit">
        <Checkout
          user={user}
          isNewPaymentIntent={paymentIntentUserId === null}
          mealId={meal.meal_id}
          amount={meal.price}
          description={`${meal.name}:${meal.meal_id} par ${user.username}`}
        />
      </aside>
    </section>
  );
}
