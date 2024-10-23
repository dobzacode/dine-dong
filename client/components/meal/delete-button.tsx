'use client';

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
} from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { customRevalidateTag } from '@/lib/actions';
import { getBasePath } from '@/lib/utils';
import { MealResponse } from '@/types/query';
import { useMutation } from '@tanstack/react-query';
import { Loader2, Trash2 } from 'lucide-react';
import { useLogger } from 'next-axiom';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';

const deleteMealMutation = async ({ mealId, token }: { mealId: string; token: string }) => {
  const response = await fetch(`${getBasePath()}/api/meals/${mealId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error();
  }
  const dataResponse = (await response.json()) as MealResponse;
  customRevalidateTag([
    'search-meals',
    `user-${dataResponse.user_sub}-meals`,
    dataResponse.user_sub,
    `meal-details-${dataResponse.meal_id}`
  ]);
  return dataResponse;
};

export function DeleteButton({
  mealId,
  token,
  isOrdered
}: {
  mealId: string;
  token: string;
  isOrdered: boolean;
}) {
  const log = useLogger();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { isPending, mutateAsync } = useMutation({
    mutationFn: deleteMealMutation,
    onSuccess: (data: MealResponse) => {
      setOpen(false);
      console.log('Meal deleted successfully:', data);
      log.info('Meal deleted successfully:', { meal: data });
      toast({
        title: 'Le repas a été supprimé avec succès !',
        className: ' bottom-0 right-0 w-fit ml-auto',
        duration: 5000
      });
      router.push('/');
    },
    onError: (error: unknown) => {
      setOpen(false);
      console.error('Error deleting meal:', error);
      error instanceof Error && log.error('Error deleting meal', { error, mealId });
      toast({
        title: 'Une erreur est survenue lors de la suppression du repas',
        description: 'Veuillez réessayer ultérieurement',
        duration: 5000
      });
    }
  });

  useEffect(() => {
    if (!token) {
      log.error('Token is missing for cancellation', {
        mealId
      });
    }
  }, [token, log, mealId]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          disabled={isPending || !token || isOrdered}
          variant={'destructive'}
          className="gap-sm rounded-sm"
        >
          <Trash2 className="h-4 w-4 shrink-0 text-error-1" />
          Supprimer le repas
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent
        onEscapeKeyDown={(e: KeyboardEvent) => {
          isPending && e.preventDefault();
        }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="heading-h3 text-start">Êtes-vous sûrs ?</AlertDialogTitle>
          <AlertDialogDescription className="body text-pretty text-start text-black">
            La suppression du repas est définitive et ne peut pas être annulée.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col gap-sm mobile-lg:flex-row">
          <AlertDialogCancel className="mt-0 rounded-sm mobile-lg:w-1/2">
            Revenir au repas
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending || !token}
            className="gap-xs rounded-sm bg-error text-error-1 hover:bg-error-300 mobile-lg:w-1/2"
            onClick={async (e) => {
              e.preventDefault();
              await mutateAsync({ token, mealId });
            }}
          >
            {isPending && <Loader2 className="h-4 w-4 shrink-0 animate-spin" />}
            Confirmer la suppression
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
