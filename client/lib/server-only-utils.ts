import { type CountryCode } from 'libphonenumber-js';
import { headers } from 'next/headers';
import 'server-only';

export async function getGeolocation() {
  const ipCountry = headers().get('x-vercel-ip-country') as CountryCode | null;

  return ipCountry;
}
