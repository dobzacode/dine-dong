import { getOrderDetails, getOrdersSummaries } from '@/lib/order/order-fetch';
import { getErrorMessage, translateStatus } from '@/lib/utils';
import { OrderSummaryResponse } from '@/types/query';
import { getSession } from '@auth0/nextjs-auth0';
import { type Metadata } from 'next';
import { Logger } from 'next-axiom';
import { notFound, redirect } from 'next/navigation';

type Props = {
  params: { id: string };
};

export async function generateStaticParams() {
  const log = new Logger();
  const orders = await getOrdersSummaries<OrderSummaryResponse[]>();

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
    order = await getOrdersSummaries<OrderSummaryResponse>(params, {
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
    title: `Vente ${order.order_id} | ${translateStatus(order.status)}`
  } satisfies Metadata;
}

export default async function Home({ params }: Props) {
  const log = new Logger();

  const session = await getSession();

  if (!session?.user?.sub || !session?.accessToken) {
    redirect(`/`);
  }

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

  return <p>{order.meal.name}</p>;
}