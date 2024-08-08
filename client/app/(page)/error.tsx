'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[calc(100vh-11.7rem)] flex-col items-center justify-center px-lg py-lg">
      <section className="flex flex-col items-center justify-center gap-md">
        <h1 className="display-xl">500</h1>
        <p className="body max-w-[400px] text-center">
          Oops, une erreur est survenue. Veuillez vérifier l&apos;URL ou revenir à la page
          d&apos;accueil.
        </p>
        <Button asChild>
          <Link href="/">Retour à la page d&apos;accueil</Link>
        </Button>
      </section>
    </main>
  );
}
