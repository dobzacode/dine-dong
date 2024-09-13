import { CreatePaymentIntent } from '@/lib/stripe/stripe-fetch';
import { getErrorMessage } from '@/lib/utils';
import InitStripe from './init-stripe';

interface CheckoutProps {
  amount: number;
  currency?: string;
  description: string;
  userId: string;
  mealId: string;
  isNewPaymentIntent: boolean;
}

const Checkout = async ({
  amount,
  currency = 'eur',
  description,
  userId,
  mealId,
  isNewPaymentIntent
}: CheckoutProps) => {
  let data: { clientSecret: string; id: string };

  try {
    data = await CreatePaymentIntent({
      amount,
      currency,
      description,
      userId,
      mealId,
      isNewPaymentIntent
    });
  } catch (error) {
    const message = getErrorMessage(error);
    if (message.includes('403')) {
      console.log(error);
      return (
        <div className="text-danger mt-2">
          Vous n&apos;êtes pas connecté. Veuillez vous connecter.
        </div>
      );
    }
    return (
      <div className="text-danger mt-2">
        Une erreur est survenue lors de la création du paiement. Veuillez réessayer.
      </div>
    );
  }

  return <InitStripe clientSecret={data.clientSecret} price={amount} />;
};

export default Checkout;
