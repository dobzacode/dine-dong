import { getSession } from '@auth0/nextjs-auth0';
import { type CountryCode } from 'libphonenumber-js';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import 'server-only';

export async function getGeolocation() {
  const ipCountry = headers().get('x-vercel-ip-country') as CountryCode | null;

  return ipCountry;
}

interface NonNullSession {
  user: {
    sub: string;
  };
  idToken: string;
  accessToken: string;
  accessTokenScope: string;
  accessTokenExpiresAt: number;
  refreshToken: string;
  [key: string]: unknown;
}

export async function getSessionOrRedirect(path = '/') {
  const session = await getSession();

  if (!session?.user.sub || !session.accessToken || !session) {
    redirect(path);
  }

  return session as NonNullSession;
}
