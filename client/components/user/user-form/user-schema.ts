import { addressSchema } from '@/components/meal/meal-form/meal-schema';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/components/settings/profil/profil-schema';
import { checkEmailAvailability, checkUsernameAvailability } from '@/lib/utils';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { isAlpha, isAlphanumeric, isEmail } from 'validator';
import { z } from 'zod';

export const firstStepSchema = z.object({
  email: z
    .string()
    .email("L'adresse email est invalide")
    .min(1, "L'adresse email est requise")
    .max(255, "L'adresse email ne doit pas dépasser 255 caractères")
    .refine(isEmail, "L'adresse email est invalide")
    .refine(async (email) => {
      if (email.trim()) {
        const isAvailable = await checkEmailAvailability(email);
        return isAvailable;
      } else {
        return true;
      }
    }, "L'adresse email est déjà prise"),
  username: z
    .string()
    .min(1, "Le nom d'utilisateur est requis")
    .max(35, "Le nom d'utilisateur ne doit pas dépasser 35 caractères")
    .refine(isAlphanumeric, "Le nom d'utilisateur ne doit contenir que des lettres et des chiffres")
    .refine(async (username) => {
      if (username.trim()) {
        const isAvailable = await checkUsernameAvailability(username);
        return isAvailable;
      } else {
        return true;
      }
    }, "Le nom d'utilisateur est déjà pris"),
  firstName: z
    .string()
    .max(35, 'Le prénom ne doit pas dépasser 35 caractères')
    .refine(
      (value) => (value === '' ? true : isAlpha(value)),
      'Le prénom ne doit contenir que des lettres'
    ),
  lastName: z
    .string()
    .max(35, 'Le nom ne doit pas dépasser 35 caractères')
    .refine(
      (value) => (value === '' ? true : isAlpha(value)),
      'Le prénom ne doit contenir que des lettres'
    ),
  aboutMe: z.string().max(256, 'Le texte ne doit pas dépasser 256 caractères'),
  phoneNumber: z
    .string()
    .refine(isValidPhoneNumber, { message: 'Le numéro de téléphone est invalide' })
    .or(z.literal('')),
  image: z
    .instanceof(File, { message: 'Une photo est requise' })
    .refine(
      (file: File) => {
        return !file || file.size <= MAX_FILE_SIZE;
      },
      `La taille du fichier ne doit pas dépasser ${MAX_FILE_SIZE / 1000000}Mo`
    )
    .refine(
      (file: File) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      'Seul les formats JPG, JPEG, PNG et WEBP sont acceptés'
    )
    .optional()
});

export const secondStepSchema = z.object({
  address: addressSchema
});

export const userSchema = z.object({
  stepOne: firstStepSchema,
  stepTwo: secondStepSchema
});

export type UserSchema = z.infer<typeof userSchema>;
