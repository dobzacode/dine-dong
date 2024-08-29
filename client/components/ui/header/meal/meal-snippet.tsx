'use client';

import DivWrapper from '@/components/framer/div-wrapper';
import { capitalizeFirstLetter, getMeals, getMealsParams } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Variants } from 'framer-motion';
import Link from 'next/link';
import ImagePulsing from '../../image-pulsing';
import { Skeleton } from '../../skeleton';
import Dietlabel from './diet-label';

const variant: Variants = {
  hidden: { opacity: 0 },
  enter: ({ index }) => ({ opacity: 1, transition: { duration: 0.5, delay: 0.1 * index } }),
  exit: { opacity: 0, transition: { duration: 0.5 } }
};

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

export default function MealSnippet({ params, index }: { params: getMealsParams; index: number }) {

  const { data, isLoading, isError } = useQuery({
    queryKey: ['search-meals', params],
    queryFn: async () => {
      const data = await getMeals(params);
      return data;
    },
    retry: false,
    refetchOnWindowFocus: false
  });

  if (isLoading) {
    return (
      <DivWrapper key={`search-meals-skeleton-${index}`} variant={variant} custom={index}>
        <MealSnippetSkeleton />
      </DivWrapper>
    );
  }

  if (data instanceof Error || !data?.[0] || isError) {
    return null;
  }

  const { diet, name, picture_url, price, weight, address, meal_id } = data[0];

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
        <div className="absolute right-0 top-0 flex flex-col gap-xs p-sm">
          {diet.map((diet) => (
            <Dietlabel key={diet} diet={diet} />
          ))}
        </div>
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
