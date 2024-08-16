'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AutocompleteComponent } from '../ui/autocomplete';
import { Textarea } from '../ui/textarea';

export const mealSchema = z.object({
  name: z.string().min(1, 'Le nom du plat est requis'),
  description: z.string().max(1000, 'La description du plat est trop longue').optional(),
  ingredients: z.array(z.string()).min(1, 'At least one ingredient is required'),
  picture: z.string().optional(),
  adress: z.string().optional()
});

export default function MealForm() {
  const form = useForm<z.infer<typeof mealSchema>>({
    resolver: zodResolver(mealSchema),
    defaultValues: {
      description: '',
      ingredients: [],
      picture: '',
      adress: '',
      name: ''
    }
  });

  const onSubmit = (data: z.infer<typeof mealSchema>) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-1/2 flex-col gap-md">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du repas</FormLabel>
              <FormControl>
                <Input placeholder="Chili con carne" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Il s'agit d'un chili con carne"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <AutocompleteComponent />
        <Button className="flex w-full" type="submit">
          Ajouter le repas
        </Button>
      </form>
    </Form>
  );
}
