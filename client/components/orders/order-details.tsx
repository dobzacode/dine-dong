import { type OrderWithMealResponse } from '@/types/query';
import { UserInformations } from '../meal/user-informations';
import { CancelButton } from './actions/cancel-button';
import { ConfirmButton } from './actions/confirm-button';
import StatusLabel from './status-label';

export default async function OrderDetails({
  order,
  isSales,
  token
}: {
  order: OrderWithMealResponse;
  isSales: boolean;
  token: string;
}) {
  return (
    <section className="card flex h-fit w-full flex-col gap-md p-md">
      <h2 className="body text-grayed">Details de la commande</h2>
      <div className="flex flex-col gap-lg mobile-lg:flex-row">
        <div className="flex flex-col gap-xs">
          <h2 className="body-sm text-grayed">Acheteur</h2>
          <UserInformations
            isOrderPage={true}
            className="items-start gap-xs border-none !p-0"
            userSub={isSales ? order.user_sub : order.meal.user_sub}
          />
        </div>
        <div className="flex flex-row gap-lg mobile-lg:contents">
          <div className="flex shrink-0 flex-col gap-xs">
            <h2 className="body-sm text-grayed">Status</h2>
            <StatusLabel status={order.status} />
          </div>
          {order.status === 'IN_PROGRESS' ? (
            <div className="flex shrink-0 flex-col gap-xs">
              <h2 className="body-sm text-grayed">Actions</h2>
              <div className="flex flex-col gap-xxs">
                <CancelButton
                  dialogDescription={
                    isSales
                      ? "L'annulation de la commande est irréversible. Votre plat sera à nouveau consultable depuis la recherche de repas et celui-ci pourra à nouveau être commandée."
                      : "L'annulation de la commande est irréversible. L'autorisation de prélévement effectuée sur votre moyen de paiement sera annulée."
                  }
                  order={order}
                  token={token}
                />
                {isSales ? <ConfirmButton order={order} token={token} /> : ''}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
