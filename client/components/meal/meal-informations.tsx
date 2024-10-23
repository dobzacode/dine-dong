import { type MealDetailsResponse } from '@/types/query';

import { Separator } from '../ui/separator';
import MealActions from './meal-actions';
import LocationMap from './meal-form/location-map';
import { dietEnum } from './meal-form/meal-schema';

export function MealInformations(props: MealDetailsResponse) {
  const {
    name,
    diet: dietArr,
    ingredients,
    additional_information,
    address: { lat, lng, formatted_address },
    payment_method,
    price,
    weight,
    meal_id,
    is_ordered,
    user_sub
  } = props;

  return (
    <section className="card flex h-fit flex-col gap-md p-md">
      <div className="flex flex-col gap-sm">
        <h2 className="heading-h1 font-bold text-primary-container-fg">{name}</h2>
        {dietArr.length > 0 && (
          <div className="body-sm text-grayed flex items-center gap-xs opacity-90">
            {dietArr.map((diet, index) => (
              <>
                <p key={diet} className="body-sm flex items-center gap-sm">
                  {dietEnum.find((item) => item.value === diet)?.label}
                </p>
                <span key={`${diet}-separator`}>{index < dietArr.length - 1 && '- '}</span>
              </>
            ))}
          </div>
        )}
        {additional_information && (
          <p className="body-sm text-grayed w-[30ch] opacity-90">{additional_information}</p>
        )}
      </div>
      <Separator />
      <div className="flex flex-col">
        <h1 className="heading-h4 font-bold text-primary-container-fg">Liste des ingrédients</h1>
        <div className="body-sm text-grayed flex items-center gap-xs opacity-90">
          {ingredients.map((ingredient, index) => (
            <>
              <p className="body-sm flex items-center gap-sm">{ingredient.name}</p>
              <span key={`${ingredient.name}-separator`}>
                {index < ingredients.length - 1 && '- '}
              </span>
            </>
          ))}
        </div>
      </div>
      <Separator />
      <div className="flex flex-col">
        <h2 className="heading-h4 font-bold text-primary-container-fg">Paiement</h2>
        <p className="body-sm text-grayed opacity-90">
          {payment_method === 'ONLINE' ? 'Paiement en ligne' : 'Paiement en personne'}
        </p>
        <p className="body-sm text-grayed pt-sm opacity-90">
          <span className="font-semibold">{price} €</span> le plat de{' '}
          <span className="font-semibold">{weight} grammes</span>
        </p>
      </div>
      {!is_ordered && <MealActions isOrdered={is_ordered} mealId={meal_id} ownerSub={user_sub} />}

      <Separator />
      <div className="flex flex-col">
        <h2 className="heading-h4 font-bold text-primary-container-fg">Livraison</h2>
        <p className="body-sm text-grayed opacity-90">A venir récupérer</p>
        <p className="body-sm text-grayed py-sm opacity-90">{formatted_address}</p>
        <div className="w-full py-sm">
          <LocationMap lat={lat} lng={lng} />
        </div>
      </div>
    </section>
  );
}
