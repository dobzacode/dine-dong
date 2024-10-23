import FilterSortMenu from '@/components/home/filter-sort-menu';
import MealsSectionSkeleton from '@/components/home/meals-section-skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InformationsSection from '@/components/user/user-page/informations-section';
import InformationsSectionSkeleton from '@/components/user/user-page/informations-section-skeleton';
import UserMealsSection from '@/components/user/user-page/user-meals-section';
import { type getMealsParams } from '@/lib/meal/meal-fetch';
import { getUserInformations, getUsersParams } from '@/lib/user/user-fetch';
import { getErrorMessage } from '@/lib/utils';

import { type Metadata } from 'next';
import { Logger } from 'next-axiom';
import { Suspense } from 'react';

export async function generateStaticParams() {
  const log = new Logger();
  const data = await getUsersParams();

  if (!data || data instanceof Error) {
    console.log(data);
    log.error(`Error fetching users params: ${getErrorMessage(data)}`);
    await log.flush();
    return [];
  }

  return data.map((user) => ({
    username: user
  }));
}

export async function generateMetadata({ params }: { params: { username: string } }) {
  const log = new Logger();
  const user = await getUserInformations(
    { username: params.username },
    { next: { tags: [`user-informations-${params.username}`] } }
  );

  if (!user || user instanceof Error) {
    log.error(`Error fetching user informations: ${getErrorMessage(user)}`);
    await log.flush();
    return undefined;
  }

  return {
    title: `Utilisateur | ${user.username}`,
    description: `Profil de l'utilisateur | ${user.username}`
  } satisfies Metadata;
}

export default async function Home({
  params,
  searchParams
}: {
  params: { username: string };
  searchParams: getMealsParams;
}) {


  return (
    <section className="section-px section-py inner-section-gap container flex flex-col">
      <Suspense fallback={<InformationsSectionSkeleton />}>
        <InformationsSection username={params.username} />
      </Suspense>
      <Tabs defaultValue="plats" className="w-full">
        <TabsList className="[&>button]: flex w-full justify-start border-b-2 border-primary-100/[.400] pb-0">
          <TabsTrigger
            className="border-b-2 border-primary border-opacity-0 hover:bg-primary-100/[.400] data-[state=active]:border-opacity-100"
            value="plats"
          >
            Plats
          </TabsTrigger>
          {/* <TabsTrigger
            className="border-b-2 border-primary border-opacity-0 hover:bg-primary-100/[.400] data-[state=active]:border-opacity-100"
            value="evaluations"
          >
            Evaluations
          </TabsTrigger> */}
        </TabsList>
        <TabsContent value="plats" className="flex flex-col gap-sm px-sm pt-md">
          <FilterSortMenu />
          <Suspense fallback={<MealsSectionSkeleton />}>
            <UserMealsSection searchParams={searchParams} username={params.username} />
          </Suspense>
        </TabsContent>
        <TabsContent value="evaluations"></TabsContent>
      </Tabs>
    </section>
  );
}
