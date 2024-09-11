import { MealInformations } from '@/components/meal/meal-informations';
import { UserInformations } from '@/components/meal/user-informations';
import ImagePulsing from '@/components/ui/image-pulsing';
import { constructS3Url, getMealDetails, getMealsSummaries } from '@/lib/utils';
import { type MealSummaryResponse } from '@/types/query';
import { type Metadata } from 'next';

type Props = {
  params: { id: string };
};

export async function generateStaticParams() {
  const meals = await getMealsSummaries<MealSummaryResponse[]>();

  if (!meals || meals instanceof Error) {
    return [];
  }

  return meals.map((meal) => ({
    id: meal.meal_id
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata | undefined> {
  const meal = await getMealDetails(params, {
    next: {
      tags: [`meal-details-${params.id}`]
    }
  });

  if (!meal || meal instanceof Error) {
    return undefined;
  }

  return {
    title: meal.name,
    description: meal.additional_information ?? null
  } satisfies Metadata;
}

export default async function Home({ params }: Props) {
  const meal = await getMealDetails(params, {
    next: {
      tags: [`meal-details-${params.id}`]
    }
  });

  if (!meal || meal instanceof Error) {
    return <h1>Error</h1>;
  }

  console.log(meal.meal_id);

  return (
    <section className="section-px shadow-primary-40 section-py container flex flex-col justify-center gap-sm tablet:flex-row">
      <div className="relative aspect-square w-full rounded-xs tablet:w-2/3">
        <ImagePulsing
          skeletoncss={'h-full w-full object-cover absolute object-center rounded-xs'}
          priority
          fill
          src={constructS3Url(meal.picture_key)}
          alt={meal.name}
          sizes={'(max-width: 768px) 100vw, 80vw'}
          className="rounded-xs object-cover object-center"
        />
      </div>
      <div className="flex flex-col gap-sm">
        <UserInformations id={meal.user_id} />
        <MealInformations {...meal} />
      </div>
    </section>
  );
}
