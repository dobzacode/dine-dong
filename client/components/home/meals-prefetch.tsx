import { getMeals, type getMealsParams } from '@/lib/meal/meal-fetch';
import { cn, getErrorMessage } from '@/lib/utils';
import { type MealsPaginatedResponse } from '@/types/query';
import { Logger } from 'next-axiom';
import Link from 'next/link';
import { buttonVariants } from '../ui/button';
import MealsSection from './meals-section';

export default async function MealsPrefetch({
  name,
  diet,
  radius,
  sort,
  max_price,
  lat,
  lng,
  user_sub,
  isUserPage
}: getMealsParams & { isUserPage?: boolean }) {
  const fetchOptions = {
    name,
    diet,
    radius: typeof radius === 'string' ? parseInt(radius) : undefined,
    sort: sort,
    max_price,
    lat: typeof lat === 'string' ? parseFloat(lat) : undefined,
    lng: typeof lng === 'string' ? parseFloat(lng) : undefined,
    user_sub,
    is_ordered: false
  };
  const log = new Logger();
  let prefetchMeals: MealsPaginatedResponse | Error;

  try {
    prefetchMeals = await getMeals({ ...fetchOptions }, { next: { tags: ['search-meals'] } });
  } catch (error) {
    const message = getErrorMessage(error);
    if (message.includes('404')) {
      log.error(`Meals not found: ${message}`);
      await log.flush();
      return (
        <div className="flex w-full flex-col items-center justify-center gap-md">
          <h3 className="heading-h1">Aucun repas trouvé</h3>
          {typeof isUserPage === 'boolean' && isUserPage && (
            <Link className={cn(buttonVariants({ variant: 'default' }))} href="/nouveau/repas">
              Ajouter un repas
            </Link>
          )}
        </div>
      );
    }
    log.error(`Error fetching meals: ${message}`);
    await log.flush();
    return (
      <h3 className="heading-h1">Une erreur est survenue lors de la récupération des repas.</h3>
    );
  }

  return (
    <MealsSection
      isUserPage={isUserPage}
      fetchOptions={fetchOptions}
      prefetchMeals={
        prefetchMeals instanceof Error ? { meals: [], total: 200, hasMore: true } : prefetchMeals
      }
    />
  );
}
