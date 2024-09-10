import { addressSchema } from '@/components/meal/meal-form/meal-schema';
import { isAlpha } from 'validator';
import { z } from 'zod';

export const MAX_FILE_SIZE = 5000000;
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const profileSchema = z.object({
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
  image: z
    .union([
      z.string().url("URL de l'image invalide"),
      z
        .instanceof(File, { message: 'Une photo est requise' })
        .refine(
          (file: File) => !file || file.size <= MAX_FILE_SIZE,
          `La taille du fichier ne doit pas dépasser ${MAX_FILE_SIZE / 1000000}Mo`
        )
        .refine(
          (file: File) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
          'Seul les formats JPG, JPEG, PNG et WEBP sont acceptés'
        )
    ])
    .optional(),
  stepTwo: z.object({
    address: addressSchema
  })
});

export type ProfileSchema = z.infer<typeof profileSchema>;
