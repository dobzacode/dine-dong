import { Skeleton } from '@/components/ui/skeleton';
import ActionsWrapper from '@/components/user/user-page/actions-wrapper';
import InformationsSection from '@/components/user/user-page/informations-section';
import { getUserInformations } from '@/lib/utils';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export async function generateStaticParams() {
  const response = await fetch('http://localhost:3000/api/users/get-user-params', {
    cache: 'no-cache'
  });

  const data = (await response.json()) as { username: string }[];

  return data.map((user) => ({
    username: user.username
  }));
}

export async function generateMetadata({ params }: { params: { username: string } }) {
  const user = await getUserInformations(
    { username: params.username },
    { tags: [`user-informations-${params.username}`] }
  );

  if (!user || user instanceof Error) {
    return undefined;
  }

  return {
    title: `Utilisateur | ${user.username}`,
    description: `Profil de l'utilisateur | ${user.username}`
  } satisfies Metadata;
}

export default async function Home({ params }: { params: { username: string } }) {
  const user = await getUserInformations(
    { username: params.username },
    { tags: [`user-informations-${params.username}`] }
  );

  if (!user || user instanceof Error) {
    return notFound();
  }

  return (
    <section className="section-px section-py container flex flex-col gap-sm">
      <div className="flex w-full justify-between">
        <InformationsSection user={user} />
        <Suspense fallback={<Skeleton className="h-10 w-48" />}>
          <ActionsWrapper sub={user.open_id} />
        </Suspense>
      </div>
    </section>
  );
}
