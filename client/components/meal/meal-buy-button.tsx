import { getUserInformations } from '@/lib/user/user-fetch';
import { cn } from '@/lib/utils';
import { getSession } from '@auth0/nextjs-auth0';
import { kv } from '@vercel/kv';
import Link from 'next/link';
import { buttonVariants } from '../ui/button';

export default async function MealBuyButton({ mealId }: { mealId: string }) {
  const session = await getSession();

  let user;
  if (session?.user?.sub) {
    try {
      user = await getUserInformations(
        { sub: session.user.sub as string },
        { next: { tags: [`user-informations-${session.user.sub}`] } }
      );
    } catch (error) {
      console.error(error);
    }
  }

  const paymentIntentUserId = await kv.get(mealId);

  return (
    <Link
      className={cn(
        buttonVariants({ variant: 'default' }),
        'w-full',
        paymentIntentUserId && paymentIntentUserId !== user?.user_id
          ? 'pointer-events-none opacity-50'
          : ''
      )}
      href={`/repas/${mealId}/achat`}
    >
      Acheter
    </Link>
  );
}
