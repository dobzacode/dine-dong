import { getUserInformations } from '@/lib/user/user-fetch';
import { getErrorMessage } from '@/lib/utils';
import { OrderWithMealResponse } from '@/types/query';
import moment from 'moment';
import { Logger } from 'next-axiom';
import Link from 'next/link';

export default async function BuyerSnippet({
  order,
  log
}: {
  order: OrderWithMealResponse;
  log: Logger;
}) {
  console.log(order);
  let buyer;
  try {
    buyer = await getUserInformations(
      { sub: order.user_sub },
      { next: { tags: [`user-informations-${order.user_sub}`] } }
    );
  } catch (error) {
    const message = getErrorMessage(error);
    console.log(message);
    if (message.includes('404')) {
      log.error(`User not found: ${message}`);
      await log.flush();
      return '';
    }
    log.error(`Error fetching user informations: ${message}`);
    await log.flush();
  }

  if (!buyer) {
    return <></>;
  }

  console.log(order.create_time);

  return (
    <div className="body-sm flex gap-xs">
      <p>Vendu le {moment(order.create_time).format('DD/MM/YYYY')} à </p>
      <Link className="duration-fast hover:opacity-80" href={`/utilisateur/${buyer.username}`}>
        {buyer.username}
      </Link>
    </div>
  );
}
