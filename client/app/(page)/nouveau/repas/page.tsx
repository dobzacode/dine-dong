import MealForm from '@/components/meal/meal-form';
import { getSessionOrRedirect } from '@/lib/server-only-utils';
import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Création de repas | Accueil',
  description: 'Création de repas'
};

export default async function Home() {
  const session = await getSessionOrRedirect(`/api/auth/login`);

  return (
    <section className="section-py container mx-auto flex h-full max-w-[1200px] flex-col justify-center">
      <MealForm token={session.accessToken} sub={session.user.sub} />
    </section>
  );
}
