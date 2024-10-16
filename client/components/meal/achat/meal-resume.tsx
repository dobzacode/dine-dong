import { constructS3Url } from '@/lib/utils';
import { MealDetailsResponse } from '@/types/query';
import Image from 'next/image';
import Link from 'next/link';
import LocationMap from '../meal-form/location-map';
import { dietEnum } from '../meal-form/meal-schema';

interface MealResumeMealProps
  extends Omit<MealDetailsResponse, 'address' | 'user_sub' | 'ingredients'> {
  address?: MealDetailsResponse['address'] & {
    lat: number;
    lng: number;
    formatted_address: string;
  };
}
interface MealResumeProps {
  meal: MealResumeMealProps;
  title?: string;
  isOrderPage?: boolean;
}

function MealDetail({
  title,
  picture_key,
  name,
  weight,
  price,
  diet,
  meal_id
}: {
  title: string;
  picture_key: string;
  name: string;
  weight: number;
  price: number;
  diet: string[];
  meal_id: string;
}) {
  return (
    <section className="card flex h-fit w-full flex-col gap-md p-md">
      <h2 className="body text-grayed">{title}</h2>
      <div className="flex w-full items-center justify-between">
        <Link href={`/repas/${meal_id}`} className="flex gap-sm">
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
  );
}

export default function MealResume({
  meal,
  title = 'Commande',
  isOrderPage = false
}: MealResumeProps) {
  const { name, diet, picture_key, address, price, weight, meal_id } = meal;

  if (isOrderPage) {
    return (
      <MealDetail
        meal_id={meal_id}
        title={title}
        diet={diet}
        picture_key={picture_key}
        name={name}
        weight={weight}
        price={price}
      />
    );
  }

  return (
    <section className="flex w-full flex-col gap-sm">
      <MealDetail
        meal_id={meal_id}
        title={title}
        diet={diet}
        picture_key={picture_key}
        name={name}
        weight={weight}
        price={price}
      />
      <section className="card flex h-fit flex-col gap-md p-md">
        <h2 className="body text-grayed">Adresse de retrait</h2>
        <p className="body font-medium">{address?.formatted_address}</p>
        <LocationMap lat={address?.lat ?? 0} lng={address?.lng ?? 0} />
      </section>
    </section>
  );
}
