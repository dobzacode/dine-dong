import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <section className="section-px container mx-auto flex h-full flex-col justify-center gap-xl pt-3xl laptop-sm:max-w-[800px]">
      <div className="flex w-full justify-center gap-sm">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-1/3 rounded-full" />
        ))}
      </div>
      <Skeleton className="h-10 w-2/3 rounded" />
      <div className={'flex w-full flex-col gap-md text-primary-container-fg'}>
        <div className="flex w-full gap-md max-mobile-sm:flex-col">
          <div className="flex w-1/2 flex-col max-mobile-sm:w-full">
            <Skeleton className="mb-2 h-4 w-1/3 rounded" />
            <Skeleton className="h-10 rounded" />
          </div>
          <div className="flex w-1/2 flex-col max-mobile-sm:w-full">
            <Skeleton className="mb-2 h-4 w-1/3 rounded" />
            <Skeleton className="h-10 rounded" />
          </div>
        </div>
        <div className="flex w-full justify-between gap-md max-mobile-sm:flex-col">
          <div className="flex w-1/2 flex-col max-mobile-sm:w-full">
            <Skeleton className="mb-2 h-4 w-1/3 rounded" />
            <Skeleton className="mb-2 h-10 rounded" />
          </div>
          <div className="flex w-1/2 flex-col max-mobile-sm:w-full">
            <Skeleton className="mb-2 h-4 w-1/3 rounded" />
            <Skeleton className="mb-2 h-10 rounded" />
          </div>
        </div>
        <div className="flex w-full flex-col">
          <Skeleton className="mb-2 h-4 w-1/3 rounded" />
          <Skeleton className="mb-2 h-28 w-full rounded" />
        </div>
        <div className="flex w-full justify-between gap-md max-mobile:flex-col-reverse">
          <div className="flex w-full flex-col">
            <Skeleton className="mb-2 h-4 w-1/3 rounded" />
            <Skeleton className="h-40 rounded" />
          </div>
          <div className="flex w-full flex-col">
            <Skeleton className="mb-2 h-4 w-1/3 rounded" />
            <Skeleton className="mb-2 h-10 rounded" />
          </div>
        </div>
      </div>
    </section>
  );
}
