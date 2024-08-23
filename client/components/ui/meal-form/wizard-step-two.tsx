'use client';

import { cn } from '@/lib/utils';
import { PopoverContent } from '@radix-ui/react-popover';
import { Info, PlusIcon, TrashIcon } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '../button';
import { Checkbox } from '../checkbox';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../form';
import { Input } from '../input';
import { Popover, PopoverTrigger } from '../popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../select';
import { Textarea } from '../textarea';
import { dietEnum, unitEnum, type MealSchema } from './meal-schema';

export default function WizardStepTwo() {
  const form = useFormContext<MealSchema>();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'stepTwo.ingredients'
  });

  return (
    <>
      <fieldset className="flex w-full flex-col gap-md">
        <div className="flex w-full gap-md text-primary-container-fg">
          <FormField
            control={form.control}
            name="stepTwo.weight"
            render={({ field }) => (
              <FormItem className="flex w-1/2 flex-col">
                <FormLabel>Poids du repas (en grammes)</FormLabel>
                <FormControl>
                  <Input
                    required
                    type="number"
                    min={1}
                    max={10000}
                    placeholder="300"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stepTwo.diet"
            render={() => (
              <FormItem className="flex w-1/2 flex-col">
                <FormLabel className="body">Régime alimentaire (optionnel)</FormLabel>
                <div className="grid grid-cols-2 gap-sm">
                  {dietEnum.map((item) => (
                    <FormField
                      key={item.value}
                      control={form.control}
                      name="stepTwo.diet"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.value}
                            className="flex flex-row items-center gap-sm space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.value)}
                                onCheckedChange={(checked) => {
                                  if (
                                    item.value === 'VEGETARIAN' &&
                                    field.value?.includes('VEGAN')
                                  ) {
                                    return field.onChange([
                                      ...field.value.filter((value) => value !== 'VEGAN'),
                                      'VEGETARIAN'
                                    ]);
                                  }
                                  if (
                                    item.value === 'VEGAN' &&
                                    field.value?.includes('VEGETARIAN')
                                  ) {
                                    return field.onChange([
                                      ...field.value.filter((value) => value !== 'VEGETARIAN'),
                                      'VEGAN'
                                    ]);
                                  }
                                  checked
                                    ? field.onChange([...field.value, item.value])
                                    : field.onChange(
                                        field.value?.filter((value) => value !== item.value)
                                      );
                                  console.log(field.value);
                                }}
                              />
                            </FormControl>
                            <FormLabel className="cursor-pointer space-y-0 font-normal">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <span
          className={cn(
            'flex w-full items-center gap-sm',
            form.formState.errors.stepTwo?.ingredients?.some?.((error) => !!error)
              ? '[&>*]:text-error'
              : ''
          )}
        >
          <FormLabel>Liste des ingrédients</FormLabel>
          <Popover>
            <PopoverTrigger>
              <Info size={16} className="space-y-0" />
            </PopoverTrigger>
            <PopoverContent className="mt-2 w-[30ch] rounded-xs bg-white p-sm shadow-md shadow-black/10">
              <p className="body-sm">
                Seul le nom des ingrédients est obligatoire. Les quantités et les unités sont
                facultatives.
              </p>
            </PopoverContent>
          </Popover>
        </span>
        <div className="flex w-full flex-col gap-sm">
          <ul className="flex w-full grow flex-col gap-xs">
            {fields.map((field, index) => (
              <li className="flex w-full gap-xs" key={field.id}>
                <FormField
                  control={form.control}
                  name={`stepTwo.ingredients.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="grow rounded-r-none"
                          placeholder="Haricots rouges *"
                          {...field}
                        />
                      </FormControl>
                      {form.formState.errors.stepTwo?.ingredients?.[index]?.name && (
                        <FormMessage>
                          {form.formState.errors.stepTwo?.ingredients?.[index]?.name?.message}
                        </FormMessage>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`stepTwo.ingredients.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className={cn('rounded-none', !field.value && 'text-primary-900/[0.4]')}
                          type="number"
                          min={1}
                          max={100}
                          placeholder="0"
                          {...field}
                          onChange={(e) => {
                            if (e.target.value === '') {
                              return field.onChange(undefined);
                            }
                            field.onChange(e.target.value);
                          }}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      {form.formState.errors.stepTwo?.ingredients?.[index]?.quantity && (
                        <FormMessage>
                          {form.formState.errors.stepTwo?.ingredients?.[index]?.quantity?.message}
                        </FormMessage>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`stepTwo.ingredients.${index}.unit`}
                  render={({ field }) => (
                    <FormItem className="grow">
                      <Select defaultValue={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="rounded-none">
                            <SelectValue placeholder="gramme" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {unitEnum.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {form.formState.errors.stepTwo?.ingredients?.[index]?.unit && (
                        <FormMessage>
                          {form.formState.errors.stepTwo?.ingredients?.[index]?.unit?.message}
                        </FormMessage>
                      )}
                    </FormItem>
                  )}
                />
                <Button
                  onClick={() => {
                    if (form.getValues().stepTwo.ingredients.length === 1) {
                      return form.setValue('stepTwo.ingredients', [
                        { name: '', quantity: undefined, unit: undefined }
                      ]);
                    }
                    remove(index);
                  }}
                  className="rounded-l-none bg-background hover:bg-background/80 hover:[&>svg]:text-error"
                  variant={'outline'}
                >
                  <TrashIcon className="h-4 w-4 text-error opacity-50" />
                </Button>
              </li>
            ))}
          </ul>
          {form.formState.errors.stepTwo?.ingredients && (
            <FormMessage>{form.formState.errors.stepTwo?.ingredients?.message}</FormMessage>
          )}
          <Button
            type="button"
            onClick={() => append({ name: '', quantity: undefined, unit: undefined })}
            className={cn(
              'flex w-fit gap-sm border bg-background',
              form.getValues().stepTwo.ingredients.length > 19 && 'pointer-events-none opacity-50'
            )}
            variant={'outline'}
          >
            <PlusIcon strokeWidth={1.6} className="h-4 w-4" />
            <span className="body-sm">Ajouter un ingrédient</span>
          </Button>
        </div>
        <FormField
          control={form.control}
          name="stepTwo.additionalInformation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Informations complémentaires (optionnel)</FormLabel>
              <FormControl>
                <Textarea rows={5} placeholder="Il s'agit d'un chili con carne" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </fieldset>
    </>
  );
}
