import SaleSnippet from '@/components/orders/order-snippet';
import TopMenu from '@/components/orders/top-menu';
import { getSessionOrRedirect } from '@/lib/server-only-utils';
import { getUserSales } from '@/lib/user/user-fetch';
import { getErrorMessage } from '@/lib/utils';

export const metadata = {
  title: 'Mes commandes | Ventes',
  description: 'Ventes'
};

export default async function Page({
  searchParams
}: {
  searchParams?: { status: 'FINALIZED' | 'IN_PROGRESS' | 'CANCELLED' };
}) {
  const session = await getSessionOrRedirect(`/api/auth/login`);

  const orders = await getUserSales(
    session.user.sub,
    {
      next: { tags: [`user-${session.user.sub}-sales`] },
      headers: { Authorization: `Bearer ${session.accessToken}` }
    },
    { status: searchParams?.status }
  );

  if (orders instanceof Error) {
    const message = getErrorMessage(orders);
    if (!message.includes('404')) {
      throw new Error('Error fetching sales');
    }
  }

  return (
    <section className="card flex w-full flex-col gap-lg">
      <TopMenu status={searchParams?.status} />
      <section className="flex flex-col gap-xs">
        {!(orders instanceof Error) ? (
          orders.map((order) => <SaleSnippet key={order.order_id} order={order} />)
        ) : (
          <h3 className="heading-h1 text-center">Aucunes ventes trouvées</h3>
        )}
      </section>
    </section>
  );
}
