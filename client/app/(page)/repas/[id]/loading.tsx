import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <section className="section-px shadow-primary-40 section-py container flex flex-col justify-center gap-sm tablet:flex-row">
      <div className="relative aspect-square w-full rounded-xs tablet:w-2/3">
        <Skeleton className="absolute h-full w-full rounded-xs object-cover object-center" />
      </div>
      <div className="flex flex-col gap-sm">
        <section className="card flex h-fit items-center gap-md p-md">
          <div className="relative h-3xl w-3xl overflow-hidden rounded-xs">
            <Skeleton className="absolute h-full w-full rounded-xs object-cover object-center" />
          </div>
          <div className="flex flex-col gap-xs">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-28" />
          </div>
        </section>
        <section className="card flex h-fit flex-col gap-md p-md">
          <div className="flex flex-col gap-xs">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="w-30 h-4 rounded-full" />
          </div>
          <Separator />
          <div className="flex flex-col gap-xs">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-4/5" />
          </div>
          <Separator />
          <div className="flex flex-col gap-xs">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-3/5" />
            <Skeleton className="mt-sm h-3 w-full" />
          </div>
          <Separator />
          <div className="flex flex-col gap-xs">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-3/5" />
            <Skeleton className="mt-sm h-3 w-full" />
            <Skeleton className="my-sm aspect-square w-full" />
          </div>
        </section>
      </div>
    </section>
  );
}
