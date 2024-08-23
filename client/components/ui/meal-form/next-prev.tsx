import { cn } from '@/lib/utils';
import { Button } from '../button';

export default function NextPrev({
  setActiveStep,
  onNext,
  setIsBackward,
  activeStep,
  isPending
}: {
  setActiveStep: (num: number) => void;
  onNext: () => void;
  setIsBackward: (isBackward: boolean) => void;
  activeStep: number;
  isPending: boolean;
}) {
  return (
    <div className={cn('flex w-full gap-xs', isPending && 'animate-pulse')}>
      <Button
        onClick={() => {
          setIsBackward(true);
          setActiveStep(activeStep - 1);
        }}
        className={cn(
          `flex w-1/2 rounded-r-none`,
          activeStep === 1 && 'pointer-events-none bg-opacity-50',
          isPending && 'pointer-events-none'
        )}
        variant={'secondary'}
        type="button"
      >
        Précédent
      </Button>

      {activeStep === 4 ? (
        <Button
          onClick={onNext}
          className={cn('flex w-1/2 rounded-l-none', isPending && 'pointer-events-none')}
          type="submit"
        >
          Ajouter le repas
        </Button>
      ) : (
        <Button
          onClick={onNext}
          className={cn('flex w-1/2 rounded-l-none', isPending && 'pointer-events-none')}
          type="button"
        >
          Suivant
        </Button>
      )}
    </div>
  );
}
