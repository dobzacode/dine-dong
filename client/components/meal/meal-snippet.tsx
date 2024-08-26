import { MealWithAddressResponse } from '@/types/query';
import Image from 'next/image';
import Dietlabel from './diet-label';

export default function MealSnippet({
  address: { formatted_address },
  diet,
  name,
  picture_url,
  weight,
  cooking_date,
  expiration_date
}: MealWithAddressResponse) {
  console.log(typeof expiration_date);
  return (
    <div className="flex w-full flex-col gap-md">
      <div className="relative h-8xl w-full overflow-hidden rounded-xs">
        <Image
          fill
          src={picture_url}
          alt={name}
          sizes={'(max-width: 768px) 100vw, 400px'}
          className="object-cover"
        />
        <div className="absolute right-0 top-0 flex flex-col gap-xs p-sm">
          {diet.map((diet) => (
            <Dietlabel key={diet} diet={diet} />
          ))}
        </div>
      </div>
      <div className="flex flex-wrap justify-between gap-sm">
        <div>
          <p className="body-sm font-medium text-primary-900/70">Nom du repas</p>
          <p className="body-sm">{name}</p>
        </div>
        <div>
          <p className="body-sm font-medium text-primary-900/70">Date de préparation</p>
          <p className="body-sm">
            {new Date(cooking_date).toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
        <div>
          <p className="body-sm font-medium text-primary-900/70">Date de péremption</p>
          <p className="body-sm">
            {new Date(expiration_date).toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
