import FilterSortMenu from '@/components/home/filter-sort-menu';
import MealsPrefetch from '@/components/home/meals-prefetch';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ActionsWrapper from '@/components/user/user-page/actions-wrapper';
import InformationsSection from '@/components/user/user-page/informations-section';
import { type getMealsParams } from '@/lib/meal/meal-fetch';
import { getUserInformations, getUsersParams } from '@/lib/user/user-fetch';
import { getErrorMessage } from '@/lib/utils';
import { getSession } from '@auth0/nextjs-auth0';

import { type Metadata } from 'next';
import { Logger } from 'next-axiom';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export const revalidate = 3600;

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
  let user;
  try {
    user = await getUserInformations(
      { username: params.username },
      { next: { tags: [`user-informations-${params.username}`] } }
    );
  } catch (error) {
    console.log(error);
  }

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
  const session = await getSession();

  const user = await getUserInformations(
    { username: params.username },
    { next: { tags: [`user-informations-${params.username}`] } }
  );

  if (user instanceof Error) {
    const message = getErrorMessage(user);
    if (message.includes('404')) {
      return notFound();
    }
    throw new Error(`Error fetching user informations: ${message}`);
  }

  return (
    <section className="section-px section-py inner-section-gap container flex flex-col">
      <div className="flex w-full justify-between">
        <InformationsSection user={user} />
        <Suspense fallback={<Skeleton className="h-10 w-48" />}>
          <ActionsWrapper sub={user.user_sub} />
        </Suspense>
      </div>
      <Tabs defaultValue="plats" className="w-full">
        <TabsList className="[&>button]: flex w-full justify-start border-b-2 border-primary-100/[.400] pb-0">
          <TabsTrigger
            className="border-b-2 border-primary border-opacity-0 hover:bg-primary-100/[.400] data-[state=active]:border-opacity-100"
            value="plats"
          >
            Plats
          </TabsTrigger>
          <TabsTrigger
            className="border-b-2 border-primary border-opacity-0 hover:bg-primary-100/[.400] data-[state=active]:border-opacity-100"
            value="evaluations"
          >
            Evaluations
          </TabsTrigger>
        </TabsList>
        <TabsContent value="plats" className="flex flex-col gap-sm px-sm pt-md">
          <FilterSortMenu />
          <MealsPrefetch
            isUserPage={session?.user?.sub === user.user_sub}
            user_sub={user.user_sub}
            {...searchParams}
          />
        </TabsContent>
        <TabsContent value="evaluations"></TabsContent>
      </Tabs>
    </section>
  );
}
