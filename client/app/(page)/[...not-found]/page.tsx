import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export const metadata = {
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
};

export default async function NotFound() {
  return (
    <main className="flex min-h-[calc(100vh-11.7rem)] flex-col items-center justify-center px-lg py-lg">
      <section className="flex flex-col items-center justify-center gap-md">
        <h1 className="display-xl font-bold">404</h1>
        <p className="body max-w-[400px] text-center">
          La page que vous recherchez n&apos;existe pas. Veuillez vérifier l&apos;URL ou revenir à
          la page d&apos;accueil.
        </p>
        <Link className={cn(buttonVariants({ variant: 'default' }))} href="/">
          Retour à la page d&apos;accueil
        </Link>
      </section>
    </main>
  );
}
