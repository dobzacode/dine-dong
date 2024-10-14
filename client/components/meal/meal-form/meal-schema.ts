import { DietsEnum, PaymentMethodsEnum, UnitEnum } from '@/types/schema';
import { matches } from 'validator';
import { z } from 'zod';

export const MAX_FILE_SIZE = 5000000;
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const unitEnum: readonly { value: keyof typeof UnitEnum; label: string }[] = [
  { value: 'MILLIGRAMME', label: 'milligramme' },
  { value: 'GRAMME', label: 'gramme' },
  { value: 'MILLILITRE', label: 'millilitre' },
  { value: 'CENTILITRE', label: 'centilitre' },
  { value: 'LITRE', label: 'litre' },
  { value: 'CUILLIERE_CAFE', label: 'cuillière à café' },
  { value: 'CUILLIERE_SOUPE', label: 'cuillière à soupe' },
  { value: 'UNITE', label: 'unité' }
];

const firstStepSchema = z.object({
  name: z
    .string()
    .min(1, 'Le nom du plat est requis')
    .max(60, 'Le nom ne doit pas dépasser 60 caractères')
    .refine((value) => matches(value, /^[a-zA-Z ]*$/), 'Le nom ne doit contenir que des lettres'),
  price: z.coerce
    .number({
      message: 'Le prix est requis'
    })
    .min(1, 'Le prix doit être supérieur à 1 euro')
    .max(100, 'Le prix ne doit pas dépasser 100 euros'),
  cookingDate: z.date(),
  expirationDate: z.date(),
  image: z
    .union([
      z.string().min(1, 'Une photo est requise'),
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
    .optional()
    .superRefine((val, ctx) => {
      if (val === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Une photo est requise'
        });
      }
    })
});

export const dietEnum: readonly {
  value: keyof typeof DietsEnum;
  label: string;
}[] = [
  { value: 'VEGETARIAN', label: 'Végétarien' },
  { value: 'VEGAN', label: 'Vegan' },
  { value: 'GLUTENFREE', label: 'Sans gluten' },
  { value: 'LACTOSEFREE', label: 'Sans lactose' }
];

const secondStepSchema = z.object({
  weight: z.coerce
    .number({
      message: 'Le poids est requis'
    })
    .min(100, 'Le poids doit être supérieur à 100g')
    .max(1000, 'Le poids ne doit pas dépasser 1kg'),
  diet: z
    .array(z.enum(Object.values(DietsEnum) as [string, ...string[]]), {
      message: 'Le type de la diet est invalide'
    })
    .max(3),
  additionalInformation: z
    .string()
    .max(500, 'Les informations additionnelles ne doivent pas dépasser 500 caractères')
    .optional(),
  ingredients: z
    .array(
      z.object({
        name: z
          .string()
          .min(1, "Le nom de l'ingrédient est requis")
          .max(25, 'Le nom ne doit pas dépasser 25 caractères')
          .refine(
            (value) => (value === '' ? true : matches(value, /^[a-zA-Z ]*$/)),
            "Le nom de l'ingrédient ne doit contenir que des lettres"
          ),
        quantity: z.coerce
          .number()
          .min(1, 'La quantité doit être supérieure à 0')
          .max(1000, 'La quantité ne doit pas dépasser 1000')
          .optional(),
        unit: z
          .enum(Object.values(UnitEnum) as [string, ...string[]], {
            message: "Le type de l'unité est invalide"
          })
          .optional()
      })
    )

    .min(1, 'Vous devez ajouter au moins un ingrédient')
    .max(30, 'Vous ne pouvez pas ajouter plus de 30 ingrédients')
    .superRefine((items, ctx) => {
      const uniqueNames = new Set<string>();
      const duplicateNames: string[] = [];

      items.forEach((item) => {
        if (item.name.trim() !== '') {
          if (uniqueNames.has(item.name)) {
            duplicateNames.push(item.name);
          } else {
            uniqueNames.add(item.name);
          }
        }
      });

      if (duplicateNames.length > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Les ingrédients suivants ont le même nom : ${duplicateNames.join(', ')}`,
          path: ['']
        });
      }
    })
});

export const paymentMethodEnum: { value: keyof typeof PaymentMethodsEnum; label: string }[] = [
  { value: 'ONLINE', label: 'Paiement en ligne' },
  { value: 'IN_PERSON', label: 'Paiement en personne' }
];

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

export const thirdStepSchema = z.object({
  address: addressSchema,
  paymentMethod: z.enum(Object.values(PaymentMethodsEnum) as [string, ...string[]])
});

export const mealSchema = z.object({
  stepOne: firstStepSchema,
  stepTwo: secondStepSchema,
  stepThree: thirdStepSchema
});

export type MealSchema = z.infer<typeof mealSchema>;
