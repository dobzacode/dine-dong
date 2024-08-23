import { cn } from "@/lib/utils";
import { Button } from "../button";

export default function NextPrev({
    setActiveStep,
    onNext,
    setIsBackward,
    activeStep
  }: {
    setActiveStep: (num: number) => void;
    onNext: () => void;
    setIsBackward: (isBackward: boolean) => void;
    activeStep: number;
  }) {
    return (
      <div className="flex w-full gap-xs">
        <Button
          onClick={() => {
            setIsBackward(true);
            setActiveStep(activeStep - 1);
          }}
          className={cn(
            `flex w-1/2 rounded-r-none`,
            activeStep === 1 && 'pointer-events-none bg-opacity-50'
          )}
          variant={'secondary'}
          type="button"
        >
          Précédent
        </Button>
  
        {activeStep === 4 ? (
          <Button onClick={onNext} className="flex w-1/2 rounded-l-none" type="submit">
            Ajouter le repas
          </Button>
        ) : (
          <Button onClick={onNext} className="flex w-1/2 rounded-l-none" type="button">
            Suivant
          </Button>
        )}
      </div>
    );
  }