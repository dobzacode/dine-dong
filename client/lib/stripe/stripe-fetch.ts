import { getAccessToken } from '@auth0/nextjs-auth0';

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
