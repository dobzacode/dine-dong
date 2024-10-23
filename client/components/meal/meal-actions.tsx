import { getUserInformations } from '@/lib/user/user-fetch';
import { cn, getErrorMessage } from '@/lib/utils';
import { getSession } from '@auth0/nextjs-auth0';
import { kv } from '@vercel/kv';
import { Pencil } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from '../ui/button';
import { DeleteButton } from './delete-button';

export default async function MealActions({
  mealId,
  ownerSub,
  isOrdered
}: {
  mealId: string;
  ownerSub: string;
  isOrdered: boolean;
}) {
  const session = await getSession();

  if (!session?.user.sub || !session.accessToken) {
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
      <div className="grid gap-sm">
        <Link
          className={cn(
            buttonVariants({ variant: 'default' }),
            'w-full gap-sm rounded-sm',
            paymentIntentUserId || isOrdered ? 'pointer-events-none opacity-50' : ''
          )}
          href={`/repas/${mealId}/modifier`}
        >
          <Pencil className="h-4 w-4 shrink-0 text-primary-1" />
          Modifier le repas
        </Link>
        <DeleteButton mealId={mealId} token={session.accessToken} isOrdered={isOrdered} />
      </div>
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
