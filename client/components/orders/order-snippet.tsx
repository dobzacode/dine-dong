import { constructS3Url, translateStatus } from '@/lib/utils';
import { type OrderWithMealResponse } from '@/types/query';
import { CheckIcon, Loader, X } from 'lucide-react';
import moment from 'moment';
import { Logger } from 'next-axiom';
import Image from 'next/image';
import BuyerSnippet from './sales/buyer-snippet';

export default function OrderSnippet({
  order,
  log,
  isPurchase
}: {
  order: OrderWithMealResponse;
  log: Logger;
  isPurchase?: boolean;
}) {
  const icon = () => {
    switch (order.status) {
      case 'COMPLETED':
        return <CheckIcon className="text-success h-4 w-4 shrink-0" />;
      case 'CANCELLED':
        return <X className="h-4 w-4 shrink-0 text-error" />;
      case 'IN_PROGRESS':
        return <Loader className="h-4 w-4 shrink-0 text-primary-500" />;
    }
  };

  return (
    <div className="flex w-full">
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
            {isPurchase ? (
              <p className="body-sm">
                Acheté le {moment(order.create_time).format('DD/MM/YYYY à HH:mm')}
              </p>
            ) : (
              <BuyerSnippet log={log} order={order} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
