import { type HomeResponse } from '@/types/query';
import { getSession } from '@auth0/nextjs-auth0';

export default async function Home() {
  const res = await fetch('http://localhost:8080/api/public');
  const data = (await res.json()) as HomeResponse;
  const session = await getSession();

  const user = session?.user;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <p>{data.message}</p>
      <p>User: {user?.name}</p>
      <a href="/api/auth/login">Login</a>
    </main>
  );
}
