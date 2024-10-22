import { getUserInformations } from '@/lib/user/user-fetch';
import { cn, constructS3Url, getErrorMessage } from '@/lib/utils';
import { Logger } from 'next-axiom';
import Link from 'next/link';
import ImagePulsing from '../ui/image-pulsing';
import Rating from '../ui/rating';

export async function UserInformations({
  userSub,
  className,
  isOrderPage = false
}: {
  userSub: string;
  className?: string;
  isOrderPage?: boolean;
}) {
  const log = new Logger();
  let user = null;
  try {
    user = await getUserInformations(
      { sub: userSub },
      { next: { tags: [`user-informations-${userSub}`] } }
    );
  } catch (error) {
    const message = getErrorMessage(error);
    console.log(message);
  }

  if (!user || user instanceof Error) {
    log.error(`Error fetching user informations`, {
      error: user,
      userSub
    });
    await log.flush();
    return null;
  }

  return (
    <section className={cn('card flex h-fit items-center gap-md p-md', className)}>
      <Link
        href={`/utilisateur/${user.username}`}
        className="relative h-3xl w-3xl shrink-0 overflow-hidden rounded-xs"
      >
        <ImagePulsing
          skeletoncss={'h-full w-full object-cover absolute object-center rounded-xs'}
          fill
          src={constructS3Url(user.picture_key ?? '/static/default-avatar.png')}
          alt={'user.name'}
          sizes={'(max-width: 768px) 100vw, 200px'}
          className="rounded-xs object-contain"
        />
      </Link>
      <div className="flex flex-col">
        <Link
          href={`/utilisateur/${user.username}`}
          className={cn('body font-medium', isOrderPage && 'body-sm font-normal')}
        >
          {user.username}
        </Link>
        {!isOrderPage ? (
          <Rating value={3.5} />
        ) : (
          <p className="body-sm text-ellipsis break-words">{user.email}</p>
        )}
      </div>
    </section>
  );
}
