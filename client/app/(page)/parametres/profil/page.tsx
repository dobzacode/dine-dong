import ProfilForm from '@/components/settings/profil/profil-form';
import { getUserInformations } from '@/lib/user/user-fetch';
import { getErrorMessage } from '@/lib/utils';
import { getSession } from '@auth0/nextjs-auth0';
import { notFound, redirect } from 'next/navigation';

export const metadata = {
  title: 'Paramètres | Profil',
  description: 'Profil'
};

export default async function Page() {
  const session = await getSession();

  if (!session?.user?.sub || !session.accessToken) {
    redirect('/');
  }

  let user;
  try {
    user = await getUserInformations(
      { sub: session.user.sub as string },
      { next: { tags: [`user-informations-${session.user.sub}`] } }
    );
  } catch (error) {
    const message = getErrorMessage(error);
    if (message.includes('404')) {
      return notFound();
    }
    redirect('/');
  }

  return <ProfilForm user={user} sub={session.user.sub as string} token={session.accessToken} />;
}
