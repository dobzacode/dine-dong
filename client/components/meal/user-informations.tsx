import { getUserInformations } from '@/lib/utils';
import Link from 'next/link';
import ImagePulsing from '../ui/image-pulsing';
import Rating from '../ui/rating';

export async function UserInformations({ id }: { id: string }) {
  const user = await getUserInformations({ id }, { tags: [`user-informations-${id}`] });

  if (!user || user instanceof Error) {
    return null;
  }

  return (
    <section className="flex h-fit items-center gap-md rounded-xs border bg-background p-md">
      <Link
        href={`/utilisateur/${user.username}`}
        className="relative h-3xl w-3xl overflow-hidden rounded-xs"
      >
        <ImagePulsing
          skeletoncss={'h-full w-full object-cover absolute object-center rounded-xs'}
          priority
          fill
          src={user.picture_url ?? '/placeholder.jpg'}
          alt={'user.name'}
          sizes={'(max-width: 768px) 100vw, 200px'}
          className="rounded-xs object-cover object-center"
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
