'use client';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { PhoneInput } from '@/components/ui/phone-input';
import { Textarea } from '@/components/ui/textarea';
import fr from 'react-phone-number-input/locale/fr';
import ImageUploader from '../../ui/image-uploader';
import type { UserSchema } from './user-schema';

export default function WizardStepOne({ className }: { className?: string }) {
  const form = useFormContext<UserSchema>();

  return (
    <>
      <fieldset className={cn('flex flex-col gap-md text-primary-container-fg', className)}>
        <fieldset className="flex w-full gap-md max-mobile-sm:flex-col">
          <FormField
            control={form.control}
            name="stepOne.username"
            render={({ field }) => (
              <FormItem className="flex w-1/2 flex-col max-mobile-sm:w-full">
                <FormLabel>Nom d&apos;utilisateur *</FormLabel>
                <FormControl>
                  <Input required placeholder="Jean-Dupont" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stepOne.email"
            render={({ field }) => (
              <FormItem className="flex w-1/2 flex-col max-mobile-sm:w-full">
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input required type="email" placeholder="Jeandupont@exemple.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>
        <fieldset className="flex w-full justify-between gap-md max-mobile-sm:flex-col">
          <FormField
            control={form.control}
            name="stepOne.firstName"
            render={({ field }) => (
              <FormItem className="flex w-1/2 flex-col max-mobile-sm:w-full">
                <FormLabel>Prénom</FormLabel>
                <FormControl>
                  <Input required placeholder="Jean" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stepOne.lastName"
            render={({ field }) => (
              <FormItem className="flex w-1/2 flex-col max-mobile-sm:w-full">
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input required placeholder="Dupont" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>
        <FormField
          control={form.control}
          name="stepOne.aboutMe"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel>A propos de moi</FormLabel>
              <FormControl>
                <Textarea rows={5} placeholder="Présente-toi aux autres utilisateurs" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <fieldset className="flex w-full justify-between gap-md max-mobile:flex-col-reverse">
          <FormField
            control={form.control}
            name="stepOne.image"
            render={() => (
              <ImageUploader
                label={'Photo'}
                className="flex w-1/2 flex-col items-start justify-start max-mobile:w-full"
                //@ts-expect-error - type is valid
                form={form}
              />
            )}
          />
          <FormField
            control={form.control}
            name="stepOne.phoneNumber"
            render={({ field }) => (
              <FormItem className="flex w-1/2 flex-col max-mobile:w-full">
                <FormLabel>Numéro de téléphone</FormLabel>
                <FormControl>
                  <PhoneInput placeholder="+33 6 01 23 45 67" labels={fr} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>
      </fieldset>
    </>
  );
}
