import { cn } from '@/lib/utils';

export default function StepsIndicator({
  steps,
  mealForm = true
}: {
  steps: number;
  mealForm?: boolean;
}) {
  return (
    <section className="flex flex-col gap-xl">
      <div className="flex w-full justify-center gap-sm">
        <div
          className={cn(
            `h-sm w-1/3 rounded-xs bg-primary duration-medium`,
            steps === 1 && 'pointer-events-none'
          )}
        ></div>
        <div
          className={cn(
            `relative h-sm w-1/3 overflow-hidden rounded-xs bg-secondary-100 duration-medium after:absolute after:left-0 after:top-0 after:h-full after:w-full after:-translate-x-full after:bg-primary-400 after:delay-300 after:duration-500 after:ease-out`,
            steps >= 2 ? 'after:translate-x-0' : '',
            steps === 2 && 'pointer-events-none'
          )}
        ></div>

        <div
          className={cn(
            `relative h-sm w-1/3 overflow-hidden rounded-xs bg-secondary-100 duration-medium after:absolute after:left-0 after:top-0 after:h-full after:w-full after:-translate-x-full after:bg-primary-400 after:delay-300 after:duration-500 after:ease-out`,
            steps >= 3 ? 'pointer-events-none after:translate-x-0' : ''
          )}
        ></div>
        {mealForm && (
          <div
            className={cn(
              `relative h-sm w-1/3 overflow-hidden rounded-xs bg-secondary-100 duration-medium after:absolute after:left-0 after:top-0 after:h-full after:w-full after:-translate-x-full after:bg-primary-400 after:delay-300 after:duration-500 after:ease-out`,
              steps === 4 ? 'pointer-events-none after:translate-x-0' : ''
            )}
          ></div>
        )}
      </div>
    </section>
  );
}
