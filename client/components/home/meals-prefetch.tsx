import { getMeals, type getMealsParams } from '@/lib/meal/meal-fetch';
import { cn, getErrorMessage } from '@/lib/utils';
import { type MealsPaginatedResponse } from '@/types/query';
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
    radius: typeof radius === 'string' ? parseInt(radius) : 10000,
    sort: sort,
    max_price,
    lat: typeof lat === 'string' ? parseFloat(lat) : 45.767572,
    lng: typeof lng === 'string' ? parseFloat(lng) : 4.833102,
    user_sub,
    is_ordered: false
  };

  const prefetchMeals: MealsPaginatedResponse | Error = await getMeals(
    { ...fetchOptions },
    {
      next: {
        tags: [
          'search-meals',
          JSON.stringify(fetchOptions),
          user_sub ? `user-${user_sub}-meals` : ''
        ]
      }
    }
  );

  if (prefetchMeals instanceof Error) {
    const message = getErrorMessage(prefetchMeals);
    if (message.includes('404')) {
      return (
        <div className="flex w-full flex-col items-center justify-center gap-md">
          <h3 className="heading-h1">Aucun repas trouvé</h3>
          {typeof isUserPage === 'boolean' && (
            <Link className={cn(buttonVariants({ variant: 'default' }))} href="/nouveau/repas">
              Ajouter un repas
            </Link>
          )}
        </div>
      );
    }
    throw new Error(`Error fetching meals: ${message}`);
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
