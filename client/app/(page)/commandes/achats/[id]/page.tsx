import MealResume from '@/components/meal/achat/meal-resume';
import OrderDetails from '@/components/orders/order-details';
import { getOrderDetails, getOrdersSummaries } from '@/lib/order/order-fetch';
import { getSessionOrRedirect } from '@/lib/server-only-utils';
import { getErrorMessage, translateStatus } from '@/lib/utils';
import { type OrderSummaryResponse } from '@/types/query';
import moment from 'moment';
import { type Metadata } from 'next';
import { Logger } from 'next-axiom';
import { notFound } from 'next/navigation';

type Props = {
  params: { id: string };
};

export async function generateStaticParams() {
  const log = new Logger();
  const orders = await getOrdersSummaries<OrderSummaryResponse[]>(
    {},
    {
      next: {
        revalidate: 60
      }
    }
  );

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
  const order = await getOrdersSummaries<OrderSummaryResponse[]>(params, {
    next: {
      tags: [`order-details-${params.id}`]
    }
  });

  if (order instanceof Error || !order[0]) {
    log.error(`Error fetching purchase details: ${getErrorMessage(order)}`);
    return undefined;
  }

  return {
    title: `Achat du ${moment(order[0].create_time).format('DD/MM/YYYY à HH:mm')} | ${translateStatus(order[0].status)}`
  } satisfies Metadata;
}

export default async function Home({ params }: Props) {
  const session = await getSessionOrRedirect();

  const order = await getOrderDetails(
    { orderId: params.id },
    {
      next: { tags: [`order-details-${params.id}`] },
      headers: { Authorization: `Bearer ${session.accessToken}` }
    }
  );

  if (order instanceof Error) {
    const message = getErrorMessage(order);
    if (message.includes('404')) {
      return notFound();
    }
    throw new Error(`Error fetching sale details: ${params.id}`);
  }

  return (
    <section className="flex w-full flex-col gap-sm">
      <MealResume
        isOrderPage={true}
        title={`Achat du ${moment(order.create_time).format('DD/MM/YYYY à HH:mm')}`}
        meal={order.meal}
      />
      <OrderDetails token={session.accessToken} order={order} isSales={false} />
    </section>
  );
}
