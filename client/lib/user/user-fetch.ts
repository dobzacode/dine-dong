import { type OrderWithMealResponse, type UserResponse } from '@/types/query';
import { getBasePath } from '../utils';

export async function getUserInformations(
  params: { sub?: string; username?: string },
  request: RequestInit = {}
) {
  const url = new URL(`${getBasePath()}/api/users`);

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
      return new Error('404 Aucun utilisateur trouvé');
    case 422:
      return new Error('422 Une erreur est survenue');
    case 500:
      return new Error('500 Erreur serveur');
    default:
      return new Error('Erreur inconnue');
  }
}

export async function checkUsernameAvailability(username: string) {
  const url = new URL(`${getBasePath()}/api/users/check-username-availability`);
  url.searchParams.set('username', username);

  const response = await fetch(url.toString(), {
    cache: 'no-cache'
  });

  switch (response.status) {
    case 200:
      return (await response.json()) as boolean;
    case 404:
      return new Error('404 Aucun utilisateur trouvé');
    case 422:
      return new Error('422 Une erreur est survenue');
    case 500:
      return new Error('500 Erreur serveur');
    default:
      return new Error('Erreur inconnue');
  }
}

export async function checkEmailAvailability(email: string) {
  const url = new URL(`${getBasePath()}/api/users/check-email-availability`);
  url.searchParams.set('email', email);

  const response = await fetch(url.toString(), {
    cache: 'no-cache'
  });

  switch (response.status) {
    case 200:
      return (await response.json()) as boolean;
    case 404:
      return new Error('404 Aucun utilisateur trouvé');
    case 422:
      return new Error('422 Une erreur est survenue');
    case 500:
      return new Error('500 Erreur serveur');
    default:
      return new Error('Erreur inconnue');
  }
}

export async function getAuth0Information(token: string) {
  const response = await fetch(`${getBasePath()}/api/users/get-auth0-information`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  switch (response.status) {
    case 200:
      return (await response.json()) as { email: string };
    case 404:
      return new Error('404 Aucun utilisateur trouvé');
    case 422:
      return new Error('422 Une erreur est survenue');
    case 500:
      return new Error('500 Erreur serveur');
    default:
      return new Error('Erreur inconnue');
  }
}

export async function isUserRegistered(token: string) {
  const response = await fetch(`${getBasePath()}/api/users/is-user-registered`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  switch (response.status) {
    case 200:
      return (await response.json()) as boolean;
    case 404:
      return new Error('404 Aucun utilisateur trouvé');
    case 422:
      return new Error('422 Une erreur est survenue');
    case 500:
      return new Error('500 Erreur serveur');
    default:
      return new Error('Erreur inconnue');
  }
}

export async function getUserPurchases(
  sub: string,
  request: RequestInit = {},
  params: {
    status?: 'FINALIZED' | 'IN_PROGRESS' | 'CANCELLED';
  } = {}
) {
  const url = new URL(`${getBasePath()}/api/users/${sub}/purchases`);
  if (params.status) {
    url.searchParams.set('status', params.status);
  }

  const response = await fetch(url.toString(), request);

  switch (response.status) {
    case 200:
      return (await response.json()) as OrderWithMealResponse[];
    case 404:
      return new Error('404 Aucun achat trouvé');
    case 422:
      return new Error('422 Une erreur est survenue');
    case 500:
      return new Error('500 Erreur serveur');
    default:
      return new Error('Erreur inconnue');
  }
}

export async function getUserSales(
  sub: string,
  request: RequestInit = {},
  params: {
    status?: 'FINALIZED' | 'IN_PROGRESS' | 'CANCELLED';
  } = {}
) {
  const url = new URL(`${getBasePath()}/api/users/${sub}/sales`);
  if (params.status) {
    url.searchParams.set('status', params.status);
  }

  const response = await fetch(url.toString(), request);

  switch (response.status) {
    case 200:
      return (await response.json()) as OrderWithMealResponse[];
    case 404:
      return new Error('404 Aucun achat trouvé');
    case 422:
      return new Error('422 Une erreur est survenue');
    case 500:
      return new Error('500 Erreur serveur');
    default:
      return new Error('Erreur inconnue');
  }
}

export async function getUsersParams() {
  const response = await fetch(`${getBasePath()}/api/users/get-user-params`, {
    cache: 'no-cache',
    next: {
      tags: ['get-user-params']
    }
  });

  return (await response.json()) as { username: string }[];
}
