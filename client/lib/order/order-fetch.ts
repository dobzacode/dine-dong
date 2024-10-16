import { OrderWithMealResponse } from '@/types/query';
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
