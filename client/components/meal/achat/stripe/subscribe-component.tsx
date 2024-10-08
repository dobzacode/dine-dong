'use client';
import { getBasePath } from '@/lib/utils';
import { loadStripe } from '@stripe/stripe-js';

type props = {
  amount: number;
  currency: string;
  description: string;
  userSub: string;
};
const SubscribeComponent = ({ amount, currency, description, userSub }: props) => {
  const handleSubmit = async () => {
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
    if (!stripe) {
      return;
    }
    try {
      const response = await fetch(`${getBasePath()}/api/protected/orders/checkout`, {
        method: 'POST',
        body: JSON.stringify({
          amount,
          currency,
          description,
          userSub
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = (await response.json()) as { status: 'success' | 'error'; session_id: string };
      if (!response.ok) throw new Error('Une erreur est survenue');
      await stripe.redirectToCheckout({
        sessionId: data.session_id
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      Click Below button to get {description}
      <button onClick={handleSubmit}>Upgrade in {amount}</button>
    </div>
  );
};
export default SubscribeComponent;
