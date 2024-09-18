import { getUserInformations } from '@/lib/user/user-fetch';
import { constructS3Url, getErrorMessage } from '@/lib/utils';
import Link from 'next/link';
import ImagePulsing from '../ui/image-pulsing';
import Rating from '../ui/rating';

export async function UserInformations({ id }: { id: string }) {
  let user = null;
  try {
    user = await getUserInformations({ id }, { next: { tags: [`user-informations-${id}`] } });
  } catch (error) {
    const message = getErrorMessage(error);
    console.log(message);
  }

  if (!user || user instanceof Error) {
    return null;
  }

  return (
    <section className="card flex h-fit items-center gap-md p-md">
      <Link
        href={`/utilisateur/${user.username}`}
        className="relative h-3xl w-3xl overflow-hidden rounded-xs"
      >
        <ImagePulsing
          skeletoncss={'h-full w-full object-cover absolute object-center rounded-xs'}
          priority
          fill
          src={constructS3Url(user.picture_key ?? 'static/default-avatar.png')}
          alt={'user.name'}
          sizes={'(max-width: 768px) 100vw, 200px'}
          className="rounded-xs object-contain"
        />
      </Link>
      <div className="flex flex-col">
        <Link href={`/utilisateur/${user.username}`} className="body font-medium">
          {user.username}
        </Link>
        <Rating value={3.5} />
      </div>
    </section>
  );
}
