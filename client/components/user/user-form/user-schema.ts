import { checkEmailAvailability, checkUsernameAvailability } from '@/lib/utils';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { isAlphanumeric } from 'validator';
import { z } from 'zod';

export const MAX_FILE_SIZE = 5000000;
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const firstStepSchema = z.object({
  email: z
    .string()
    .email("L'adresse email est invalide")
    .min(1, "L'adresse email est requise")
    .max(255, "L'adresse email ne doit pas dépasser 255 caractères")
    .refine(async (email) => {
      if (email.trim()) {
        const isAvailable = await checkEmailAvailability(email);
        return isAvailable;
      } else {
        return true;
      }
    }, "Le nom d'utilisateur est déjà pris"),
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
    }, "L'adresse email est déjà prise"),
  firstName: z
    .string()
    .max(35, 'Le prénom ne doit pas dépasser 35 caractères')
    .refine(
      (value) => (value === '' ? true : isAlphanumeric(value)),
      'Le prénom ne doit contenir que des lettres et des chiffres'
    ),
  lastName: z
    .string()
    .max(35, 'Le nom ne doit pas dépasser 35 caractères')
    .refine(
      (value) => (value === '' ? true : isAlphanumeric(value)),
      'Le prénom ne doit contenir que des lettres et des chiffres'
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

export const addressSchema = z.object({
  address1: z
    .string()
    .min(1, "La ligne d'adresse 1 est obligatoire")
    .max(150, "La ligne d'adresse 1 ne doit pas dépasser 150 caractères"),
  address2: z.string(),
  formattedAddress: z.string(),
  city: z
    .string()
    .min(1, 'La ville est obligatoire')
    .max(50, 'La ville ne doit pas dépasser 50 caractères'),
  department: z.string().max(50, 'Le département ne doit pas dépasser 50 caractères').optional(),
  postalCode: z.string().max(5, 'Le code postal ne doit pas dépasser 5 caractères').optional(),
  country: z.string().max(50, 'Le pays ne doit pas dépasser 50 caractères'),
  lat: z.number(),
  lng: z.number()
});

export const secondStepSchema = z.object({
  address: addressSchema
});

export const userSchema = z.object({
  stepOne: firstStepSchema,
  stepTwo: secondStepSchema
});

export type UserSchema = z.infer<typeof userSchema>;
