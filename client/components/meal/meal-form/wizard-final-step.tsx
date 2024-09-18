'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useFormContext } from 'react-hook-form';
import { dietEnum, paymentMethodEnum, type MealSchema } from './meal-schema';

export default function WizardFinalStep({ className }: { className?: string }) {
  const { getValues } = useFormContext<MealSchema>();

  return (
    <div className={cn('flex flex-col gap-lg', className)}>
      <section className="flex w-full gap-lg max-mobile-lg:flex-col">
        <div className="card flex h-fit w-full shrink-0 grow flex-col gap-md p-md text-primary-container-fg mobile-lg:w-fit">
          <h3 className="heading-h3 font-semibold text-primary-container-fg">
            Informations générales
          </h3>

          <div className="flex h-fit flex-col gap-md">
            <div className="flex flex-col gap-xs">
              <p className="body-sm font-medium text-primary-900/70">Nom du repas</p>
              <p className="body-sm">{getValues('stepOne.name')}</p>
            </div>
            <div className="flex flex-col gap-xs">
              <p className="body-sm font-medium text-primary-900/70">Date de préparation</p>
              <p className="body-sm">
                {getValues('stepOne.cookingDate').toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div className="flex flex-col gap-xs">
              <p className="body-sm font-medium text-primary-900/70">Date de péremption</p>
              <p className="body-sm">
                {getValues('stepOne.expirationDate').toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xs max-mobile-lg:aspect-square mobile-lg:w-8xl">
          <Image
            className="grow-0 rounded-xs object-cover"
            sizes={`(max-width: 768px) 100vw, 800px`}
            src={URL.createObjectURL(getValues('stepOne.image'))}
            alt="photo"
            fill
          />
        </div>
      </section>
      <section className="card flex flex-col gap-md p-md text-primary-container-fg">
        <h3 className="heading-h3 font-semibold text-primary-container-fg">Ingrédients</h3>
        <div className="flex flex-wrap gap-lg">
          <div className="flex flex-col gap-xs">
            <p className="body-sm font-medium text-primary-900/70">Poids du repas (en grammes)</p>
            <p className="body-sm">{getValues('stepTwo.weight')}</p>
          </div>
          {getValues('stepTwo.diet').length > 0 && (
            <div className="flex flex-col gap-xs">
              <p className="body-sm font-medium text-primary-900/70">Régime alimentaire</p>
              <p className="flex gap-md">
                {getValues('stepTwo.diet').map((diet) => (
                  <span key={diet} className="body-sm">
                    {dietEnum.find((item) => item.value === diet)?.label}
                  </span>
                ))}
              </p>
            </div>
          )}
          <div className="flex flex-col gap-xs">
            <p className="body-sm font-medium text-primary-900/70">Liste des ingrédients</p>
            {getValues('stepTwo.ingredients').map((ingredient) => (
              <div className="flex gap-xs" key={ingredient.name}>
                {ingredient?.quantity && <p className="body-sm">{ingredient.quantity}</p>}
                {ingredient?.unit !== 'UNITE' && ingredient?.unit ? (
                  <p className="body-sm">{ingredient.unit}</p>
                ) : null}
                <p className="body-sm font-medium text-primary-900/70">{ingredient.name}</p>
              </div>
            ))}
          </div>
          {getValues('stepTwo.additionalInformation') && (
            <>
              <div className="flex flex-col gap-xs">
                <p className="body-sm font-medium text-primary-900/70">
                  Informations complémentaires
                </p>
                <p className="body-sm line-clamp-4">{getValues('stepTwo.additionalInformation')}</p>
              </div>
            </>
          )}
        </div>
      </section>
      <section className="card flex flex-col gap-md p-md text-primary-container-fg">
        <h3 className="heading-h3 font-semibold text-primary-container-fg">Retrait et paiement</h3>
        <div className="flex flex-wrap gap-lg">
          <div className="flex flex-col gap-xs">
            <p className="body-sm font-medium text-primary-900/70">Adresse de retrait</p>
            <p className="body-sm">{getValues('stepThree.address.formattedAddress')}</p>
          </div>

          <div className="flex flex-col gap-xs">
            <p className="body-sm font-medium text-primary-900/70">Mode de paiement</p>
            <p className="body-sm">
              {
                paymentMethodEnum.find(
                  (item) => item.value === getValues('stepThree.paymentMethod')
                )?.label
              }
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
