import { checkEmailAvailability, checkUsernameAvailability } from '@/lib/user/user-fetch';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { isAlphanumeric, isEmail } from 'validator';
import { z } from 'zod';

const createAccountSchema = (oldValues: { email: string; username: string }) => {
  return z
    .object({
      email: z
        .string()
        .email("L'adresse email est invalide")
        .min(1, "L'adresse email est requise")
        .max(255, "L'adresse email ne doit pas dépasser 255 caractères")
        .refine(isEmail, "L'adresse email est invalide"),
      username: z
        .string()
        .min(1, "Le nom d'utilisateur est requis")
        .max(35, "Le nom d'utilisateur ne doit pas dépasser 35 caractères")
        .refine(
          isAlphanumeric,
          "Le nom d'utilisateur ne doit contenir que des lettres et des chiffres"
        ),
      phoneNumber: z
        .string()
        .refine(isValidPhoneNumber, { message: 'Le numéro de téléphone est invalide' })
        .or(z.literal(''))
    })
    .superRefine(async ({ email, username }, ctx) => {
      if (oldValues.email && email.trim() !== oldValues.email.trim()) {
        const isEmailAvailable = await checkEmailAvailability(email);
        if (!isEmailAvailable) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['email'],
            message: "L'adresse email est déjà prise"
          });
        }
      }

      if (oldValues.username && username.trim() !== oldValues.username.trim()) {
        const isUsernameAvailable = await checkUsernameAvailability(username);
        if (!isUsernameAvailable) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Le nom d'utilisateur est déjà pris",
            path: ['username']
          });
        }
      }
    });
};

export type AccountSchema = z.infer<ReturnType<typeof createAccountSchema>>;
export { createAccountSchema };
