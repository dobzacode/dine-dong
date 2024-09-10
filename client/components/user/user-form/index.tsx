'use client';

import {
  ComingFromLeftVariantWithFadeExit,
  ComingFromRightVariantWithFadeExit
} from '@/components/framer/div-variants';
import DivWrapper from '@/components/framer/div-wrapper';
import { customRevalidateTag } from '@/lib/actions';
import { cn } from '@/lib/utils';
import type { UserResponse } from '@/types/query';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { useS3Upload } from 'next-s3-upload';
import { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import NextPrev from '../../ui/next-prev';
import StepsIndicator from '../../ui/steps-indicator';

import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { userSchema, type UserSchema } from './user-schema';
import WizardFinalStep from './wizard-final-step';
import WizardStepOne from './wizard-step-one';
import WizardStepTwo from './wizard-step-two';

const createUserMutation = async ({
  data,
  uploadToS3,
  sub
}: {
  data: UserSchema;
  uploadToS3: (
    file: File,
    options: { endpoint: { request: { url: string; headers?: Record<string, string> } } }
  ) => Promise<{
    url: string;
    key: string;
  }>;
  sub: string | null;
}) => {
  if (!sub) {
    throw new Error('Sub is required');
  }

  let picturekey: string | null = null;

  if (data.stepOne.image) {
    const { key } = await uploadToS3(data.stepOne.image, {
      endpoint: {
        request: {
          url: 'http://localhost:3000/api/s3-upload/?folder=user/original_images'
        }
      }
    });
    picturekey = key;
  }

  const response = await fetch('http://localhost:3000/api/users', {
    method: 'POST',
    body: JSON.stringify({
      email: data.stepOne.email,
      username: data.stepOne.username,
      first_name: data.stepOne.firstName,
      last_name: data.stepOne.lastName,
      about_me: data.stepOne.aboutMe,
      phone_number: data.stepOne.phoneNumber,
      sub: sub,
      picture_url: picturekey
        ? `${process.env.NEXT_PUBLIC_CLOUDFRONT_BUCKET_URL}/${picturekey}`
        : undefined,
      address: {
        ...data.stepTwo.address,
        formatted_address: data.stepTwo.address.formattedAddress,
        postal_code: data.stepTwo.address.postalCode
      }
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    const error = (await response.json()) as { detail: string };
    console.log(error);
    throw new Error(error.detail);
  }
  const dataResponse = (await response.json()) as UserResponse;
  customRevalidateTag('get-user-params');
  return dataResponse;
};

type UserFormProps = {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  sub: string;
  state: string;
  auth0domain: string;
};

export default function UserForm(props: UserFormProps) {
  const { email, username, firstName, lastName, sub, state, auth0domain } = props;
  const [activeStep, setActiveStep] = useState<number>(1);
  const [addressMessage, setAddressMessage] = useState<string>('');

  const router = useRouter();

  const { toast } = useToast();
  const { uploadToS3 } = useS3Upload();
  const { isPending, mutateAsync } = useMutation({
    mutationFn: createUserMutation,
    onSuccess: (data: UserResponse) => {
      console.log('User created successfully:', data);
      toast({
        title: `Votre compte a été créé avec succès !`,
        description: 'Vous pouvez le consulter dans votre tableau de bord',
        className: ' bottom-0 right-0 w-fit ml-auto',
        duration: 5000
      });
      return router.push(`${auth0domain}/continue?state=${state}`);
    },
    onError: (error: unknown) => {
      console.error('Error creating user:', error);
      toast({
        title: 'Une erreur est survenue lors de la création de votre compte',
        description: 'Veuillez réessayer ultérieurement',

        duration: 5000
      });
    }
  });

  const methods = useForm<UserSchema>({
    shouldUnregister: false,
    mode: 'onChange',
    resolver: zodResolver(userSchema),
    defaultValues: {
      stepOne: {
        email: email,
        username: username,
        firstName: firstName ?? '',
        lastName: lastName ?? '',
        aboutMe: '',
        phoneNumber: '',
        image: undefined
      },
      stepTwo: {
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
        }
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
        default:
          isValid = true;
      }
      return isValid;
    },
    [methods]
  );

  const onSubmit = async (data: UserSchema) => {
    await mutateAsync({ data, uploadToS3, sub });
  };

  const onNext = useCallback(() => {
    checkIfStepIsValid(activeStep)
      .then((isValid) => {
        if (isValid) {
          setIsBackward(false);
          setActiveStep(Math.min(activeStep + 1, 3));
        } else if (activeStep === 2) {
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
    2: 'Addresse principale',
    3: 'Récapitulatif et confirmation'
  };

  return (
    <FormProvider {...methods}>
      <form
        className={cn(
          'section-px container mx-auto flex flex-col gap-xl laptop-sm:max-w-[800px]',
          isPending && 'pointer-events-none'
        )}
        onSubmit={handleSubmit(onSubmit)}
      >
        <DivWrapper variant={ComingFromLeftVariantWithFadeExit}>
          <StepsIndicator mealForm={false} steps={activeStep} />
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
              key={`step-three-${activeStep}`}
            >
              <WizardStepTwo
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

          {activeStep === 3 && (
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
                maxStep={3}
                finalLabel="Créer mon compte"
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
