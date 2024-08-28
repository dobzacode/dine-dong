import { MealWithAddressResponse } from '@/types/query';
import { DietsEnum } from '@/types/schema';
import { clsx, type ClassValue } from 'clsx';
import { Children, isValidElement } from 'react';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetcher = (url: string) => fetch(url).then((r) => r.json());

export interface getMealsParams {
  limit?: number;
  offset?: number;
  lat?: number;
  lng?: number;
  radius?: number;
  diet?: (keyof typeof DietsEnum)[];
  name?: string;
  price_max?: number;
  weight_max?: number;
  weight_min?: number;
}

export async function getMeals(
  params: getMealsParams,
  nextParams?: NextFetchRequestConfig
): Promise<MealWithAddressResponse[] | Error> {
  console.log(params);
  const url = new URL('http://localhost:8080/api/meals');

  for (const [key, value] of Object.entries(params)) {
    if (key === 'diet' && Array.isArray(value)) {
      value.forEach((diet: keyof typeof DietsEnum) => {
        url.searchParams.append(key, diet);
      });
      continue;
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
      throw new Error('Not found');
    case 422:
      throw new Error('Unprocessable Entity');
    case 500:
      throw new Error('Internal Server Error');
    default:
      throw new Error('Unknown error');
  }
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const getChildByDisplayName = (
  displayName: string,
  children: React.ReactNode
): React.ReactNode[] | null => {
  const child = Children.map(children, (child) => {
    //@ts-expect-error - type is valid
    if (isValidElement(child) && child.type.displayName === displayName) return child;
    return null;
  });
  if (!child) return null;
  return child;
};
