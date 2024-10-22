import { Skeleton } from '@/components/ui/skeleton';

export default function InformationsSectionSkeleton() {
  return (
    <div className="flex h-fit w-full justify-between">
      <section className="flex gap-lg">
        <Skeleton className="relative h-4xl w-4xl overflow-hidden rounded-md mobile-lg:h-6xl mobile-lg:w-6xl" />
        <div className="flex h-full flex-col justify-between gap-lg">
          <div className="flex flex-col gap-xs">
            <Skeleton className="relative h-lg w-6xl overflow-hidden rounded-xs tablet:h-xl tablet:w-8xl" />
            <Skeleton className="relative h-md w-4xl overflow-hidden rounded-xs tablet:h-lg" />
          </div>
          <div className="text-grayed flex flex-col gap-xs">
            <Skeleton className="relative h-md w-3xl overflow-hidden rounded-xs" />
            <Skeleton className="relative h-md w-5xl overflow-hidden rounded-xs" />
          </div>
        </div>
      </section>
      <Skeleton className="h-10 w-5xl rounded-md max-tablet:hidden" />
    </div>
  );
}
