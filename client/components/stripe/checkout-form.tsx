'use client';

import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { ShieldCheck } from 'lucide-react';
import React from 'react';
import { Button } from '../ui/button';

const CheckoutForm = ({
  mealSummaryDetails
}: {
  mealSummaryDetails: {
    price: number;
  };
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: 'http://localhost:3000'
      }
    });

    if (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
      <fieldset className="flex w-full flex-col justify-between gap-lg rounded-xs border border-input bg-background p-lg">
        <PaymentElement />
      </fieldset>
      <div className="flex w-full flex-col justify-between gap-lg rounded-xs border border-input bg-background p-lg">
        <div className="flex flex-col gap-lg">
          <h2 className="body-sm text-grayed">Résumé de la commande</h2>
          <div className="flex flex-col gap-xs">
            <span className="flex items-center justify-between">
              <p className="body">Prix de la commande</p>
              <p className="body">{mealSummaryDetails.price} €</p>
            </span>
            <span className="flex items-center justify-between">
              <p className="body">Frais</p>
              <p className="body">{process.env.NEXT_PUBLIC_MEAL_FEE} €</p>
            </span>
          </div>
          <span className="flex items-center justify-between">
            <p className="body">Total</p>
            <p className="body">
              {mealSummaryDetails.price + parseInt(process.env.NEXT_PUBLIC_MEAL_FEE!)} €
            </p>
          </span>
        </div>

        <Button disabled={!stripe}>Payer</Button>
        <p className="body-sm text-grayed flex items-center justify-center gap-xs whitespace-nowrap">
          <ShieldCheck className="fill-primary-900/[.40] text-white" />
          Ce paiement est crypté et sécurisé
        </p>
      </div>
    </form>
  );
};

export default CheckoutForm;
