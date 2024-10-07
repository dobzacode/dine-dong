import { constructS3Url } from '@/lib/utils';
import { MealDetailsResponse } from '@/types/query';
import Image from 'next/image';
import Link from 'next/link';
import LocationMap from '../meal-form/location-map';
import { dietEnum } from '../meal-form/meal-schema';

export default function MealResume({ meal }: { meal: MealDetailsResponse }) {
  const {
    name,
    diet,
    picture_key,
    address: { lat, lng, formatted_address },
    price,
    weight
  } = meal;

  return (
    <section className="flex w-full flex-col gap-sm">
      <section className="card flex h-fit flex-col gap-md p-md">
        <h2 className="body text-grayed">Commande</h2>
        <div className="flex w-full items-center justify-between">
          <Link href={`/repas/${meal.meal_id}`} className="flex gap-sm">
            <div className="relative aspect-square h-3xl overflow-hidden rounded-xs">
              <Image
                src={constructS3Url(picture_key)}
                alt={`Photo de ${name}`}
                fill
                sizes={'(max-width: 768px) 10vw, 70vw'}
              />
            </div>
            <div className="flex flex-col">
              <p className="body font-medium">{name}</p>
              <p className="body-sm text-grayed">{weight} grammes</p>
              <p className="body-sm text-grayed">
                {diet
                  .map((diet) => {
                    return dietEnum.find((item) => item.value === diet)?.label;
                  })
                  .join(' - ')}
              </p>
            </div>
          </Link>
          <p className="body">{price} €</p>
        </div>
      </section>
      <section className="card flex h-fit flex-col gap-md p-md">
        <h2 className="body text-grayed">Adresse de retrait</h2>
        <p className="body font-medium">{formatted_address}</p>
        <LocationMap lat={lat} lng={lng} />
      </section>
    </section>
  );
}
