'use client';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandList } from '@/components/ui/command';
import { FormMessages } from '@/components/ui/form-messages';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { fetcher } from '@/lib/utils';
import { Delete, Loader2, Pencil } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';
import AddressDialog from './address-dialog';

import { Command as CommandPrimitive } from 'cmdk';
import { Label } from '../label';

export interface AddressType {
  address1: string;
  address2: string;
  formattedAddress: string;
  city: string;
  department: string;
  postalCode: string;
  country: string;
  lat: number;
  lng: number;
}

interface AddressAutoCompleteProps {
  address: AddressType;
  setAddress: (address: AddressType) => void;
  searchInput: string;
  setSearchInput: (searchInput: string) => void;
  dialogTitle: string;
  showInlineError?: boolean;
  placeholder?: string;
}

export default function AddressAutoComplete(props: AddressAutoCompleteProps) {
  const {
    address,
    setAddress,
    dialogTitle,
    showInlineError = true,
    searchInput,
    setSearchInput,
    placeholder
  } = props;

  const [selectedPlaceId, setSelectedPlaceId] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  //eslint-disable-next-line
  const { data, isLoading } = useSWR(
    selectedPlaceId === '' ? null : `/api/address/place?placeId=${selectedPlaceId}`,
    fetcher,
    {
      revalidateOnFocus: true
    }
  );

  //eslint-disable-next-line
  const adrAddress: string = data?.data.adrAddress;

  useEffect(() => {
    //eslint-disable-next-line
    if (data?.data.address) {
      //eslint-disable-next-line
      setAddress(data.data.address as AddressType);
    }
  }, [data, setAddress]);

  console.log(data);

  return (
    <>
      {selectedPlaceId !== '' || address.formattedAddress ? (
        <div className="flex flex-col pb-8 pt-2">
          <Label htmlFor="address1" className="pb-4">
            Adresse
          </Label>
          <div className="flex items-center gap-2">
            <Input value={address?.formattedAddress} readOnly />
            <AddressDialog
              isLoading={isLoading}
              dialogTitle={dialogTitle}
              adrAddress={adrAddress}
              address={address}
              setAddress={setAddress}
              open={isOpen}
              setOpen={setIsOpen}
            >
              <Button disabled={isLoading} size="icon" variant="outline" className="shrink-0">
                <Pencil className="size-4" />
              </Button>
            </AddressDialog>
            <Button
              type="reset"
              onClick={() => {
                setSelectedPlaceId('');
                setAddress({
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
              }}
              size="icon"
              variant="outline"
              className="shrink-0"
            >
              <Delete className="size-4" />
            </Button>
          </div>
        </div>
      ) : (
        <AddressAutoCompleteInput
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          selectedPlaceId={selectedPlaceId}
          setSelectedPlaceId={setSelectedPlaceId}
          setIsOpenDialog={setIsOpen}
          showInlineError={showInlineError}
          placeholder={placeholder}
        />
      )}
    </>
  );
}

interface CommonProps {
  selectedPlaceId: string;
  setSelectedPlaceId: (placeId: string) => void;
  setIsOpenDialog: (isOpen: boolean) => void;
  showInlineError?: boolean;
  searchInput: string;
  setSearchInput: (searchInput: string) => void;
  placeholder?: string;
}

function AddressAutoCompleteInput(props: CommonProps) {
  const {
    setSelectedPlaceId,
    selectedPlaceId,
    setIsOpenDialog,
    showInlineError,
    searchInput,
    setSearchInput,
    placeholder
  } = props;

  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      close();
    }
  };

  const debouncedSearchInput = useDebounce(searchInput, 500);

  //eslint-disable-next-line
  const { data, isLoading } = useSWR(
    `/api/address/autocomplete?input=${debouncedSearchInput}`,
    fetcher
  );

  //eslint-disable-next-line
  const predictions = (data?.data as []) ?? [];

  return (
    <Command
      shouldFilter={false}
      onKeyDown={handleKeyDown}
      className="relative z-30 overflow-visible pb-8 pt-2"
    >
      <Label htmlFor="address1" className="pb-4">
        Adresse
      </Label>
      <div className="body flex w-full items-center justify-between rounded-lg">
        <CommandPrimitive.Input
          value={searchInput}
          onValueChange={setSearchInput}
          onBlur={close}
          onFocus={open}
          placeholder={placeholder ?? 'Ajouter une adresse'}
          className="body file:body flex h-10 w-full rounded-xs border border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
      {searchInput !== '' && !isOpen && !selectedPlaceId && showInlineError && (
        <FormMessages
          className="pt-4"
          type="error"
          messages={['Sélectionnez une adresse valide dans la liste']}
        />
      )}

      {isOpen && (
        <div className="relative h-auto animate-in fade-in-0 zoom-in-95">
          <CommandList>
            <div className="absolute top-1.5 z-50 w-full">
              <CommandGroup className="relative z-50 h-auto min-w-[8rem] overflow-hidden rounded-xs border bg-white shadow-md shadow-black/10">
                {isLoading ? (
                  <div className="flex h-28 items-center justify-center">
                    <Loader2 className="size-6 animate-spin" />
                  </div>
                ) : (
                  <>
                    {predictions.map(
                      (prediction: {
                        placePrediction: {
                          placeId: string;
                          place: string;
                          text: { text: string };
                        };
                      }) => (
                        <CommandPrimitive.Item
                          value={prediction.placePrediction.text.text}
                          onSelect={() => {
                            setSearchInput('');
                            setSelectedPlaceId(prediction.placePrediction.place);
                            setIsOpenDialog(true);
                          }}
                          className="flex h-max cursor-pointer select-text flex-col items-start gap-0.5 p-2 px-3 first:rounded-t-xs last:rounded-b-xs hover:bg-primary-50 aria-selected:bg-primary-50"
                          key={prediction.placePrediction.placeId}
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          {prediction.placePrediction.text.text}
                        </CommandPrimitive.Item>
                      )
                    )}
                  </>
                )}

                <CommandEmpty>
                  {!isLoading && predictions.length === 0 && (
                    <p className="body flex items-center justify-center py-4">
                      {searchInput === ''
                        ? 'Veuillez entrer une adresse'
                        : 'Aucune adresse trouvée'}
                    </p>
                  )}
                </CommandEmpty>
              </CommandGroup>
            </div>
          </CommandList>
        </div>
      )}
    </Command>
  );
}
