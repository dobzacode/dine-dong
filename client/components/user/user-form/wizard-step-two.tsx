'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import AddressAutoComplete from '@/components/ui/address-autocomplete';
import { FormMessages } from '@/components/ui/address-autocomplete/form-messages';
import { FormField } from '@/components/ui/form';

import LocationMap from '@/components/meal/meal-form/location-map';
import { type UserSchema } from './user-schema';

export default function WizardStepTwo({
  addressMessage,
  setAddressMessage,
  className
}: {
  addressMessage: string;
  setAddressMessage: (addressMessage: string) => void;
  className: string;
}) {
  const form = useFormContext<UserSchema>();
  const [searchInput, setSearchInput] = useState('');

  const formattedAddress = form.getValues('stepTwo.address.formattedAddress');
  const [mapCoord, setMapCoord] = useState<{ lat: number; lng: number }>({
    lat: form.watch('stepTwo.address.lat'),
    lng: form.watch('stepTwo.address.lng')
  });

  console.log(form.getValues('stepTwo.address'));

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
          name="stepTwo.address"
          render={() => (
            <AddressAutoComplete
              formName="user"
              label={'Lieu de résidence'}
              //@ts-expect-error - type is valid<
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
      </fieldset>
    </>
  );
}
