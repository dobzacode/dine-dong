import { getUserInformations } from '@/lib/user/user-fetch';
import { cn } from '@/lib/utils';
import { getSession } from '@auth0/nextjs-auth0';
import { Logger } from 'next-axiom';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Button, buttonVariants } from '../button';
import UserMenu from './user-menu';

export default async function UserSection() {
  const session = await getSession();
  const log = new Logger();

  if (!session?.user?.sub) {
    return (
      <>
        <a className={cn(buttonVariants({ variant: 'outline' }))} href="/api/auth/login">
          Connexion
        </a>
        <a
          className={cn(buttonVariants({ variant: 'default' }), 'max-mobile-lg:hidden')}
          href="/api/auth/login"
        >
          Vendre un repas
        </a>
      </>
    );
  }

  const user = await getUserInformations(
    { sub: session.user.sub as string },
    { next: { tags: [`user-informations-${session.user.sub}`] } }
  );

  if (!user) {
    return redirect('/api/auth/logout');
  }

  if (user instanceof Error) {
    log.error(`Error while fetching user informations: ${session.user.sub}`, user);
    await log.flush();
    return (
      <>
        <Button variant={'outline'} disabled={true}>
          Connexion
        </Button>
        <Button className="max-mobile-lg:hidden" variant={'default'} disabled={true}>
          Vendre un repas
        </Button>
      </>
    );
  }

  return (
    <>
      <UserMenu user={user} />
      <Link
        className={cn(buttonVariants({ variant: 'default' }), 'max-mobile-lg:hidden')}
        href="/nouveau/repas"
      >
        Vendre un repas
      </Link>
    </>
  );
}
