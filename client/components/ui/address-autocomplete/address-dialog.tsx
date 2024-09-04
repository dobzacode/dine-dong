'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type React from 'react';
import { useEffect, useState, type FormEvent } from 'react';
import { type ZodError } from 'zod';
import type { AddressType } from '.';

import { Loader2 } from 'lucide-react';

import { addressSchema } from '@/components/meal/meal-form/meal-schema';
import { FormMessages } from './form-messages';

interface AddressDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  address: AddressType;
  setAddress: (address: AddressType) => void;
  adrAddress: string;
  dialogTitle: string;
  isLoading: boolean;
}

export default function AddressDialog(props: React.PropsWithChildren<AddressDialogProps>) {
  const { children, dialogTitle, open, setOpen, address, setAddress, adrAddress, isLoading } =
    props;

  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [department, setDepartment] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [errorMap, setErrorMap] = useState<Record<string, string>>({});

  console.log(address);

  /**
   * Update and format the address string with the given components
   */
  function updateAndFormatAddress(
    addressString: string,
    addressComponents: {
      'street-address': string;
      address2: string;
      locality: string;
      department: string;
      'postal-code': string;
    }
  ) {
    let updatedAddressString = addressString;

    // Replace each class content with its corresponding value
    Object.entries(addressComponents).forEach(([key, value]) => {
      if (key !== 'address2') {
        const regex = new RegExp(`(<span class="${key}">)[^<]*(</span>)`, 'g');
        updatedAddressString = updatedAddressString.replace(regex, `$1${value}$2`);
        updatedAddressString = updatedAddressString.replace('&%39;', '');
      }
    });

    // Remove all span tags
    updatedAddressString = updatedAddressString.replace(/<\/?span[^>]*>/g, '');

    // Add address2 just after address1 if provided
    if (addressComponents.address2) {
      const address1Regex = new RegExp(`${addressComponents['street-address']}`);
      updatedAddressString = updatedAddressString.replace(
        address1Regex,
        `${addressComponents['street-address']}, ${addressComponents.address2}`
      );
    }

    // Clean up any extra spaces or commas
    updatedAddressString = updatedAddressString
      .replace(/,\s*,/g, ',')
      .trim()
      .replace(/\s\s+/g, ' ')
      .replace(/,\s*$/, '');

    console.log(updatedAddressString);

    return updatedAddressString;
  }

  /**
   * Handle form submission and save the address
   */
  const handleSave = (e: FormEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      addressSchema
        .omit({
          lat: true,
          lng: true,
          country: true,
          formattedAddress: true
        })
        .parse({
          address1,
          address2,
          city,
          department,
          postalCode
        });
    } catch (error) {
      const zodError = error as ZodError;
      const errorMap = zodError.flatten().fieldErrors;
      console.log(errorMap);

      setErrorMap({
        address1: errorMap.address1?.[0] ?? '',
        address2: errorMap.address2?.[0] ?? '',
        city: errorMap.city?.[0] ?? '',
        department: errorMap.department?.[0] ?? '',
        postalCode: errorMap.postalCode?.[0] ?? ''
      });

      return;
    }

    if (
      address2 !== address.address2 ||
      postalCode !== address.postalCode ||
      address1 !== address.address1 ||
      city !== address.city ||
      department !== address.department
    ) {
      const newFormattedAddress = updateAndFormatAddress(adrAddress, {
        'street-address': address1 || address.address1,
        address2: address2 || address.address2,
        locality: city || address.city,
        department: department ?? address.department,
        'postal-code': postalCode ?? address.postalCode
      });

      console.log(Boolean(address1), address.address1);

      setAddress({
        ...address,
        city: city || address.city,
        department: department || address.department,
        address1: address1 || address.address1,
        address2: address2 || address.address2,
        postalCode: postalCode || address.postalCode,
        formattedAddress: newFormattedAddress
      });
    }
    setOpen(false);
  };

  useEffect(() => {
    setAddress1(address.address1);
    setAddress2(address.address2 || '');
    setPostalCode(address.postalCode ?? '');
    setCity(address.city);
    setDepartment(address.department ?? '');

    if (!open) {
      setErrorMap({});
    }
  }, [address, open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="rounded-xs">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex h-52 items-center justify-center">
            <Loader2 className="size-6 animate-spin" />
          </div>
        ) : (
          <form onSubmit={handleSave}>
            <div className="space-y-4 py-7">
              <div className="space-y-0.5">
                <Label htmlFor="address1">Adresse ligne 1</Label>
                <Input
                  value={address1}
                  onChange={(e) => setAddress1(e.currentTarget.value)}
                  disabled={address?.address1 === ''}
                  id="address1"
                  name="address1"
                  placeholder="Adresse ligne 1"
                />
                {errorMap.address1 && (
                  <FormMessages
                    type="error"
                    className="pt-1 text-sm"
                    messages={[errorMap.address1]}
                  />
                )}
              </div>

              <div className="space-y-0.5">
                <Label htmlFor="address2">
                  Adresse ligne 2{' '}
                  <span className="text-xs text-secondary-foreground">(Optional)</span>
                </Label>
                <Input
                  value={address2}
                  onChange={(e) => setAddress2(e.currentTarget.value)}
                  disabled={address?.address1 === ''}
                  id="address2"
                  name="address2"
                  placeholder="Adresse ligne 2"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1 space-y-0.5">
                  <Label htmlFor="city">Ville</Label>
                  <Input
                    value={city}
                    onChange={(e) => setCity(e.currentTarget.value)}
                    disabled={address?.city === ''}
                    id="city"
                    name="city"
                    placeholder="Ville"
                  />
                  {errorMap.city && (
                    <FormMessages
                      type="error"
                      className="pt-1 text-sm"
                      messages={[errorMap.city]}
                    />
                  )}
                </div>
                <div className="flex-1 space-y-0.5">
                  <Label htmlFor="department">Département</Label>
                  <Input
                    value={department}
                    onChange={(e) => setDepartment(e.currentTarget.value)}
                    disabled={address?.department === ''}
                    id="department"
                    name="department"
                    placeholder="Département"
                  />
                  {errorMap.department && (
                    <FormMessages
                      type="error"
                      className="pt-1 text-sm"
                      messages={[errorMap.department]}
                    />
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1 space-y-0.5">
                  <Label htmlFor="postalCode">Code postal</Label>
                  <Input
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.currentTarget.value)}
                    disabled={address?.postalCode === ''}
                    id="postalCode"
                    name="postalCode"
                    placeholder="Code postal"
                  />
                  {errorMap.postalCode && (
                    <FormMessages
                      type="error"
                      className="pt-1 text-sm"
                      messages={[errorMap.postalCode]}
                    />
                  )}
                </div>
                <div className="flex-1 space-y-0.5">
                  <Label htmlFor="country">Pays</Label>
                  <Input
                    value={address?.country}
                    id="country"
                    disabled
                    name="country"
                    placeholder="Pays"
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="flex flex-row gap-xs">
              <Button
                className="w-1/2 gap-xs rounded-r-none"
                type="reset"
                onClick={() => setOpen(false)}
                variant={'outline'}
              >
                Annuler
              </Button>
              <Button className="w-1/2 rounded-l-none" type="submit">
                Enregistrer
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
