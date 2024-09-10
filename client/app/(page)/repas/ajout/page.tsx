import MealForm from '@/components/meal/meal-form';
import { getSession } from '@auth0/nextjs-auth0';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Création de repas | Accueil',
  description: 'Création de repas'
};

export default async function Home() {
  const session = await getSession();

  if (!session?.user?.sub) {
    redirect('/');
  }

  return (
    <section className="section-py container mx-auto flex h-full max-w-[1200px] flex-col justify-center">
      <MealForm sub={session.user.sub as string} />
    </section>
  );
}
