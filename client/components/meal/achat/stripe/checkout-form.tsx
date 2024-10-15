'use client';

import { customRevalidateTag } from '@/lib/actions';
import { getBasePath } from '@/lib/utils';
import { UserResponse } from '@/types/query';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { ShieldCheck } from 'lucide-react';
import { useLogger } from 'next-axiom';
import React from 'react';
import { Button } from '../../../ui/button';

const CheckoutForm = ({
  mealSummaryDetails,
  user
}: {
  mealSummaryDetails: {
    mealId: string;
    price: number;
    ownerSub: string;
  };
  user: UserResponse;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const log = useLogger();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: getBasePath(),
        receipt_email: user.email
      }
    });

    if (error) {
      return error instanceof Error && log.error(`Error confirming payment`, { error, user });
    }

    customRevalidateTag([
      'search-meals',
      `meal-details-${mealSummaryDetails.mealId}`,
      `user-${mealSummaryDetails.ownerSub}-meals`,
      `user-${mealSummaryDetails.ownerSub}-sales`,
      `user-${user.user_sub}-purchases`
    ]);

    return log.info('Payment confirmed', {
      info: {
        mealSummaryDetails,
        user
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-sm">
      <fieldset className="card flex w-full flex-col justify-between gap-lg p-lg">
        <PaymentElement />
      </fieldset>
      <section className="card flex w-full flex-col justify-between gap-lg p-lg">
        <div className="flex flex-col gap-lg">
          <h2 className="body text-grayed">Résumé de la commande</h2>
          <div className="flex flex-col gap-xs">
            <span className="flex items-center justify-between">
              <p className="body-sm font-medium">Prix de la commande</p>
              <p className="body">{mealSummaryDetails.price} €</p>
            </span>
            <span className="flex items-center justify-between">
              <p className="body-sm font-medium">Frais</p>
              <p className="body">2 €</p>
            </span>
          </div>
          <span className="flex items-center justify-between">
            <p className="body-sm font-medium">Total</p>
            <p className="body">{mealSummaryDetails.price + 2} €</p>
          </span>
        </div>

        <Button disabled={!stripe}>Payer</Button>
        <p className="body-sm text-grayed flex items-center justify-center gap-xs whitespace-nowrap">
          <ShieldCheck className="fill-primary-900/[.40] text-white" />
          Ce paiement est crypté et sécurisé
        </p>
      </section>
    </form>
  );
};

export default CheckoutForm;
