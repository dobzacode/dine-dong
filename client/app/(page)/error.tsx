'use client';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLogger } from 'next-axiom';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({ error }: { error: Error & { digest?: string } }) {
  const log = useLogger();

  useEffect(() => {
    console.log(error?.digest);
    console.error(error);
    log.error(`Error: ${error?.digest}`, {
      message: `${error.message}`,
      digest: error?.digest
    });
  }, [error, log]);

  return (
    <main className="flex min-h-[calc(100vh-11.7rem)] flex-col items-center justify-center px-lg py-lg">
      <section className="flex flex-col items-center justify-center gap-md">
        <h1 className="display-xl">500</h1>
        <p className="body max-w-[400px] text-center">
          Oops, Une erreur inattendue s&apos;est produite lors du traitement de votre requête.
        </p>
        <Link className={cn(buttonVariants({ variant: 'default' }))} href="/">
          Retour à la page d&apos;accueil
        </Link>
      </section>
    </main>
  );
}
