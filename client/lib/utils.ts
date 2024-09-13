import { MealDetailsResponse, MealResponse, MealsResponse, UserResponse } from '@/types/query';
import { DietsEnum } from '@/types/schema';
import { getAccessToken } from '@auth0/nextjs-auth0';
import { clsx, type ClassValue } from 'clsx';
import { Children, isValidElement } from 'react';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetcher = (url: string) => fetch(url).then((r) => r.json());

export const getFileExtension = (filename: string) => {
  const index = filename.lastIndexOf('.');
  if (index === -1) {
    return '';
  }
  return filename.substring(index);
};

export const constructS3Url = (key: string) =>
  `${process.env.NEXT_PUBLIC_CLOUDFRONT_BUCKET_URL}/${key}`;

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

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
  user_id?: string;
}

export async function getMeals(
  params: getMealsParams,
  request: RequestInit = {}
): Promise<MealsResponse | Error> {
  const url = new URL('http://localhost:3000/api/meals');

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

  const response = await fetch(url.toString(), request);

  switch (response.status) {
    case 200:
      return (await response.json()) as MealsResponse;
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
  const url = new URL('http://localhost:3000/api/meals/summaries');
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

export async function getUserInformations(
  params: { id?: string; sub?: string; username?: string },
  request: RequestInit = {}
) {
  const url = new URL('http://localhost:3000/api/users');

  for (const [key, value] of Object.entries(params)) {
    if ((value !== undefined && typeof value === 'number') || typeof value === 'string') {
      url.searchParams.set(key, value.toString());
    }
  }

  const response = await fetch(url.toString(), request);

  switch (response.status) {
    case 200:
      return (await response.json()) as UserResponse;
    case 404:
      throw new Error('404 Aucun utilisateur trouvé');
    case 422:
      throw new Error('422 Une erreur est survenue');
    case 500:
      throw new Error('500 Erreur serveur');
    default:
      throw new Error('Erreur inconnue');
  }
}

export async function checkUsernameAvailability(username: string) {
  const url = new URL('http://localhost:3000/api/users/check-username-availability');
  url.searchParams.set('username', username);

  const response = await fetch(url.toString(), {
    cache: 'no-cache'
  });

  switch (response.status) {
    case 200:
      return (await response.json()) as boolean;
    case 404:
      throw new Error('404 Aucun utilisateur trouvé');
    case 422:
      throw new Error('422 Une erreur est survenue');
    case 500:
      throw new Error('500 Erreur serveur');
    default:
      throw new Error('Erreur inconnue');
  }
}

export async function checkEmailAvailability(email: string) {
  const url = new URL('http://localhost:3000/api/users/check-email-availability');
  url.searchParams.set('email', email);

  const response = await fetch(url.toString(), {
    cache: 'no-cache'
  });

  switch (response.status) {
    case 200:
      return (await response.json()) as boolean;
    case 404:
      throw new Error('404 Aucun utilisateur trouvé');
    case 422:
      throw new Error('422 Une erreur est survenue');
    case 500:
      throw new Error('500 Erreur serveur');
    default:
      throw new Error('Erreur inconnue');
  }
}

export async function getAuth0Information(token: string) {
  const response = await fetch('http://localhost:3000/api/users/get-auth0-information', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  console.log(response);

  switch (response.status) {
    case 200:
      return (await response.json()) as { email: string };
    case 404:
      throw new Error('404 Aucun utilisateur trouvé');
    case 422:
      throw new Error('422 Une erreur est survenue');
    case 500:
      throw new Error('500 Erreur serveur');
    default:
      throw new Error('Erreur inconnue');
  }
}

export async function isUserRegistered(token: string) {
  const response = await fetch('http://localhost:3000/api/users/is-user-registered', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  switch (response.status) {
    case 200:
      return (await response.json()) as boolean;
    case 404:
      throw new Error('404 Aucun utilisateur trouvé');
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
  const url = new URL('http://localhost:3000/api/meals/details');

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

export async function getUserMeals(sub: string, request: RequestInit = {}) {
  const url = new URL(`http://localhost:3000/api/users/${sub}/meals`);

  const response = await fetch(url.toString(), request);

  switch (response.status) {
    case 200:
      return (await response.json()) as MealResponse[];
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

export async function CreatePaymentIntent({
  amount,
  currency,
  description,
  userId,
  mealId,
  isNewPaymentIntent
}: {
  amount: number;
  currency?: string;
  description: string;
  userId: string;
  mealId: string;
  isNewPaymentIntent: boolean;
}) {
  const token = await getAccessToken();
  if (!token) {
    throw new Error("403 Vous n'êtes pas connecté");
  }

  const response = await fetch('http://localhost:3000/api/stripe/payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token.accessToken}` },
    body: JSON.stringify({
      amount: amount + parseInt(process.env.NEXT_PUBLIC_MEAL_FEE!),
      currency,
      description,
      userId,
      mealId: mealId,
      isNewPaymentIntent
    }),
    cache: 'no-cache'
  });

  switch (response.status) {
    case 200:
      const data = (await response.json()) as { clientSecret: string; id: string };

      return data;

    case 403:
      throw new Error("403 Vous n'êtes pas connecté");
    default:
      throw new Error('Erreur inconnue');
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
