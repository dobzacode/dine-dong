import { capitalizeFirstLetter, getMeals } from '@/lib/utils';
import ImagePulsing from '../ui/image-pulsing';
import Dietlabel from './diet-label';

export default async function MealSnippet({ fetchOpt }: { fetchOpt: Parameters<typeof getMeals> }) {
  const data = await getMeals(fetchOpt[0], fetchOpt[1]);

  if (data === 500 || data === 404 || !data[0]) {
    return null;
  }

  const { diet, name, picture_url, cooking_date, price, weight, address } = data[0];

  return (
    <div className="flex w-full flex-col gap-sm">
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
    </div>
  );
}
