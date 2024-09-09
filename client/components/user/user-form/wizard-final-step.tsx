'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useFormContext } from 'react-hook-form';
import { type UserSchema } from './user-schema';

export default function WizardFinalStep({ className }: { className?: string }) {
  const { getValues } = useFormContext<UserSchema>();

  const { username, email, firstName, lastName, phoneNumber, image } = getValues('stepOne');

  return (
    <section className={cn('flex flex-col gap-md', className)}>
      <div className="flex w-full justify-center gap-md">
        <div className="flex h-fit w-1/2 shrink-0 grow flex-col gap-md rounded-xs border bg-background p-md text-primary-container-fg">
          <div className="flex flex-col gap-xs">
            <p className="body-sm font-medium text-primary-900/70">Nom d&apos;utilisateur</p>
            <p className="body-sm">{username}</p>
          </div>
          <div className="flex flex-col gap-xs">
            <p className="body-sm font-medium text-primary-900/70">Adresse email</p>
            <p className="body-sm">{email}</p>
          </div>
          <div className="flex flex-col gap-xs">
            <p className="body-sm font-medium text-primary-900/70">Prénom</p>
            <p className="body-sm">{firstName ? firstName : 'Non renseigné'}</p>
          </div>
          <div className="flex flex-col gap-xs">
            <p className="body-sm font-medium text-primary-900/70">Nom de famille</p>
            <p className="body-sm">{lastName ? lastName : 'Non renseigné'}</p>
          </div>
          <div className="flex flex-col gap-xs">
            <p className="body-sm font-medium text-primary-900/70">Téléphone</p>
            <p className="body-sm">{phoneNumber ? phoneNumber : 'Non renseigné'}</p>
          </div>
        </div>

        <div className="relative aspect-square w-1/2 overflow-hidden rounded-xs">
          <Image
            className="grow-0 rounded-xs object-cover"
            sizes={`(max-width: 768px) 100vw, 800px`}
            src={image ? URL.createObjectURL(image) : '/placeholder.jpg'}
            alt="photo"
            fill
          />
        </div>
      </div>
      <div className="flex flex-col gap-xs border bg-background p-md">
        <p className="body-sm font-medium text-primary-900/70">Adresse de résidence</p>
        <p className="body-sm">{getValues('stepTwo.address.formattedAddress')}</p>
      </div>
    </section>
  );
}