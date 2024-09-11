import UserForm from '@/components/user/user-form';
import { getUserInformations } from '@/lib/utils';
import { UserResponse } from '@/types/query';
import { verify } from 'jsonwebtoken';
import { Metadata } from 'next';
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
    console.error('Error decoding token:', error);
    redirect('/');
  }

  if (!decodedToken) {
    redirect('/');
  }

  const { email, sub, lastName, firstName, username } = decodedToken as {
    email: string;
    sub: string;
    lastName?: string;
    firstName?: string;
    username?: string;
  };

  let user: UserResponse | null = null;

  try {
    user = await getUserInformations(
      { sub: sub },
      { next: { tags: [`user-informations-${sub}`] } }
    );
  } catch (error) {
    console.error(error);
  }

  if (user) {
    redirect(`${auth0domain}/continue?state=${state}`);
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
