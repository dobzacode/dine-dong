'use client';

import AddressAutoComplete, { type AddressType } from '@/components/ui/address-autocomplete';
import { useState } from 'react';

export const AutocompleteComponent = () => {
  const [address, setAddress] = useState<AddressType>({
    address1: '',
    address2: '',
    formattedAddress: '',
    city: '',
    department: '',
    postalCode: '',
    country: '',
    lat: 0,
    lng: 0
  });
  const [searchInput, setSearchInput] = useState('');

  return (
    <AddressAutoComplete
      address={address}
      setAddress={setAddress}
      searchInput={searchInput}
      setSearchInput={setSearchInput}
      dialogTitle="Ajouter l'adresse"
    />
  );
};
