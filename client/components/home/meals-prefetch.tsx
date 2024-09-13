import { getMeals, type getMealsParams } from '@/lib/meal/meal-fetch';
import { getErrorMessage } from '@/lib/utils';
import { type MealsPaginatedResponse } from '@/types/query';
import MealsSection from './meals-section';

export default async function MealsPrefetch({
  name,
  diet,
  radius,
  sort,
  max_price,
  lat,
  lng,
  user_id
}: getMealsParams) {
  const fetchOptions = {
    name,
    diet,
    radius: typeof radius === 'string' ? parseInt(radius) : undefined,
    sort: sort,
    max_price,
    lat: typeof lat === 'string' ? parseFloat(lat) : undefined,
    lng: typeof lng === 'string' ? parseFloat(lng) : undefined,
    user_id
  };

  let prefetchMeals: MealsPaginatedResponse | Error;

  try {
    prefetchMeals = await getMeals({ ...fetchOptions }, { next: { tags: ['search-meals'] } });
  } catch (error) {
    const message = getErrorMessage(error);
    if (message.includes('404')) {
      return (
        <div className="flex w-full flex-col items-center justify-center">
          <h3 className="heading-h1">Aucun repas trouvé</h3>
        </div>
      );
    }
    return (
      <h3 className="heading-h1">Une erreur est survenue lors de la récupération des repas.</h3>
    );
  }

  return (
    <MealsSection
      fetchOptions={fetchOptions}
      prefetchMeals={
        prefetchMeals instanceof Error ? { meals: [], total: 200, hasMore: true } : prefetchMeals
      }
    />
  );
}
