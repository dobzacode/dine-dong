import { type ModifyOrderStatusResponse, type OrderWithMealResponse } from '@/types/query';
import { type OrderStatusEnum } from '@/types/schema';
import { customRevalidateTag } from '../actions';
import { getBasePath } from '../utils';

export async function getOrdersSummaries<T>(params?: { id?: string }, request: RequestInit = {}) {
  const url = new URL(`${getBasePath()}/api/orders/summaries`);
  if (params?.id) {
    url.searchParams.set('id', params.id);
  }
  const response = await fetch(url, request);

  switch (response.status) {
    case 200:
      return (await response.json()) as T;
    case 404:
      throw new Error('404 Aucunes commandes trouvées');
    case 422:
      throw new Error('422 Une erreur est survenue');
    case 500:
      throw new Error('500 Erreur serveur');
    default:
      throw new Error('Erreur inconnue');
  }
}

export async function getOrderDetails(params: { orderId: string }, request: RequestInit = {}) {
  const url = new URL(`${getBasePath()}/api/orders/${params.orderId}`);
  const response = await fetch(url.toString(), request);

  switch (response.status) {
    case 200:
      return (await response.json()) as OrderWithMealResponse;
    case 404:
      throw new Error('404 Aucune commande trouvée');
    case 422:
      throw new Error('422 Une erreur est survenue');
    case 500:
      throw new Error('500 Erreur serveur');
    default:
      throw new Error('Erreur inconnue');
  }
}

export const modifyOrderMutation = async ({
  status,
  token,
  orderId
}: {
  status: keyof typeof OrderStatusEnum;
  token?: string;
  orderId: string;
}) => {
  if (!token) {
    throw new Error('Token is required');
  }

  const response = await fetch(
    `${getBasePath()}/api/orders/${orderId}/status?new_status=${status}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    }
  );
  if (!response.ok) {
    const error = (await response.json()) as { detail: string };
    console.log(error);
    throw new Error(error.detail);
  }
  const dataResponse = (await response.json()) as ModifyOrderStatusResponse;
  customRevalidateTag([
    'search-meals',
    `meal-details-${dataResponse.meal_id}`,
    `user-${dataResponse.owner_sub}-meals`,
    `user-${dataResponse.owner_sub}-sales`,
    `user-${dataResponse.user_sub}-purchases`,
    `order-details-${dataResponse.order_id}`
  ]);
  return dataResponse;
};
