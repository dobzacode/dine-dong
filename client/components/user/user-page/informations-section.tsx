import ImagePulsing from '@/components/ui/image-pulsing';
import Rating from '@/components/ui/rating';
import { getUserInformations } from '@/lib/user/user-fetch';
import { constructS3Url, getErrorMessage } from '@/lib/utils';
import { getSession } from '@auth0/nextjs-auth0';
import { MapPin } from 'lucide-react';
import { notFound } from 'next/navigation';
import ActionsWrapper from './actions-wrapper';

export default async function InformationsSection({ username }: { username: string }) {
  const session = await getSession();

  const user = await getUserInformations(
    { username: username },
    { next: { tags: [`user-informations-${username}`] } }
  );

  if (user instanceof Error) {
    const message = getErrorMessage(user);
    if (message.includes('404')) {
      return notFound();
    }
    throw new Error(`Error fetching user informations: ${message}`);
  }

  return (
    <div className="flex h-fit w-full justify-between">
      <section className="flex gap-lg">
        <div className="relative aspect-square h-4xl overflow-hidden rounded-md mobile-lg:h-6xl">
          <ImagePulsing
            key={`${user.user_sub}-avatar`}
            skeletoncss={'h-full w-full object-cover absolute object-center rounded-md'}
            priority
            fill
            src={constructS3Url(user.picture_key ?? '/static/default-avatar.png')}
            alt={`${user.username}'s avatar`}
            sizes={'(max-width: 768px) 20vw, 300px'}
            className="rounded-xs object-contain object-center"
          />
        </div>
        <div className="flex h-full flex-col justify-between gap-lg">
          <div className="flex flex-col">
            <h1 className="tablet:heading-h1 heading-h2 font-medium">{user.username}</h1>
            <Rating value={3.5} />
          </div>
          <div className="text-grayed flex flex-col gap-xs">
            <p className="body-sm">A propos :</p>
            <p className="body-sm flex items-center gap-xs">
              <MapPin size={12} />
              {user.residency.city}, {user.residency.country}
            </p>
          </div>
        </div>
      </section>
      <ActionsWrapper isUserPage={session?.user?.sub === user.user_sub} />
    </div>
  );
}
