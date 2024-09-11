import { cn, getUserInformations } from '@/lib/utils';
import { getSession } from '@auth0/nextjs-auth0';
import { buttonVariants } from '../button';
import UserMenu from './user-menu';

export default async function UserSection() {
  const session = await getSession();

  if (!session?.user?.sub) {
    return (
      <a className={cn(buttonVariants({ variant: 'outline' }))} href="/api/auth/login">
        Connexion
      </a>
    );
  }

  const user = await getUserInformations(
    { sub: session.user.sub as string },
    { next: { tags: [`user-informations-${session.user.sub}`] } }
  );

  return <UserMenu user={user} />;
}
