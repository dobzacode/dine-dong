import SaleSnippet from '@/components/orders/order-snippet';
import TopMenu from '@/components/orders/top-menu';
import { getUserPurchases } from '@/lib/user/user-fetch';
import { getErrorMessage } from '@/lib/utils';
import { type OrderWithMealResponse } from '@/types/query';
import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { Logger } from 'next-axiom';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Mes commandes | Achats',
  description: 'Achats'
};

//@ts-expect-error - type is valid
export default withPageAuthRequired(async function Page({
  searchParams
}: {
  searchParams: { status?: 'FINALIZED' | 'IN_PROGRESS' | 'CANCELLED' };
}) {
  const log = new Logger();
  const session = await getSession();

  if (!session?.user?.sub || !session.accessToken) {
    redirect('/');
  }

  let orders: OrderWithMealResponse[] = [];
  try {
    orders = await getUserPurchases(
      session.user.sub as string,
      {
        next: { tags: [`user-${session.user.sub}-purchases`] },
        headers: { Authorization: `Bearer ${session.accessToken}` }
      },
      { status: searchParams?.status }
    );
  } catch (error) {
    const message = getErrorMessage(error);
    if (!message.includes('404')) {
      log.error(`Orders not found: ${message}`);
      await log.flush();
      redirect('/');
    }
    log.error('Error fetching orders', { error, status: searchParams?.status });
    await log.flush();
  }

  return (
    <section className="card flex w-full flex-col gap-lg">
      <TopMenu status={searchParams?.status} />
      <section className="flex flex-col gap-xs">
        {orders.length > 0 ? (
          orders.map((order) => (
            <SaleSnippet isPurchase={true} key={order.order_id} order={order} />
          ))
        ) : (
          <h3 className="heading-h1 text-center">Aucuns achats trouvés</h3>
        )}
      </section>
    </section>
  );
});
