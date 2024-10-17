'use client';

import { modifyOrderMutation } from '@/lib/order/order-fetch';
import { cn } from '@/lib/utils';
import { type ModifyOrderStatusResponse, type OrderWithMealResponse } from '@/types/query';
import { useMutation } from '@tanstack/react-query';
import { Check, Loader2 } from 'lucide-react';
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

export function ConfirmButton({ order, token }: { order: OrderWithMealResponse; token?: string }) {
  const log = useLogger();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const { isPending, mutateAsync } = useMutation({
    mutationFn: modifyOrderMutation,
    onSuccess: (data: ModifyOrderStatusResponse) => {
      setOpen(false);
      console.log('Order confirmed successfully:', data);
      log.info('Order confirmed successfully:', { order: data });
      toast({
        title: 'La commande a été confirmée avec succès !',
        className: ' bottom-0 right-0 w-fit ml-auto',
        duration: 5000
      });
    },
    onError: (error: unknown) => {
      setOpen(false);
      console.error('Error confirming order:', error);
      error instanceof Error && log.error('Error confirming order', { error, order });
      toast({
        title: 'Une erreur est survenue lors de la confirmation de la commande',
        description: 'Veuillez réessayer ultérieurement',
        duration: 5000
      });
    }
  });

  useEffect(() => {
    if (!token) {
      log.error('Token is missing for confirmation', {
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
          <Check className="h-4 w-4 shrink-0 text-green-500" />
          Confirmer la commande
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
            L&apos;autorisation de prélévement ayant déjà été effectuée sur le moyen de paiement de
            l&apos;acheteur. Vous pouvez vous attendre à voir le paiement apparaître sur votre
            relevé bancaire d&apos;ici deux jours.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col gap-sm mobile-lg:flex-row">
          <AlertDialogCancel disabled={isPending} className="mt-0 rounded-sm mobile-lg:w-1/2">
            Revenir à la commande
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending || !token}
            className="gap-xs rounded-sm mobile-lg:w-1/2"
            onClick={async (e) => {
              e.preventDefault();
              await mutateAsync({ status: 'FINALIZED', token, orderId: order.order_id });
            }}
          >
            {isPending && <Loader2 className="h-4 w-4 shrink-0 animate-spin" />}
            Finaliser la commande
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
