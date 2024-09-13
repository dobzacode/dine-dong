'use client';

import { Elements } from '@stripe/react-stripe-js';
import { BaseStripeElementsOptions, loadStripe } from '@stripe/stripe-js';
import { useQuery } from '@tanstack/react-query';
import { FaSpinner } from 'react-icons/fa';
import CheckoutForm from './checkout-form';

interface CheckoutProps {
  amount: number;
  currency?: string;
  description?: string;
  userId?: string;
}

const appearance: BaseStripeElementsOptions['appearance'] = {
  theme: 'flat',
  rules: {
    '.Input': {
      borderBottom: '1px solid #fbe1b7',
      height: '40px',
      padding: '8px 12px',
      margin: '6px 0',
      fontWeight: '300'
    },
    '.Input:focus': {
      borderBottom: '1px solid #f2a426',
      outline: '0px',
      ring: '0px',
      boxShadow: '0px'
    },
    '.Input--invalid': {
      borderBottom: '1px solid #f91f3c',
      outline: '0px',
      ring: '0px',
      boxShadow: '0px'
    },
    '.Dropdown': {
      border: '10px solid #fbe1b7',
      padding: '8px 12px',
      margin: '0 -12px',
      borderRadius: '4px',
      backgroundColor: 'black'
    },
    '.Label': {
      fontSize: '14px',
      fontWeight: '500'
    },
    '.Error': {
      fontSize: '14px'
    }
  },
  variables: {
    colorPrimary: '#f2a426',
    colorBackground: 'hsl(37 20% 98%)',
    colorText: '#000000',
    colorDanger: '#f91f3c',
    spacingUnit: '2px',
    borderRadius: '0px',
    tabLogoSelectedColor: '#ffffff',
    iconLoadingIndicatorColor: '#ffffff',
    iconMenuHoverColor: '#ffffff',
    fontFamily: 'Poppins',
    gridRowSpacing: '16px',
    gridColumnSpacing: '16px'
  }
};

const initStripe = async () => {
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
};

const fetchClientSecret = async ({
  amount,
  currency = 'eur',
  description,
  userId
}: CheckoutProps) => {
  const response = await fetch('http://localhost:3000/api/protected/stripe/payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: amount + parseInt(process.env.NEXT_PUBLIC_MEAL_FEE!),
      currency,
      description,
      userId
    })
  });
  const data = (await response.json()) as { clientSecret: string };
  console.log(data);
  if (!response.ok) throw new Error('Une erreur est survenue');
  return data.clientSecret;
};

const Checkout = ({ amount, currency = 'eur', description, userId }: CheckoutProps) => {
  const stripePromise = initStripe();

  const {
    data: clientSecret,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['clientSecret'],
    queryFn: () => fetchClientSecret({ amount, currency, description, userId }),
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 0
  });

  if (isLoading) return <FaSpinner className="animate-spin" />;

  if (isError)
    return <div className="text-danger mt-2">Failed to initialize payment. Please try again.</div>;

  return (
    <Elements
      stripe={stripePromise}
      options={{
        locale: 'fr-FR',
        clientSecret,
        appearance,
        loader: 'never',
        fonts: [
          {
            cssSrc:
              'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap',
            family: 'Poppins'
          }
        ]
      }}
    >
      <CheckoutForm
        mealSummaryDetails={{
          price: amount
        }}
      />
    </Elements>
  );
};

export default Checkout;
