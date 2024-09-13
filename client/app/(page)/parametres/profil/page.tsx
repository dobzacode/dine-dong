import ProfilForm from '@/components/settings/profil/profil-form';
import { getErrorMessage, getUserInformations } from '@/lib/utils';
import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Paramètres | Profil',
  description: 'Profil'
};

export default async function Page() {
  const session = await getSession();

  if (!session?.user?.sub) {
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
    console.log(message);
    redirect('/');
  }

  return <ProfilForm user={user} sub={session.user.sub as string} />;
}
