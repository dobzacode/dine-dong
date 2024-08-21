'use client';

import {
  ComingFromLeftVariantWithFadeExit,
  ComingFromRightVariantWithFadeExit
} from '@/components/framer/div-variants';
import DivWrapper from '@/components/framer/div-wrapper';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence } from 'framer-motion';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Button } from '../button';
import { mealSchema, type MealSchema } from './meal-schema';
import StepsIndicator from './steps-indicator';
import WizardFinalStep from './wizard-final-step';
import WizardStepOne from './wizard-step-one';
import WizardStepThree from './wizard-step-three';
import WizardStepTwo from './wizard-step-two';

function NextPrev({
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

export default function MealForm() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [addressMessage, setAddressMessage] = useState<string>('');
  const methods = useForm<MealSchema>({
    shouldUnregister: false,
    mode: 'onChange',
    resolver: zodResolver(mealSchema),
    defaultValues: {
      stepOne: {
        name: '',
        cookingDate: moment().toDate(),
        expirationDate: moment().add(1, 'day').toDate(),
        image: undefined
      },
      stepTwo: {
        diet: [],

        ingredients: [
          {
            name: '',
            quantity: undefined,
            unit: undefined
          }
        ]
      },
      stepThree: {
        address: {
          address1: '',
          address2: '',
          formattedAddress: '',
          city: '',
          department: '',
          postalCode: '',
          country: '',
          lat: 0,
          lng: 0
        },
        paymentMethod: 'online'
      }
    }
  });
  const { handleSubmit } = methods;
  const [isBackward, setIsBackward] = useState<boolean>(false);

  const checkIfStepIsValid = useCallback(
    async (actualStep: number): Promise<boolean> => {
      let isValid: boolean;
      switch (actualStep) {
        case 1:
          isValid = await methods.trigger('stepOne');
          break;
        case 2:
          isValid = await methods.trigger('stepTwo');
          break;
        case 3:
          isValid = await methods.trigger('stepThree');
          break;
        default:
          isValid = true;
      }
      return isValid;
    },
    [methods]
  );

  const onSubmit = (data: MealSchema) => {
    console.log(data);
  };

  const onNext = useCallback(() => {
    checkIfStepIsValid(activeStep)
      .then((isValid) => {
        if (isValid) {
          setIsBackward(false);
          setActiveStep(Math.min(activeStep + 1, 4));
        } else if (activeStep === 3) {
          setAddressMessage('Une adresse est requise');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [activeStep, checkIfStepIsValid]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        onNext();
      } else if (event.key === 'ArrowLeft') {
        setIsBackward(true);
        setActiveStep(Math.max(activeStep - 1, 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeStep, methods, onNext]);

  const switcher: Record<number, string> = {
    1: 'Informations générales',
    2: 'Composition du plat',
    3: 'Retrait et paiement',
    4: 'Récapitulatif et confirmation'
  };

  return (
    <FormProvider {...methods}>
      <form
        className="section-px container mx-auto flex flex-col gap-xl laptop:max-w-[800px]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <StepsIndicator setSteps={setActiveStep} steps={activeStep} />

        <AnimatePresence mode="wait">
          <DivWrapper
            variant={
              isBackward ? ComingFromRightVariantWithFadeExit : ComingFromLeftVariantWithFadeExit
            }
            inverseOnExit
            tag="h2"
            key={`step-${activeStep}-title`}
            className="heading-h1 font-semibold text-primary-container-fg"
          >
            {switcher[activeStep]}
          </DivWrapper>
          {activeStep === 1 && (
            <DivWrapper
              className="flex flex-col gap-xl"
              variant={
                isBackward ? ComingFromRightVariantWithFadeExit : ComingFromLeftVariantWithFadeExit
              }
              inverseOnExit
              key={`step-one-${activeStep}`}
            >
              <WizardStepOne />
              <NextPrev
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                onNext={onNext}
                setIsBackward={setIsBackward}
              />
            </DivWrapper>
          )}
          {activeStep === 2 && (
            <DivWrapper
              inverseOnExit
              className="flex flex-col gap-xl"
              variant={
                isBackward ? ComingFromRightVariantWithFadeExit : ComingFromLeftVariantWithFadeExit
              }
              key={`step-two-${activeStep}`}
            >
              <WizardStepTwo />
              <NextPrev
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                onNext={onNext}
                setIsBackward={setIsBackward}
              />
            </DivWrapper>
          )}
          {activeStep === 3 && (
            <DivWrapper
              inverseOnExit
              className="flex flex-col gap-xl"
              variant={
                isBackward ? ComingFromRightVariantWithFadeExit : ComingFromLeftVariantWithFadeExit
              }
              key={`step-three-${activeStep}`}
            >
              <WizardStepThree
                addressMessage={addressMessage}
                setAddressMessage={setAddressMessage}
              />
              <NextPrev
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                onNext={onNext}
                setIsBackward={setIsBackward}
              />
            </DivWrapper>
          )}
          {activeStep === 4 && (
            <DivWrapper
              inverseOnExit
              className="flex flex-col gap-xl"
              variant={
                isBackward ? ComingFromRightVariantWithFadeExit : ComingFromLeftVariantWithFadeExit
              }
              key={`step-four-${activeStep}`}
            >
              <WizardFinalStep />
              <NextPrev
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                onNext={onNext}
                setIsBackward={setIsBackward}
              />
            </DivWrapper>
          )}
        </AnimatePresence>
      </form>
    </FormProvider>
  );
}
