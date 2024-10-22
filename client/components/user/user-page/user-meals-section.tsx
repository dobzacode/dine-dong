import MealsPrefetch from '@/components/home/meals-prefetch';
import MealsSectionSkeleton from '@/components/home/meals-section-skeleton';
import { getMealsParams } from '@/lib/meal/meal-fetch';
import { getUserInformations } from '@/lib/user/user-fetch';
import { getErrorMessage } from '@/lib/utils';
import { getSession } from '@auth0/nextjs-auth0';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export default async function UserMealsSection({
  username,
  searchParams
}: {
  username: string;
  searchParams: getMealsParams;
}) {
  const session = await getSession();

  const user = await getUserInformations(
    { username: username },
    { next: { tags: [`user-informations-${username}`] } }
  );

  if (user instanceof Error) {
    const message = getErrorMessage(user);
    if (message.includes('404')) {
      return notFound();
    }
    throw new Error(`Error fetching user informations: ${message}`);
  }

  return (
    <Suspense fallback={<MealsSectionSkeleton/>}>
      <MealsPrefetch
        isUserPage={session?.user?.sub === user.user_sub}
        user_sub={user.user_sub}
        {...searchParams}
      />
    </Suspense>
  );
}
