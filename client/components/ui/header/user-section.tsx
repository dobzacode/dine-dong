import { getUserInformations } from '@/lib/user/user-fetch';
import { cn } from '@/lib/utils';
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

  let user = null;
  try {
    user = await getUserInformations(
      { sub: session.user.sub as string },
      { next: { tags: [`user-informations-${session.user.sub}`] } }
    );
  } catch (error) {
    console.error(error);
  }

  if (!user || user instanceof Error) {
    return (
      <a className={cn(buttonVariants({ variant: 'outline' }))} href="/api/auth/login">
        Connexion
      </a>
    );
  }

  return <UserMenu user={user} />;
}
