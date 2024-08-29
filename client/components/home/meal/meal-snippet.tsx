'use client';

import { capitalizeFirstLetter } from '@/lib/utils';
import { MealWithAddressResponse } from '@/types/query';
import Link from 'next/link';
import ImagePulsing from '../../ui/image-pulsing';
import { Skeleton } from '../../ui/skeleton';
import Dietlabel from './diet-label';

interface MealSnippetProps extends MealWithAddressResponse {}

export function MealSnippetSkeleton() {
  return (
    <div className="flex w-full flex-col gap-sm">
      <div className="relative aspect-square overflow-hidden rounded-xs">
        <Skeleton className="absolute h-full w-full object-cover" />
      </div>
      <div className="grid gap-xs">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-3 w-4/5" />
      </div>
    </div>
  );
}

export default function MealSnippet(props: MealSnippetProps) {
  const { diet, name, picture_url, price, weight, address, meal_id } = props;

  return (
    <Link href={`/repas/${meal_id}`} className="flex w-full flex-col gap-sm">
      <div
        key={`${picture_url}-${name}-parent`}
        data-loaded="false"
        className="relative aspect-square overflow-hidden rounded-xs"
      >
        <ImagePulsing
          skeletoncss={'h-full w-full object-cover absolute'}
          key={`${picture_url}-${name}`}
          priority
          fill
          src={picture_url}
          alt={name}
          sizes={'(max-width: 768px) 100vw, 200px'}
          className="object-cover"
        />
        {diet.length > 0 && (
          <div className="absolute right-0 top-0 flex flex-col gap-xs p-sm">
            {diet.map((diet) => (
              <Dietlabel key={diet} diet={diet} />
            ))}
          </div>
        )}
      </div>
      <div className="grid">
        {address?.distance && (
          <p>
            A environ{' '}
            {address.distance
              .toLocaleString('fr-FR', {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1
              })
              .replace(',0', '')}{' '}
            km
          </p>
        )}
        <p className="body font-medium">{capitalizeFirstLetter(name)}</p>
        <p className="body-sm">
          <span className="font-medium">{price} € </span> le plat de {weight} grammes
        </p>
      </div>
    </Link>
  );
}
