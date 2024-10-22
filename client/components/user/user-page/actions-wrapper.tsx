import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Pencil } from 'lucide-react';
import Link from 'next/link';

export default async function ActionsWrapper({ isUserPage }: { isUserPage: boolean }) {
  return isUserPage ? (
    <Link
      className={cn(buttonVariants({ variant: 'outline' }), 'flex w-fit gap-sm max-tablet:hidden')}
      href="/parametres/profil"
    >
      <Pencil size={16} className="shrink-0" />
      <span className="max-tablet:hidden">Modifier</span>
    </Link>
  ) : (
    <></>
  );
}
