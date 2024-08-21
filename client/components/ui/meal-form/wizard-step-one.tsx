'use client';

import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import moment from 'moment';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '../button';
import { Calendar } from '../calendar';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../form';

import { Input } from '../input';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import ImageUploader from './image-uploader';
import type { MealSchema } from './meal-schema';

export default function WizardStepOne() {
  const form = useFormContext<MealSchema>();

  const [isCookingCalendarOpen, setIsCookingCalendarOpen] = useState<boolean>(false);
  const [isExpirationCalendarOpen, setIsExpirationCalendarOpen] = useState<boolean>(false);

  return (
    <>
      <fieldset className="flex flex-col gap-md text-primary-container-fg">
        <FormField
          control={form.control}
          name="stepOne.name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du repas</FormLabel>
              <FormControl>
                <Input required placeholder="Chili con carne" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <fieldset className="flex w-full justify-between gap-md">
          <FormField
            control={form.control}
            name="stepOne.cookingDate"
            render={({ field }) => (
              <FormItem className="flex w-1/2 flex-col">
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
              <FormItem className="flex w-1/2 flex-col">
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
