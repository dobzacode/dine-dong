import SearchBar from '@/components/home/search-bar';
import Chat from '@/components/wrapper/socketio-wrapper';
import { getSession } from '@auth0/nextjs-auth0';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Dine Dong | Accueil',
  description: "Accueil de l'application"
};

export default async function Home() {
  const session = await getSession();

  if (!session?.user.sub || !session.accessToken) {
    redirect('/');
  }

  return (
    <>
      <SearchBar className="section-px w-full tablet:hidden laptop:px-0" />
      <section className="section-px container flex flex-col items-center gap-sm">
        <Chat token={session.accessToken} />
      </section>
    </>
  );
}
