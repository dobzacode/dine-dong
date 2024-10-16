import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="laptop-sm:section-px container mx-auto flex w-full flex-col gap-md">
      <Skeleton className="h-48 w-full rounded-md max-tablet:h-72" />
      <Skeleton className="h-10 w-full rounded-md" />
    </div>
  );
}
