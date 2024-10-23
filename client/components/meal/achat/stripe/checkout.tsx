import { CreatePaymentIntent } from '@/lib/stripe/stripe-fetch';
import { getErrorMessage } from '@/lib/utils';
import { type UserResponse } from '@/types/query';
import InitStripe from './init-stripe';

interface CheckoutProps {
  amount: number;
  currency?: string;
  description: string;
  mealId: string;
  ownerSub: string;
  isNewPaymentIntent: boolean;
  user: UserResponse;
}

const Checkout = async ({
  amount,
  currency = 'eur',
  description,
  user,
  mealId,
  ownerSub,
  isNewPaymentIntent
}: CheckoutProps) => {
  const data: { clientSecret: string; id: string } | Error = await CreatePaymentIntent({
    amount,
    currency,
    description,
    userSub: user.user_sub,
    mealId,
    isNewPaymentIntent
  });

  console.log(data);

  if (data instanceof Error) {
    const message = getErrorMessage(data);
    if (message.includes('403')) {
      return (
        <p className="text-danger body mt-2">
          Une transaction est déjà en cours. Veuillez réessayer plus tard.
        </p>
      );
    }
    throw new Error(`Error creating payment intent: ${message}`);
  }

  return (
    <InitStripe
      ownerSub={ownerSub}
      mealId={mealId}
      user={user}
      clientSecret={data.clientSecret}
      price={amount}
    />
  );
};

export default Checkout;
