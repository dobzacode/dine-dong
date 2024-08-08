import { getAccessToken } from '@auth0/nextjs-auth0';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function fetchPrivate(url: string) {
  const token = await getAccessToken();
  return fetch(url, {
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${token?.accessToken}`,
      'Content-Type': 'application/json'
    }
  });
}
