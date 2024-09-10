'use client';

import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PhoneInput } from '@/components/ui/phone-input';
import { useToast } from '@/components/ui/use-toast';
import { customRevalidateTag } from '@/lib/actions';
import { cn } from '@/lib/utils';
import type { UserResponse } from '@/types/query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { FormProvider, useForm, useFormState } from 'react-hook-form';
import fr from 'react-phone-number-input/locale/fr';
import { AccountSchema, createAccountSchema } from './account-schema';

const modifyProfileMutation = async ({
  data,
  user_id
}: {
  data: AccountSchema;
  user_id: string;
}) => {
  const response = await fetch('http://localhost:3000/api/protected/users', {
    method: 'PUT',
    body: JSON.stringify({
      user_id: user_id,
      email: data.email,
      username: data.username,
      phone_number: data.phoneNumber
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    const error = (await response.json()) as { detail: string };
    console.log(error);
    throw new Error(error.detail);
  }
  const dataResponse = (await response.json()) as string;

  return dataResponse;
};

export default function AccountForm({ user, sub }: { user: UserResponse; sub: string }) {
  const { username, email, phone_number, user_id } = user;

  const { toast } = useToast();
  const [oldValues, setOldValues] = useState({ email, username });

  const { isPending, mutateAsync } = useMutation({
    mutationFn: modifyProfileMutation,
    onSuccess: (data: string) => {
      console.log('User modified successfully:', data);
      customRevalidateTag(`user-informations-${sub}`);
      toast({
        title: `Votre profile a été modifié avec succès !`,
        description: 'Vous pouvez le consulter dans votre tableau de bord',
        className: 'bottom-0 right-0 w-fit ml-auto',
        duration: 5000
      });
    },
    onError: (error: unknown) => {
      console.error('Error creating user:', error);
      toast({
        title: 'Une erreur est survenue lors de la modification de votre compte',
        description: 'Veuillez réessayer ultérieurement',
        duration: 5000
      });
    }
  });

  const form = useForm<AccountSchema>({
    resolver: zodResolver(createAccountSchema(oldValues)),
    defaultValues: {
      email: email,
      username: username,
      phoneNumber: phone_number ?? ''
    }
  });

  const onSubmit = async (data: AccountSchema) => {
    await mutateAsync({ data, user_id });
    setOldValues({ email: data.email, username: data.username });
  };

  const { isDirty } = useFormState({ control: form.control });
  const { handleSubmit } = form;

  return (
    <FormProvider {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={cn(
          'laptop-sm:section-px container mx-auto flex flex-col gap-md laptop-sm:max-w-[800px]',
          isPending && 'pointer-events-none animate-pulse'
        )}
      >
        <fieldset className="flex w-full flex-col justify-between gap-lg rounded-xs border border-input bg-background p-lg">
          <div className="flex gap-md max-tablet:flex-wrap max-tablet:gap-lg">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="flex w-1/2 flex-col max-tablet:w-full">
                  <FormLabel>Nom d&apos;utilisateur *</FormLabel>
                  <FormControl>
                    <Input
                      className="rounded-none border-x-0 border-t-0 px-1 ring-0 focus-visible:border-primary-400 focus-visible:ring-0"
                      required
                      placeholder="Jean-Dupont"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex w-1/2 flex-col max-tablet:w-full">
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input
                      className="rounded-none border-x-0 border-t-0 px-1 ring-0 focus-visible:border-primary-400 focus-visible:ring-0"
                      required
                      type="email"
                      placeholder="Jeandupont@exemple.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col max-mobile:w-full">
                <FormLabel>Numéro de téléphone</FormLabel>
                <FormControl>
                  <PhoneInput isBordered placeholder="+33 6 01 23 45 67" labels={fr} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>

        <Button
          type="submit"
          className={cn('flex', isPending && 'pointer-events-none')}
          disabled={!isDirty}
        >
          Enregistrer les modifications
        </Button>
      </form>
    </FormProvider>
  );
}