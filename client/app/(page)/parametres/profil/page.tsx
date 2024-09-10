import ProfilForm from '@/components/settings/profil/profil-form';
import { getUserInformations } from '@/lib/utils';
import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Paramètres | Profil',
  description: 'Profil'
};

export default async function Page({}: Record<string, never>) {
  const session = await getSession();

  if (!session?.user?.sub) {
    redirect('/');
  }

  const user = await getUserInformations(
    { sub: session.user.sub as string },
    { tags: [`user-informations-${session.user.sub}`] }
  );

  return <ProfilForm user={user} />;
}
