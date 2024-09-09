'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import moment from 'moment';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import ImageUploader from '../../ui/image-uploader';
import type { MealSchema } from './meal-schema';

export default function WizardStepOne({ className }: { className?: string }) {
  const form = useFormContext<MealSchema>();

  const [isCookingCalendarOpen, setIsCookingCalendarOpen] = useState<boolean>(false);
  const [isExpirationCalendarOpen, setIsExpirationCalendarOpen] = useState<boolean>(false);

  return (
    <>
      <fieldset className={cn('flex flex-col gap-md text-primary-container-fg', className)}>
        <fieldset className="flex w-full gap-md max-mobile-sm:flex-col">
          <FormField
            control={form.control}
            name="stepOne.name"
            render={({ field }) => (
              <FormItem className="flex w-1/2 flex-col max-mobile-sm:w-full">
                <FormLabel>Nom du repas</FormLabel>
                <FormControl>
                  <Input required placeholder="Chili con carne" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stepOne.price"
            render={({ field }) => (
              <FormItem className="flex w-1/2 flex-col max-mobile-sm:w-full">
                <FormLabel>Prix du repas (en euros)</FormLabel>
                <FormControl>
                  <Input
                    required
                    type="number"
                    min={1}
                    max={100}
                    placeholder="10"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>
        <fieldset className="flex w-full justify-between gap-md max-mobile-sm:flex-col">
          <FormField
            control={form.control}
            name="stepOne.cookingDate"
            render={({ field }) => (
              <FormItem className="flex w-1/2 flex-col max-mobile-sm:w-full">
                <FormLabel>Date de préparation</FormLabel>
                <Popover open={isCookingCalendarOpen} onOpenChange={setIsCookingCalendarOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'pl-3 text-left font-normal hover:bg-background hover:text-opacity-80',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          moment(field.value).toDate().toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        ) : (
                          <span>Choississez une date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      required
                      //@ts-expect-error - type error
                      onSelect={(e: ChangeEventHandler<HTMLSelectElement>) => {
                        field.onChange(e);
                        setIsCookingCalendarOpen(false);
                      }}
                      disabled={(date: Date) =>
                        date > new Date() || date < new Date('1900-01-01') || field.value === date
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stepOne.expirationDate"
            render={({ field }) => (
              <FormItem className="flex w-1/2 flex-col max-mobile-sm:w-full">
                <FormLabel>Date de péremption</FormLabel>
                <Popover open={isExpirationCalendarOpen} onOpenChange={setIsExpirationCalendarOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'pl-3 text-left font-normal hover:bg-background hover:text-opacity-80',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          moment(field.value).toDate().toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        ) : (
                          <span>Choississez une date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      required
                      mode="single"
                      selected={field.value}
                      //@ts-expect-error - type error
                      onSelect={(e: ChangeEventHandler<HTMLSelectElement>) => {
                        field.onChange(e);
                        setIsExpirationCalendarOpen(false);
                      }}
                      disabled={(date: Date) =>
                        date < new Date() || date > moment().add(14, 'day').toDate()
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>

        <FormField
          control={form.control}
          name="stepOne.image"
          render={() => <ImageUploader form={form} />}
        />
      </fieldset>
    </>
  );
}
