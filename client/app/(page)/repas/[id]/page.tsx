import { MealInformations } from '@/components/meal/meal-informations';
import { UserInformations } from '@/components/meal/user-informations';
import ImagePulsing from '@/components/ui/image-pulsing';
import { getMealDetails, getMealsSummaries } from '@/lib/utils';
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
  const meal = await getMealsSummaries<MealSummaryResponse>(params, {
    tags: [`meal-summary-${params.id}`]
  });

  if (!meal || meal instanceof Error) {
    return undefined;
  }

  return {
    title: meal.name,
    description: meal.description
  } satisfies Metadata;
}

export default async function Home({ params }: Props) {
  const meal = await getMealDetails(params, {
    tags: [`meal-details-${params.id}`]
  });

  if (!meal || meal instanceof Error) {
    return <h1>Error</h1>;
  }

  return (
    <section className="section-px shadow-primary-40 container flex flex-col justify-center gap-sm tablet:flex-row">
      <div className="relative aspect-square w-full rounded-xs tablet:w-2/3">
        <ImagePulsing
          skeletoncss={'h-full w-full object-cover absolute object-center rounded-xs'}
          priority
          fill
          src={meal.picture_url}
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
