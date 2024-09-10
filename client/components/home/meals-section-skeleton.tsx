"use client"

import { motion } from 'framer-motion';
import { delayFadeInVariant } from '../framer/div-variants';
import { Skeleton } from '../ui/skeleton';
import { MealSnippetSkeleton } from './meal/meal-snippet';

export default function MealsSectionSkeleton() {
  return (
    <div className="flex w-full flex-col gap-lg">
      <div className="flex w-full items-end justify-between gap-xs">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-9 w-36 rounded-full" />
      </div>
      <section className="flex w-full flex-wrap gap-md mobile-lg:grid mobile-lg:grid-cols-2 mobile-lg:gap-y-xl tablet:grid-cols-3 tablet:gap-x-md tablet:gap-y-2xl laptop:grid-cols-5">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            initial="hidden"
            className="w-full"
            exit="exit"
            animate="enter"
            key={`search-meal-skeleton-${i}`}
            variants={delayFadeInVariant}
            custom={i}
          >
            <MealSnippetSkeleton />
          </motion.div>
        ))}
      </section>
    </div>
  );
}
