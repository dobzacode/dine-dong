import { MealInformations } from '@/components/meal/meal-informations';
import { UserInformations } from '@/components/meal/user-informations';
import ImagePulsing from '@/components/ui/image-pulsing';
import { getMealDetails, getMealsSummaries } from '@/lib/meal/meal-fetch';
import { constructS3Url, getErrorMessage } from '@/lib/utils';
import { type MealSummaryResponse } from '@/types/query';
import { type Metadata } from 'next';
import { Logger } from 'next-axiom';
import { notFound } from 'next/navigation';

type Props = {
  params: { id: string };
};

export async function generateStaticParams() {
  const log = new Logger();
  const meals = await getMealsSummaries<MealSummaryResponse[]>(
    {},
    {
      next: {
        tags: [`search-meals`]
      }
    }
  );

  if (!meals || meals instanceof Error) {
    log.error(`Error fetching meals: ${getErrorMessage(meals)}`);
    await log.flush();
    return [];
  }

  return meals.map((meal) => ({
    id: meal.meal_id
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata | undefined> {
  const log = new Logger();
  let meal;
  try {
    meal = await getMealDetails(params, {
      next: {
        tags: [`meal-details-${params.id}`]
      }
    });
  } catch (error) {
    console.log(error);
  }

  if (!meal || meal instanceof Error) {
    log.error(`Error fetching meal details: ${getErrorMessage(meal)}`);
    await log.flush();
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

  if (meal instanceof Error) {
    const message = getErrorMessage(meal);
    if (message.includes('404')) {
      return notFound();
    }
    throw new Error(`Error fetching meal details: ${message}`);
  }

  return (
    <section className="section-px shadow-primary-40 section-py container flex flex-col justify-center gap-sm tablet:flex-row">
      <div className="relative aspect-square w-full rounded-md tablet:w-2/3">
        <ImagePulsing
          key={`${meal.meal_id}-picture`}
          skeletoncss={'h-full w-full object-cover absolute object-center rounded-md'}
          priority
          fill
          src={constructS3Url(meal.picture_key)}
          alt={meal.name}
          sizes={'(max-width: 768px) 100vw, 80vw'}
          className="rounded-md object-cover object-center"
        />
      </div>
      <div className="flex flex-col gap-sm">
        <UserInformations userSub={meal.user_sub} />
        <MealInformations {...meal} />
      </div>
    </section>
  );
}
