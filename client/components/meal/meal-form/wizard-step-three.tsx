'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import AddressAutoComplete from '@/components/ui/address-autocomplete';
import { FormMessages } from '@/components/ui/address-autocomplete/form-messages';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import LocationMap from './location-map';
import { paymentMethodEnum, type MealSchema } from './meal-schema';

export default function WizardStepThree({
  addressMessage,
  setAddressMessage,
  className
}: {
  addressMessage: string;
  setAddressMessage: (addressMessage: string) => void;
  className: string;
}) {
  const form = useFormContext<MealSchema>();
  const [searchInput, setSearchInput] = useState('');

  const formattedAddress = form.getValues('stepThree.address.formattedAddress');
  const [mapCoord, setMapCoord] = useState<{ lat: number; lng: number }>({
    lat: form.watch('stepThree.address.lat'),
    lng: form.watch('stepThree.address.lng')
  });

  useEffect(() => {
    if (searchInput && !formattedAddress) {
      setAddressMessage('');
    }
  }, [searchInput, formattedAddress, setAddressMessage]);

  return (
    <>
      <fieldset className={cn('flex flex-col gap-md text-primary-container-fg', className)}>
        <FormField
          control={form.control}
          name="stepThree.address"
          render={() => (
            <AddressAutoComplete
              form={form}
              setMapCoord={setMapCoord}
              searchInput={searchInput}
              setSearchInput={setSearchInput}
              dialogTitle="Ajouter l'adresse"
            />
          )}
        />
        {addressMessage && (
          <FormMessages type="error" className="-mt-2" messages={[addressMessage]} />
        )}

        <LocationMap lat={mapCoord.lat} lng={mapCoord.lng} />
        <FormField
          control={form.control}
          name="stepThree.paymentMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Méthode de paiement *</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex gap-lg"
                >
                  {paymentMethodEnum.map((option) => (
                    <FormItem
                      className="flex items-center gap-sm space-x-0 space-y-0"
                      key={option.value}
                    >
                      <FormControl>
                        <RadioGroupItem required value={option.value} />
                      </FormControl>
                      <FormLabel className="font-normal">{option.label}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </fieldset>
    </>
  );
}
