import { getUserInformations } from '@/lib/user/user-fetch';
import { getErrorMessage } from '@/lib/utils';
import { type OrderWithMealResponse } from '@/types/query';
import moment from 'moment';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function BuyerSnippet({ order }: { order: OrderWithMealResponse }) {
  const buyer = await getUserInformations(
    { sub: order.user_sub },
    { next: { tags: [`user-informations-${order.user_sub}`] } }
  );

  if (buyer instanceof Error) {
    const message = getErrorMessage(buyer);
    if (message.includes('404')) {
      return notFound();
    }
    throw new Error(`Error fetching user informations: ${message}`);
  }

  return (
    <div className="body-sm flex gap-xs">
      <p>Vendu le {moment(order.create_time).format('DD/MM/YYYY')} à </p>
      <Link className="duration-fast hover:opacity-80" href={`/utilisateur/${buyer.username}`}>
        {buyer.username}
      </Link>
    </div>
  );
}
