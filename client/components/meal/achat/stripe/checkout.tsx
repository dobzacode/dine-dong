import { CreatePaymentIntent } from '@/lib/stripe/stripe-fetch';
import { getErrorMessage } from '@/lib/utils';
import { UserResponse } from '@/types/query';
import { Logger } from 'next-axiom';
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
  const log = new Logger();
  let data: { clientSecret: string; id: string };

  try {
    data = await CreatePaymentIntent({
      amount,
      currency,
      description,
      userSub: user.user_sub,
      mealId,
      isNewPaymentIntent
    });
  } catch (error) {
    const message = getErrorMessage(error);
    if (message.includes('403')) {
      log.error(`User not connected: ${message}`);
      await log.flush();
      return (
        <div className="text-danger mt-2">
          Vous n&apos;êtes pas connecté. Veuillez vous connecter.
        </div>
      );
    }
    error instanceof Error && log.error(`Error creating payment intent: ${message}`);
    await log.flush();
    return (
      <div className="text-danger mt-2">
        Une erreur est survenue lors de la création du paiement. Veuillez réessayer.
      </div>
    );
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
