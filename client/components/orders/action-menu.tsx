'use client';

import { customRevalidateTag } from '@/lib/actions';
import { getBasePath } from '@/lib/utils';
import { ModifyOrderStatusResponse, OrderWithMealResponse } from '@/types/query';
import { useMutation } from '@tanstack/react-query';
import { Check, CircleX } from 'lucide-react';
import { useLogger } from 'next-axiom';
import { useEffect } from 'react';
import { useToast } from '../ui/use-toast';

const createOrderMutation = async ({
  status,
  token,
  orderId
}: {
  status: 'FINALIZED' | 'IN_PROGRESS' | 'CANCELLED';
  token?: string;
  orderId: string;
}) => {
  if (!token) {
    throw new Error('Token is required');
  }

  const response = await fetch(
    `${getBasePath()}/api/orders/${orderId}/status?new_status=${status}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    }
  );
  if (!response.ok) {
    const error = (await response.json()) as { detail: string };
    console.log(error);
    throw new Error(error.detail);
  }
  const dataResponse = (await response.json()) as ModifyOrderStatusResponse;
  customRevalidateTag([
    'search-meals',
    `meal-details-${dataResponse.meal_id}`,
    `user-${dataResponse.owner_sub}-meals`,
    `user-${dataResponse.owner_sub}-sales`,
    `user-${dataResponse.user_sub}-purchases`
  ]);
  return dataResponse;
};

export default function ActionMenu({
  order,
  token
}: {
  order: OrderWithMealResponse;
  token?: string;
}) {
  const log = useLogger();
  const { toast } = useToast();
  const { isPending, mutateAsync } = useMutation({
    mutationFn: createOrderMutation,
    onSuccess: (data: ModifyOrderStatusResponse) => {
      console.log('Order updated successfully:', data);
      log.info('Order updated successfully:', { order: data });
      toast({
        title: `La commande a été modifiée avec succès !`,
        className: ' bottom-0 right-0 w-fit ml-auto',
        duration: 5000
      });
    },
    onError: (error: unknown) => {
      console.error('Error modifying order:', error);
      error instanceof Error && log.error('Error modifying order', { error, order });
      toast({
        title: 'Une erreur est survenue lors de la modification de la commande',
        description: 'Veuillez réessayer ultérieurement',
        duration: 5000
      });
    }
  });

  useEffect(() => {
    if (!token) {
      log.error('Token is missing', {
        order
      });
    }
  });

  return (
    <div className="my-auto flex flex-col items-center gap-sm">
      <button
        disabled={isPending || !token}
        onClick={async () =>
          await mutateAsync({ status: 'FINALIZED', token, orderId: order.order_id })
        }
        className="body-sm flex items-center gap-xs text-green-500 duration-fast hover:opacity-70"
      >
        <Check className="h-4 w-4 shrink-0" />
        Finaliser
      </button>
      <button
        onClick={async () =>
          await mutateAsync({ status: 'CANCELLED', token, orderId: order.order_id })
        }
        disabled={isPending || !token}
        className="body-sm flex items-center gap-xs text-destructive duration-fast hover:opacity-70"
      >
        <CircleX className="h-4 w-4 shrink-0" />
        Annuler
      </button>
    </div>
  );
}
