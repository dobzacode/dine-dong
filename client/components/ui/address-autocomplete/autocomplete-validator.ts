import { z } from 'zod';
import type { AddressType } from '.';

/**
 * Checks if the autocomplete address is valid. Change to your own validation logic.
 * @param {AddressType} address - The address object to validate.
 * @param {string} searchInput - The search input string.
 * @returns {boolean} - Returns true if the autocomplete address is valid, otherwise false.
 */
export const isValidAutocomplete = (address: AddressType, searchInput: string) => {
  if (searchInput.trim() === '') {
    return true;
  }

  const AddressSchema = z.object({
    address1: z.string().min(1, "La ligne d'adresse 1 est obligatoire"),
    address2: z.string().optional(),
    formattedAddress: z.string().min(1, "L'adresse est obligatoire"),
    city: z.string().min(1, 'La ville est obligatoire'),
    department: z.string().min(1, 'Le département est obligatoire'),
    postalCode: z.string().min(1, 'Le code postal est obligatoire'),
    country: z.string().min(1, 'Le pays est obligatoire'),
    lat: z.number().nonnegative(),
    lng: z.number().nonnegative()
  });

  const result = AddressSchema.safeParse(address);
  return result.success;
};
