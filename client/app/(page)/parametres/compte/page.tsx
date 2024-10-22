import AccountForm from '@/components/settings/account/account-form';
import { getSessionOrRedirect } from '@/lib/server-only-utils';
import { getUserInformations } from '@/lib/user/user-fetch';
import { getErrorMessage } from '@/lib/utils';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Paramètres | Profil',
  description: 'Profil'
};

export default async function Page() {
  const session = await getSessionOrRedirect(`/api/auth/login`);

  const user = await getUserInformations(
    { sub: session.user.sub },
    { next: { tags: [`user-informations-${session.user.sub}`] } }
  );

  if (user instanceof Error) {
    const message = getErrorMessage(user);
    if (message.includes('404')) {
      return notFound();
    }
    throw new Error(`Error fetching user informations: ${message}`);
  }

  return <AccountForm user={user} sub={session.user.sub} token={session.accessToken} />;
}
