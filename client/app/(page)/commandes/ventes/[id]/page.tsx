import MealResume from '@/components/meal/achat/meal-resume';
import OrderDetails from '@/components/orders/order-details';
import { getOrderDetails, getOrdersSummaries } from '@/lib/order/order-fetch';
import { getSessionOrRedirect } from '@/lib/server-only-utils';
import { getErrorMessage, translateStatus } from '@/lib/utils';
import { type OrderSummaryResponse } from '@/types/query';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import moment from 'moment';
import { type Metadata } from 'next';
import { Logger } from 'next-axiom';
import { notFound } from 'next/navigation';

type Props = {
  params: { id: string };
};

export async function generateStaticParams() {
  const log = new Logger();

  let orders;
  try {
    orders = await getOrdersSummaries<OrderSummaryResponse[]>(
      {},
      {
        next: {
          revalidate: 60
        }
      }
    );
  } catch (error) {
    console.log(error);
  }

  if (!orders || orders instanceof Error) {
    log.error(`Error fetching orders: ${getErrorMessage(orders)}`);
    await log.flush();
    return [];
  }

  return orders.map((order) => ({
    id: order.order_id
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata | undefined> {
  const log = new Logger();

  let order;
  try {
    [order] = await getOrdersSummaries<OrderSummaryResponse[]>(params, {
      next: {
        tags: [`order-details-${params.id}`]
      }
    });
  } catch (error) {
    console.log(error);
  }

  if (!order || order instanceof Error) {
    log.error(`Error fetching order details: ${getErrorMessage(order)}`);
    await log.flush();
    return undefined;
  }

  console.log(order);

  return {
    title: `Vente du ${moment(order.create_time).format('DD/MM/YYYY à HH:mm')} | ${translateStatus(order.status)}`
  } satisfies Metadata;
}

//@ts-expect-error - type is valid
export default withPageAuthRequired(async function Page({ params }: Props) {
  const log = new Logger();

  const session = await getSessionOrRedirect();

  let order;
  try {
    order = await getOrderDetails(
      { orderId: params.id },
      {
        next: { tags: [`order-details-${params.id}`] },
        headers: { Authorization: `Bearer ${session.accessToken}` }
      }
    );
  } catch (error) {
    const message = getErrorMessage(error);
    console.log(message);
    log.error(`Error fetching order details: ${message}`);
    await log.flush();
    return notFound();
  }

  return (
    <section className="flex w-full flex-col gap-sm">
      <MealResume
        isOrderPage={true}
        title={`Vente du ${moment(order.create_time).format('DD/MM/YYYY à HH:mm')}`}
        meal={order.meal}
      />
      <OrderDetails token={session.accessToken} order={order} isSales={true} />
    </section>
  );
});
