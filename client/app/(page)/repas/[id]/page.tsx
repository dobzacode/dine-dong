import { getMealsSummaries } from '@/lib/utils';
import { type GetMealSummaryResponse } from '@/types/query';
import { type Metadata } from 'next';

type Props = {
  params: { id: string };
};

export async function generateStaticParams() {
  const meals = await getMealsSummaries<GetMealSummaryResponse[]>();

  if (!meals || meals instanceof Error) {
    return [];
  }

  return meals.map((meal) => ({
    id: meal.meal_id
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata | undefined> {
  const meal = await getMealsSummaries<GetMealSummaryResponse>(params.id);

  if (!meal || meal instanceof Error) {
    return undefined;
  }

  return {
    title: meal.name,
    description: meal.description
  } satisfies Metadata;
}

export default async function Home() {
  return <section className="section-px container flex flex-col items-center gap-sm"></section>;
}
