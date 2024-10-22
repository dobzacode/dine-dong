import { getAccessToken } from '@auth0/nextjs-auth0';
import { getBasePath } from '../utils';

export async function CreatePaymentIntent({
  amount,
  currency,
  description,
  userSub,
  mealId,
  isNewPaymentIntent
}: {
  amount: number;
  currency?: string;
  description: string;
  userSub: string;
  mealId: string;
  isNewPaymentIntent: boolean;
}): Promise<{ clientSecret: string; id: string } | Error> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error("403 Vous n'êtes pas connecté");
  }

  const response = await fetch(`${getBasePath()}/api/stripe/payment-intent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token.accessToken}` },
    body: JSON.stringify({
      amount: amount + 2,
      currency,
      description,
      userSub,
      mealId: mealId,
      isNewPaymentIntent
    }),
    cache: 'no-cache'
  });

  switch (response.status) {
    case 200:
      return (await response.json()) as { clientSecret: string; id: string };
    case 403:
      return new Error("403 Vous n'êtes pas connecté");
    default:
      return new Error('Erreur inconnue');
  }
}
