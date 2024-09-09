import ImagePulsing from '@/components/ui/image-pulsing';
import Rating from '@/components/ui/rating';
import { UserResponse } from '@/types/query';
import { MapPin } from 'lucide-react';

export default function InformationsSection({ user }: { user: UserResponse }) {
  return (
    <section className="flex h-7xl gap-lg">
      <div className="relative aspect-square h-full max-h-7xl overflow-hidden rounded-xs">
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
      <div className="flex h-full flex-col justify-between">
        <div className="flex flex-col">
          <h1 className="heading-h1 font-medium">{user.username}</h1>
          <Rating value={3.5} />
        </div>
        <div className="text-grayed flex flex-col gap-xs">
          <p className="body-sm">A propos :</p>
          <p className="body flex items-center gap-xs">
            <MapPin size={16} />
            {user.residency.city} {user.residency.country}
          </p>
        </div>
      </div>
    </section>
  );
}
