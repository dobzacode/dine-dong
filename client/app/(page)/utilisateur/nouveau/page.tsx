import UserForm from '@/components/user/user-form';
import { verify } from 'jsonwebtoken';
import { redirect } from 'next/navigation';

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

  return (
    <section className="container mx-auto flex h-full max-w-[1200px] flex-col items-center justify-center pt-3xl">
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
