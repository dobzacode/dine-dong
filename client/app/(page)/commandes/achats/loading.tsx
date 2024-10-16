import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="mx-auto flex w-full flex-col gap-md">
      <Skeleton className="h-[48rem] w-full rounded-md" />
    </div>
  );
}
