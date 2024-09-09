import { getUserInformations } from '@/lib/utils';
import ImagePulsing from '../ui/image-pulsing';
import Rating from '../ui/rating';

export async function UserInformations({ id }: { id: string }) {
  const user = await getUserInformations({ id }, { tags: [`user-informations-${id}`] });

  if (!user || user instanceof Error) {
    return null;
  }

  return (
    <section className="flex h-fit items-center gap-md rounded-xs border bg-background p-md">
      <div className="relative h-3xl w-3xl overflow-hidden rounded-xs">
        <ImagePulsing
          skeletoncss={'h-full w-full object-cover absolute object-center rounded-xs'}
          priority
          fill
          src={user.picture_url ?? '/placeholder.jpg'}
          alt={'user.name'}
          sizes={'(max-width: 768px) 100vw, 200px'}
          className="rounded-xs object-cover object-center"
        />
      </div>
      <div className="flex flex-col">
        <p className="body font-medium">Lorem ipsum</p>
        <Rating value={3.5} />
      </div>
    </section>
  );
}
