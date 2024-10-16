import { constructS3Url } from '@/lib/utils';
import { type OrderWithMealResponse } from '@/types/query';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import StatusLabel from './status-label';

export default async function OrderSnippet({
  order,

  isPurchase
}: {
  order: OrderWithMealResponse;

  isPurchase?: boolean;
}) {
  return (
    <Link
      href={`/commandes/${isPurchase ? 'achats' : 'ventes'}/${order.order_id}`}
      className="flex w-full items-center justify-between gap-md rounded-sm p-sm duration-fast hover:bg-primary-50"
    >
      <div className="flex items-center gap-md">
        <div className="relative h-3xl w-3xl overflow-hidden rounded-xs">
          <Image
            fill
            src={constructS3Url(order.meal.picture_key)}
            alt={order.meal.name}
            sizes={'(max-width: 768px) 100vw, 200px'}
            className="rounded-xs object-cover"
          />
        </div>
        <div className="flex flex-col gap-xxs self-start">
          <p className="body font-medium">{order.meal.name}</p>
          <StatusLabel status={order.status} />
          <p className="body-sm">
            {isPurchase ? 'Acheté' : 'Vendu'} le {moment(order.create_time).format('DD/MM/YYYY')}
          </p>
        </div>
      </div>
      <p className="body-sm text-grayed whitespace-nowrap">{order.meal.price} €</p>
    </Link>
  );
}
