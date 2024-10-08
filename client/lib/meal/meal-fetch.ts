import { type MealDetailsResponse, type MealsPaginatedResponse } from '@/types/query';
import { type DietsEnum } from '@/types/schema';
import { getBasePath } from '../utils';

export interface getMealsParams {
  limit?: number;
  offset?: unknown;
  lat?: number;
  lng?: number;
  radius?: number;
  diet?: (keyof typeof DietsEnum)[];
  name?: string;
  max_price?: number;
  weight_max?: number;
  weight_min?: number;
  sort?: 'distance' | 'price';
  user_sub?: string;
  is_ordered?: boolean;
}

export async function getMeals(
  params: getMealsParams,
  request: RequestInit = {}
): Promise<MealsPaginatedResponse | Error> {
  const url = new URL(`${getBasePath()}/api/meals`);

  for (const [key, value] of Object.entries(params)) {
    if (key === 'diet' && Array.isArray(value)) {
      value.forEach((diet: keyof typeof DietsEnum) => {
        url.searchParams.append(key, diet);
      });
      continue;
    }
    if (
      (value !== undefined && typeof value === 'number') ||
      typeof value === 'string' ||
      typeof value === 'boolean'
    ) {
      url.searchParams.set(key, value.toString());
    }
  }

  const response = await fetch(url.toString(), request);

  switch (response.status) {
    case 200:
      return (await response.json()) as MealsPaginatedResponse;
    case 404:
      throw new Error('404 Aucun repas trouvé');
    case 422:
      throw new Error('422 Une erreur est survenue');
    case 500:
      throw new Error('500 Erreur serveur');
    default:
      throw new Error('Erreur inconnue');
  }
}

export async function getMealsSummaries<T>(params?: { id?: string }, request: RequestInit = {}) {
  const url = new URL(`${getBasePath()}/api/meals/summaries`);
  if (params?.id) {
    url.searchParams.set('id', params.id);
  }
  const response = await fetch(url, request);

  switch (response.status) {
    case 200:
      return (await response.json()) as T;
    case 404:
      throw new Error('404 Aucun repas trouvé');
    case 422:
      throw new Error('422 Une erreur est survenue');
    case 500:
      throw new Error('500 Erreur serveur');
    default:
      throw new Error('Erreur inconnue');
  }
}

export async function getMealDetails(
  params: { id: string; lat?: number; lng?: number },
  request: RequestInit = {}
) {
  const url = new URL(`${getBasePath()}/api/meals/details`);

  for (const [key, value] of Object.entries(params)) {
    if ((value !== undefined && typeof value === 'number') || typeof value === 'string') {
      url.searchParams.set(key, value.toString());
    }
  }

  const response = await fetch(url.toString(), request);

  switch (response.status) {
    case 200:
      return (await response.json()) as MealDetailsResponse;
    case 404:
      throw new Error('404 Aucun repas trouvé');
    case 422:
      throw new Error('422 Une erreur est survenue');
    case 500:
      throw new Error('500 Erreur serveur');
    default:
      throw new Error('Erreur inconnue');
  }
}
