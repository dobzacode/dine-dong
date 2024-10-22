import ProfilForm from '@/components/settings/profil/profil-form';
import { getSessionOrRedirect } from '@/lib/server-only-utils';
import { getUserInformations } from '@/lib/user/user-fetch';
import { getErrorMessage } from '@/lib/utils';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { notFound, redirect } from 'next/navigation';

export const metadata = {
  title: 'Paramètres | Profil',
  description: 'Profil'
};

export default withPageAuthRequired(async function Page() {
  const session = await getSessionOrRedirect();

  let user;
  try {
    user = await getUserInformations(
      { sub: session.user.sub },
      { next: { tags: [`user-informations-${session.user.sub}`] } }
    );
  } catch (error) {
    const message = getErrorMessage(error);
    if (message.includes('404')) {
      return notFound();
    }
    redirect('/');
  }

  return <ProfilForm user={user} sub={session.user.sub} token={session.accessToken} />;
});
