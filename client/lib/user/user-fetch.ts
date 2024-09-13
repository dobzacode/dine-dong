import { type MealResponse, type UserResponse } from '@/types/query';

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
