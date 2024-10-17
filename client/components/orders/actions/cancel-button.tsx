'use client';

import { modifyOrderMutation } from '@/lib/order/order-fetch';
import { cn } from '@/lib/utils';
import { type ModifyOrderStatusResponse, type OrderWithMealResponse } from '@/types/query';
import { useMutation } from '@tanstack/react-query';
import { Loader2, X } from 'lucide-react';
import { useLogger } from 'next-axiom';
import { useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '../../ui/alert-dialog';
import { useToast } from '../../ui/use-toast';

export function CancelButton({
  order,
  token,
  dialogDescription
}: {
  order: OrderWithMealResponse;
  token?: string;
  dialogDescription: string;
}) {
  const log = useLogger();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const { isPending, mutateAsync } = useMutation({
    mutationFn: modifyOrderMutation,
    onSuccess: (data: ModifyOrderStatusResponse) => {
      setOpen(false);
      console.log('Order cancelled successfully:', data);
      log.info('Order cancelled successfully:', { order: data });
      toast({
        title: 'La commande a été annulée avec succès !',
        className: ' bottom-0 right-0 w-fit ml-auto',
        duration: 5000
      });
    },
    onError: (error: unknown) => {
      setOpen(false);
      console.error('Error cancelling order:', error);
      error instanceof Error && log.error('Error cancelling order', { error, order });
      toast({
        title: "Une erreur est survenue lors de l'annulation de la commande",
        description: 'Veuillez réessayer ultérieurement',
        duration: 5000
      });
    }
  });

  useEffect(() => {
    if (!token) {
      log.error('Token is missing for cancellation', {
        order
      });
    }
  }, [token, log, order]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <button
          disabled={isPending || !token}
          className={cn('body-sm flex items-center gap-xs duration-fast hover:opacity-70')}
        >
          <X className="h-4 w-4 shrink-0 text-error" />
          Annuler la commande
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent
        onEscapeKeyDown={(e: KeyboardEvent) => {
          isPending && e.preventDefault();
        }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="heading-h3 text-start">Êtes-vous sûrs ?</AlertDialogTitle>
          <AlertDialogDescription className="body text-pretty text-start text-black">
            {dialogDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col gap-sm mobile-lg:flex-row">
          <AlertDialogCancel className="mt-0 rounded-sm mobile-lg:w-1/2">
            Revenir à la commande
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending || !token}
            className="gap-xs rounded-sm bg-error text-error-1 hover:bg-error-300 mobile-lg:w-1/2"
            onClick={async (e) => {
              e.preventDefault();
              await mutateAsync({ status: 'CANCELLED', token, orderId: order.order_id });
            }}
          >
            {isPending && <Loader2 className="h-4 w-4 shrink-0 animate-spin" />}
            Confirmer l&apos;annulation
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
