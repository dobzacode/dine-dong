'use client';

import { cn, constructS3Url } from '@/lib/utils';
import Image from 'next/image';
import { useFormContext } from 'react-hook-form';
import { type UserSchema } from './user-schema';

export default function WizardFinalStep({ className }: { className?: string }) {
  const { getValues } = useFormContext<UserSchema>();

  const { username, email, firstName, lastName, phoneNumber, image } = getValues('stepOne');

  return (
    <section className={cn('flex flex-col gap-md', className)}>
      <div className="flex w-full justify-center gap-md">
        <div className="card flex h-fit w-1/2 shrink-0 grow flex-col gap-md p-md text-primary-container-fg">
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

        <div className="relative aspect-square h-fit w-1/3 overflow-hidden rounded-md">
          <Image
            className="grow-0 rounded-md object-cover"
            sizes={`(max-width: 768px) 100vw, 800px`}
            src={image ? URL.createObjectURL(image) : constructS3Url('/static/default-avatar.png')}
            alt="photo"
            fill
          />
        </div>
      </div>
      <div className="card flex flex-col">
        <p className="body-sm font-medium text-primary-900/70">Adresse de résidence</p>
        <p className="body-sm">{getValues('stepTwo.address.formattedAddress')}</p>
      </div>
    </section>
  );
}
