import { getUserInformations } from '@/lib/user/user-fetch';
import { cn, getErrorMessage } from '@/lib/utils';
import { getSession } from '@auth0/nextjs-auth0';
import { kv } from '@vercel/kv';
import Link from 'next/link';
import { buttonVariants } from '../ui/button';

export default async function MealBuyButton({
  mealId,
  ownerSub
}: {
  mealId: string;
  ownerSub: string;
}) {
  const session = await getSession();

  if (!session?.user.sub) {
    return (
      <a
        className={cn(buttonVariants({ variant: 'default' }), 'w-full rounded-sm')}
        href={'/api/auth/login'}
      >
        Acheter le repas
      </a>
    );
  }

  const user = await getUserInformations(
    { sub: session.user.sub as string },
    { next: { tags: [`user-informations-${session.user.sub}`] } }
  );

  if (user instanceof Error) {
    const message = getErrorMessage(user);
    throw new Error(`Error fetching user informations: ${message}`);
  }

  const paymentIntentUserId = await kv.get(mealId);

  if (user?.user_sub === ownerSub) {
    return (
      <Link
        className={cn(buttonVariants({ variant: 'default' }), 'w-full rounded-sm')}
        href={`/repas/${mealId}/modifier`}
      >
        Modifier le repas
      </Link>
    );
  }

  return (
    <Link
      className={cn(
        buttonVariants({ variant: 'default' }),
        'w-full rounded-sm',
        paymentIntentUserId && paymentIntentUserId !== user?.user_sub
          ? 'pointer-events-none opacity-50'
          : ''
      )}
      href={`/repas/${mealId}/achat`}
    >
      Acheter le repas
    </Link>
  );
}
