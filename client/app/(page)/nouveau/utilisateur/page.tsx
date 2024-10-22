import UserForm from '@/components/user/user-form';
import { getUserInformations } from '@/lib/user/user-fetch';
import { getErrorMessage } from '@/lib/utils';

import { verify } from 'jsonwebtoken';
import { type Metadata } from 'next';
import { Logger } from 'next-axiom';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Création de compte | Accueil',
  description: 'Création de compte'
};

export default async function Page({
  searchParams
}: {
  searchParams: { session_token: string; state: string };
}) {
  const log = new Logger();
  const token = searchParams.session_token;
  const state = searchParams.state;
  const secret = process.env.MY_REDIRECT_SECRET;
  const auth0domain = process.env.AUTH0_ISSUER_BASE_URL;

  if (!token || !state || !secret || !auth0domain) {
    redirect('/');
  }

  let decodedToken: unknown;

  try {
    decodedToken = verify(token, secret);
  } catch (error) {
    error instanceof Error && log.error(`Error decoding token: ${error.message}`);
    throw new Error('Error decoding token');
  }

  if (!decodedToken) {
    await log.flush();
    redirect('/');
  }

  const { email, sub, lastName, firstName, username } = decodedToken as {
    email: string;
    sub: string;
    lastName?: string;
    firstName?: string;
    username?: string;
  };

  const user = await getUserInformations(
    { sub: sub },
    { next: { tags: [`user-informations-${sub}`] } }
  );

  if (user instanceof Error && !user.message.includes('404')) {
    throw new Error(`Error fetching user informations: ${getErrorMessage(user)}`);
  }

  return (
    <section className="section-py container mx-auto flex h-full max-w-[1200px] flex-col items-center justify-center">
      <UserForm
        auth0domain={auth0domain}
        email={email}
        username={username ?? ''}
        firstName={firstName ?? ''}
        lastName={lastName ?? ''}
        sub={sub}
        state={state}
      />
    </section>
  );
}
