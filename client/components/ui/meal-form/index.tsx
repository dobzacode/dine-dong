'use client';

import {
  ComingFromLeftVariantWithFadeExit,
  ComingFromRightVariantWithFadeExit
} from '@/components/framer/div-variants';
import DivWrapper from '@/components/framer/div-wrapper';
import { customRevalidateTag } from '@/lib/actions';
import { cn } from '@/lib/utils';
import type { MealResponse } from '@/types/query';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import moment from 'moment';
import { useS3Upload } from 'next-s3-upload';
import { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useToast } from '../use-toast';
import { mealSchema, type MealSchema } from './meal-schema';
import NextPrev from './next-prev';
import StepsIndicator from './steps-indicator';
import WizardFinalStep from './wizard-final-step';
import WizardStepOne from './wizard-step-one';
import WizardStepThree from './wizard-step-three';
import WizardStepTwo from './wizard-step-two';

const createMealMutation = async ({
  data,
  uploadToS3
}: {
  data: MealSchema;
  uploadToS3: (
    file: File,
    options: { endpoint: { request: { url: string; headers?: Record<string, string> } } }
  ) => Promise<{
    url: string;
    key: string;
  }>;
}) => {
  const { key } = await uploadToS3(data.stepOne.image, {
    endpoint: {
      request: {
        url: 'http://localhost:3000/api/s3-upload/?folder=meal/original_images'
      }
    }
  });

  const response = await fetch('http://localhost:3000/api/protected/meals', {
    method: 'POST',
    body: JSON.stringify({
      name: data.stepOne.name,
      price: data.stepOne.price,
      cooking_date: data.stepOne.cookingDate,
      expiration_date: data.stepOne.expirationDate,
      picture_url: `${process.env.NEXT_PUBLIC_CLOUDFRONT_BUCKET_URL}/${key}`,
      weight: data.stepTwo.weight,
      diet: data.stepTwo.diet,
      ingredients: data.stepTwo.ingredients,
      additional_information: data.stepTwo.additionalInformation,
      address: {
        ...data.stepThree.address,
        formatted_address: data.stepThree.address.formattedAddress,
        postal_code: data.stepThree.address.postalCode
      },
      payment_method: data.stepThree.paymentMethod
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    throw new Error();
  }
  const dataResponse = (await response.json()) as MealResponse;
  customRevalidateTag('search-meals');
  return dataResponse;
};

export default function MealForm() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [addressMessage, setAddressMessage] = useState<string>('');

  const { toast } = useToast();
  const { uploadToS3 } = useS3Upload();
  const { isPending, mutateAsync } = useMutation({
    mutationFn: createMealMutation,
    onSuccess: (data: MealResponse) => {
      console.log('Meal created successfully:', data);
      toast({
        title: `Votre nouveau repas ${data.name} a bien été créé`,
        description: 'Vous pouvez le consulter dans votre tableau de bord',
        className: ' bottom-0 right-0 w-fit ml-auto',
        duration: 5000
      });
    },
    onError: (error: unknown) => {
      console.error('Error creating meal:', error);
      toast({
        title: 'Une erreur est survenue lors de la création du repas',
        description: 'Veuillez réessayer ultérieurement',

        duration: 5000
      });
    }
  });

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
        paymentMethod: 'ONLINE'
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

  const onSubmit = async (data: MealSchema) => {
    await mutateAsync({ data, uploadToS3 });
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
        className={cn(
          'section-px container mx-auto flex flex-col gap-xl laptop:max-w-[800px]',
          isPending && 'pointer-events-none'
        )}
        onSubmit={handleSubmit(onSubmit)}
      >
        <DivWrapper variant={ComingFromLeftVariantWithFadeExit}>
          <StepsIndicator setSteps={setActiveStep} steps={activeStep} />
        </DivWrapper>

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
              <WizardStepOne className={isPending ? 'animate-pulse' : ''} />
              <NextPrev
                isPending={isPending}
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
              <WizardStepTwo className={isPending ? 'animate-pulse' : ''} />
              <NextPrev
                isPending={isPending}
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
                className={isPending ? 'animate-pulse' : ''}
                addressMessage={addressMessage}
                setAddressMessage={setAddressMessage}
              />
              <NextPrev
                isPending={isPending}
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
              <WizardFinalStep className={isPending ? 'animate-pulse' : ''} />
              <NextPrev
                isPending={isPending}
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
