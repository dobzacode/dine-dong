'use client';

import { UserResponse } from '@/types/query';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, type BaseStripeElementsOptions } from '@stripe/stripe-js';
import CheckoutForm from './checkout-form';

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

const InitStripe = ({
  price,
  clientSecret,
  user
}: {
  price: number;
  clientSecret: string;
  user: UserResponse;
}) => {
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

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
        user={user}
        mealSummaryDetails={{
          price
        }}
      />
    </Elements>
  );
};

export default InitStripe;
