import { getMeals } from '@/lib/utils';
import MealSnippet from '../meal/meal-snippet';

export default async function NearMeSection() {
  const data = await getMeals(
    {
      offset: 0,
      limit: 10,
      lat: 45.767572,
      lng: 4.833102,
      radius: 6200,
      diet: [],
      name: 'fdsfdsfd',
      weight_max: 1000,
      weight_min: 0
    },
    {
      tags: ['near-me-meals']
    }
  );

  if (data === 500) {
    return <p>Une erreur est survenue</p>;
  }

  if (data === 404) {
    return <p>Aucun repas trouvé</p>;
  }

  return (
    <section className="grid grid-cols-5 gap-x-md gap-y-2xl">
      {data.map((meal) => (
        <MealSnippet key={meal.meal_id} {...meal} />
      ))}
    </section>
  );
}
