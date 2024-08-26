import { MealWithAddressResponse } from '@/types/query';
import { DietsEnum } from '@/types/schema';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface getMealsParams {
  limit?: number;
  offset?: number;
  lat?: number;
  lng?: number;
  radius?: number;
  diet?: (keyof typeof DietsEnum)[];
  name?: string;
  weight_max?: number;
  weight_min?: number;
}

export async function getMeals(params: getMealsParams, nextParams: NextFetchRequestConfig) {
  const url = new URL('http://localhost:8080/api/meals');
  for (const [key, value] of Object.entries(params)) {
    if (key === 'diet' && Array.isArray(value)) {
      value.forEach((diet: keyof typeof DietsEnum) => {
        url.searchParams.set(key, diet);
      });
      break;
    }
    if ((value !== undefined && typeof value === 'number') || typeof value === 'string') {
      url.searchParams.set(key, value.toString());
    }
  }
  const response = await fetch(url.toString(), {
    next: nextParams
  });

  switch (response.status) {
    case 200:
      return (await response.json()) as MealWithAddressResponse[];
    case 404:
      return 404;
    case 500:
      return 500;
    default:
      return 500;
  }
}
