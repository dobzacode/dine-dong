import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getSession } from '@auth0/nextjs-auth0';
import { Pencil } from 'lucide-react';
import Link from 'next/link';

export default async function ActionsWrapper({ sub }: { sub: string }) {
  const session = await getSession();

  return session?.user?.sub === sub ? (
    <Link
      className={cn(buttonVariants({ variant: 'outline' }), 'flex w-fit gap-sm')}
      href="/parametres/profil"
    >
      <Pencil size={16} />
      Modifier mon profil
    </Link>
  ) : (
    <Link href="/connexion">Connexion</Link>
  );
}
