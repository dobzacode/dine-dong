import { type HomeResponse } from '@/types/query';

export default async function Home() {
  const res = await fetch('http://localhost:3000/api/home');
  const data = (await res.json()) as HomeResponse;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <p>{data.message}</p>
    </main>
  );
}
