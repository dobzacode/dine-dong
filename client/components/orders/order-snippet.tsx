import { constructS3Url, translateStatus } from '@/lib/utils';
import { type OrderWithMealResponse } from '@/types/query';
import { CheckIcon, Loader, X } from 'lucide-react';
import moment from 'moment';
import Image from 'next/image';

export default async function OrderSnippet({
  order,

  isPurchase
}: {
  order: OrderWithMealResponse;

  isPurchase?: boolean;
}) {


  const icon = () => {
    switch (order.status) {
      case 'FINALIZED':
        return <CheckIcon className="h-4 w-4 shrink-0 text-green-500" />;
      case 'CANCELLED':
        return <X className="h-4 w-4 shrink-0 text-error" />;
      case 'IN_PROGRESS':
        return <Loader className="h-4 w-4 shrink-0 text-primary-500" />;
    }
  };

  return (
    <div className="flex w-full items-center justify-between gap-md">
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
          <div className="flex items-center gap-xs">
            {icon()} <p className="body-sm">{translateStatus(order.status)}</p>
          </div>

          <p className="body-sm">
            {isPurchase ? 'Acheté' : 'Vendu'} le{' '}
            {moment(order.create_time).format('DD/MM/YYYY à HH:mm')}
          </p>
        </div>
      </div>
      <p className="body-sm text-grayed whitespace-nowrap">{order.meal.price} €</p>
    </div>
  );
}
