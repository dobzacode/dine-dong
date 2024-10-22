import ImagePulsing from '@/components/ui/image-pulsing';
import Rating from '@/components/ui/rating';
import { constructS3Url } from '@/lib/utils';
import { type UserResponse } from '@/types/query';
import { MapPin } from 'lucide-react';

export default function InformationsSection({ user }: { user: UserResponse }) {
  return (
    <section className="flex h-7xl gap-lg">
      <div className="relative aspect-square h-full max-h-7xl overflow-hidden rounded-xs">
        <ImagePulsing
          key={`${user.user_sub}-avatar`}
          skeletoncss={'h-full w-full object-cover absolute object-center rounded-xs'}
          priority
          fill
          src={constructS3Url(user.picture_key ?? '/static/default-avatar.png')}
          alt={`${user.username}'s avatar`}
          sizes={'(max-width: 768px) 20vw, 300px'}
          className="rounded-xs object-contain object-center"
        />
      </div>
      <div className="flex h-full flex-col justify-between">
        <div className="flex flex-col">
          <h1 className="heading-h1 font-medium">{user.username}</h1>
          <Rating value={3.5} />
        </div>
        <div className="text-grayed flex flex-col gap-xs">
          <p className="body-sm">A propos :</p>
          <p className="body flex items-center gap-xs">
            <MapPin size={16} />
            {user.residency.city}, {user.residency.country}
          </p>
        </div>
      </div>
    </section>
  );
}
