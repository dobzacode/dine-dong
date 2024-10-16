import { type OrderWithMealResponse } from '@/types/query';
import { UserInformations } from '../meal/user-informations';
import StatusLabel from './status-label';

export default async function OrderDetails({
  order,
  isSales
}: {
  order: OrderWithMealResponse;
  isSales: boolean;
}) {
  return (
    <section className="card flex h-fit w-full flex-col gap-md p-md">
      <h2 className="body text-grayed">Details de la commande</h2>
      <div className="flex gap-lg">
        <div className="flex flex-col gap-xs">
          <h2 className="body-sm text-grayed">Acheteur</h2>
          <UserInformations
            isOrderPage={true}
            className="items-start gap-xs border-none !p-0"
            userSub={isSales ? order.user_sub : order.meal.user_sub}
          />
        </div>
        <div className="flex flex-col gap-xs">
          <h2 className="body-sm text-grayed">Status</h2>
          <StatusLabel status={order.status} />
        </div>
      </div>
    </section>
  );
}
