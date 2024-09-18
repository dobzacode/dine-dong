import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <section className="section-px shadow-primary-40 section-py container flex flex-col justify-center gap-sm tablet:flex-row laptop-sm:max-w-[1000px]">
      <div className="relative flex aspect-square w-full flex-col gap-sm rounded-xs tablet:w-2/3">
        <section className="card flex h-fit flex-col gap-md p-md">
          <Skeleton className="h-4 w-24" />

          <div className="flex w-full items-center justify-between">
            <div className="flex gap-xs">
              <Skeleton className="h-3xl w-3xl" />
              <div className="flex flex-col gap-sm">
                <Skeleton className="h-4 w-44" />
                <Skeleton className="h-3 w-4/5" />
              </div>
            </div>
            <Skeleton className="h-4 w-8" />
          </div>
        </section>
        <section className="card flex h-fit flex-col gap-md p-md">
          <Skeleton className="h-4 w-32" />

          <div className="flex w-full flex-col gap-sm">
            <Skeleton className="h-4 w-44" />
            <Skeleton className="aspect-square w-full rounded-xs" />
          </div>
        </section>
      </div>
      <aside className="flex min-w-fit flex-col gap-sm tablet:w-1/3">
        <section className="card flex h-fit flex-col gap-md p-md">
          <div className="flex flex-col gap-xs">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-4/5" />
          </div>
          <Separator />
          <div className="flex w-full gap-sm">
            <div className="flex w-1/2 flex-col gap-xs">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-4/5" />
            </div>
            <div className="flex w-1/2 flex-col gap-xs">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-4/5" />
            </div>
          </div>

          <Separator />
          <div className="flex flex-col gap-xs">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-4/5" />
          </div>
        </section>
        <section className="card flex h-fit flex-col gap-lg p-md">
          <Skeleton className="h-4 w-36" />

          <div className="flex flex-col gap-sm">
            <div className="flex w-full justify-between gap-xs">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-7" />
            </div>
            <div className="flex w-full justify-between gap-xs">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-7" />
            </div>
          </div>
          <div className="flex w-full justify-between gap-xs">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-7" />
          </div>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="mx-auto h-4 w-[90%]" />
        </section>
      </aside>
    </section>
  );
}
