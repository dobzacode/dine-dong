import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function NextPrev({
  setActiveStep,
  onNext,
  setIsBackward,
  activeStep,
  maxStep = 4,
  isPending,
  finalLabel = 'Ajouter le repas'
}: {
  setActiveStep: (num: number) => void;
  onNext: () => void;
  setIsBackward: (isBackward: boolean) => void;
  activeStep: number;
  maxStep?: number;
  isPending: boolean;
  finalLabel?: string;
  
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

      {activeStep === maxStep ? (
        <Button
          onClick={onNext}
          className={cn('flex w-1/2 rounded-l-none', isPending && 'pointer-events-none')}
          type="submit"
        >
          {finalLabel}
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
