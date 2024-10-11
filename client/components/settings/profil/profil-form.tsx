'use client';

import { cn, constructS3Url, getBasePath } from '@/lib/utils';
import type { UserResponse } from '@/types/query';

import AddressAutoComplete from '@/components/ui/address-autocomplete';
import { FormMessages } from '@/components/ui/address-autocomplete/form-messages';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { customRevalidateTag } from '@/lib/actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Settings } from 'lucide-react';
import { useLogger } from 'next-axiom';
import { useS3Upload } from 'next-s3-upload';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FormProvider, useForm, useFormState } from 'react-hook-form';
import { profileSchema, type ProfileSchema } from './profil-schema';

const modifyProfileMutation = async ({
  data,
  uploadToS3,
  user_sub,
  sub
}: {
  data: ProfileSchema;
  uploadToS3: (
    file: File,
    options: {
      endpoint: {
        request: { url: string; headers?: Record<string, string>; body?: Record<string, string> };
      };
    }
  ) => Promise<{
    url: string;
    key: string;
  }>;
  user_sub: string;
  sub: string;
}) => {
  let picturekey: string | null = null;

  if (data.image && data.image instanceof File) {
    const { key } = await uploadToS3(data.image, {
      endpoint: {
        request: {
          url: `${getBasePath()}/api/s3-upload/?folder=dynamic/${sub}/user`
        }
      }
    });
    picturekey = key;
  }

  const response = await fetch(`${getBasePath()}/api/protected/users`, {
    method: 'PUT',
    body: JSON.stringify({
      user_sub: user_sub,
      first_name: data.firstName,
      last_name: data.lastName,
      about_me: data.aboutMe,
      picture_key: picturekey ?? `/static/default-avatar.png`,
      residency: {
        ...data.stepTwo.address,
        formatted_address: data.stepTwo.address.formattedAddress,
        postal_code: data.stepTwo.address.postalCode
      }
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

export default function ProfilForm({ user, sub }: { user: UserResponse; sub: string }) {
  const log = useLogger();

  const { last_name, first_name, picture_key, residency, about_me, user_sub } = user;

  const { toast } = useToast();
  const { uploadToS3 } = useS3Upload();
  const { isPending, mutateAsync } = useMutation({
    mutationFn: modifyProfileMutation,
    onSuccess: (data: string) => {
      customRevalidateTag(`user-informations-${sub}`);
      console.log('Profile modified successfully:', data);
      log.info('Profile modified successfully:', { last_name, first_name });
      toast({
        title: `Votre profile a été modifié avec succès !`,
        description: 'Vous pouvez le consulter dans votre tableau de bord',
        className: 'bottom-0 right-0 w-fit ml-auto',
        duration: 5000
      });
    },
    onError: (error: unknown) => {
      console.error('Error modifying profile:', error);
      log.error('Error modifying profile:', { error, last_name, first_name });
      toast({
        title: 'Une erreur est survenue lors de la modification de votre compte',
        description: 'Veuillez réessayer ultérieurement',
        duration: 5000
      });
    }
  });

  const form = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: first_name ?? '',
      lastName: last_name ?? '',
      aboutMe: about_me ?? '',
      image: picture_key ?? undefined,
      stepTwo: {
        address: {
          address1: residency?.address1 ?? '',
          address2: residency?.address2 ?? '',
          formattedAddress: residency?.formatted_address ?? '',
          city: residency?.city ?? '',
          department: residency?.department ?? '',
          postalCode: residency?.postal_code ?? '',
          country: residency?.country ?? '',
          lat: residency?.lat ?? 0,
          lng: residency?.lng ?? 0
        }
      }
    }
  });

  const { isDirty } = useFormState({ control: form.control });

  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(
    constructS3Url(picture_key ?? '/static/default-avatar.png')
  );

  //eslint-disable-line @typescript-eslint/no-unused-vars
  const [_, setMapCoord] = useState<{ lat: number; lng: number }>({
    lat: residency?.lat ?? 45.767572,
    lng: residency?.lng ?? 4.833102
  });

  const [searchInput, setSearchInput] = useState('');
  const [addressMessage, setAddressMessage] = useState('');

  const formattedAddress = form.getValues('stepTwo.address.formattedAddress');

  useEffect(() => {
    console.log(searchInput, 'searchInput', formattedAddress, 'formattedAddress');
    if (searchInput && !formattedAddress) {
      return setAddressMessage('');
    }
  }, [searchInput, formattedAddress, setAddressMessage]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (!e.target) {
          return null;
        }
        setImagePreview(e.target?.result);
        form.setValue('image', file);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <FormProvider {...form}>
      <form
        className={cn(
          'laptop-sm:section-px container mx-auto flex flex-col gap-md laptop-sm:max-w-[800px]',
          isPending && 'pointer-events-none animate-pulse'
        )}
      >
        <fieldset className="card flex w-full flex-col justify-between gap-lg p-lg">
          <div className="flex w-full gap-lg">
            <div className="flex w-full flex-col gap-lg">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Prénom</FormLabel>
                    <FormControl>
                      <Input
                        className="rounded-none border-x-0 border-t-0 px-1 ring-0 focus-visible:border-primary-400 focus-visible:ring-0"
                        placeholder="Jean"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col">
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input
                        className="rounded-none border-x-0 border-t-0 px-1 ring-0 focus-visible:border-primary-400 focus-visible:ring-0"
                        placeholder="Dupont"
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
              name="image"
              render={() => (
                <FormItem className="flex h-full w-fit shrink-0 flex-col">
                  <FormLabel className="w-fit">Photo de profil</FormLabel>

                  <div className="relative aspect-square h-full w-5xl rounded-xs">
                    <Image
                      alt="Photo de profil"
                      fill
                      sizes={'10vw'}
                      src={imagePreview as string}
                      className="rounded-xs object-cover"
                      priority
                    />
                    <div className="absolute right-0 top-0 z-20">
                      <Input
                        placeholder="Choisir une photo"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="file-input"
                      />
                      <label htmlFor="file-input" className="shrink-0 cursor-pointer">
                        <Settings
                          className="body-sm flex h-8 w-8 shrink-0 rounded-xs rounded-br-none rounded-tl-none rounded-tr-none border border-input bg-background p-1.5 hover:opacity-90"
                          size={16}
                        />
                      </label>
                    </div>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="aboutMe"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="">A propos de moi</FormLabel>
                <FormControl>
                  <Textarea
                    rows={5}
                    className="rounded-none border-x-0 border-t-0 px-1 ring-0 focus-visible:border-primary-400 focus-visible:ring-0"
                    placeholder="Présente-toi aux autres utilisateurs"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>
        <fieldset className="card flex w-full shrink-0 flex-col justify-between gap-lg p-lg">
          <FormField
            control={form.control}
            name="stepTwo.address"
            render={() => (
              <AddressAutoComplete
                className="rounded-none border-x-0 border-t-0 px-1 ring-0 focus-visible:border-primary-400 focus-visible:ring-0"
                placeholder="Ajouter une adresse"
                formName="user"
                label={'Lieu de résidence'}
                //@ts-expect-error - type is valid<
                form={form}
                setMapCoord={setMapCoord}
                searchInput={searchInput}
                setSearchInput={setSearchInput}
                dialogTitle="Ajouter l'adresse"
              />
            )}
          />
          {addressMessage && (
            <FormMessages type="error" className="-mt-2" messages={[addressMessage]} />
          )}
        </fieldset>
        <Button
          className={cn('flex', isPending && 'pointer-events-none')}
          type="button"
          onClick={async () => {
            const isValid = await form.trigger('stepTwo.address');
            if (!isValid) {
              return setAddressMessage('Une adresse est requise');
            }
            await mutateAsync({ data: form.getValues(), uploadToS3, user_sub, sub });
          }}
          disabled={!isDirty}
        >
          Enregistrer les modifications
        </Button>
      </form>
    </FormProvider>
  );
}
