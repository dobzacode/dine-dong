import { CheckIcon, ChevronsUpDown } from 'lucide-react';

import * as React from 'react';

import * as RPNInput from 'react-phone-number-input';

import flags from 'react-phone-number-input/flags';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { Input, type InputProps } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { cn } from '@/lib/utils';
import { type E164Number } from 'libphonenumber-js';
import { ScrollArea } from './scroll-area';

type PhoneInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> &
  Omit<RPNInput.Props<typeof RPNInput.default>, 'onChange'> & {
    onChange?: (value: RPNInput.Value) => void;
    isBordered?: boolean;
  };

const PhoneInput: React.ForwardRefExoticComponent<PhoneInputProps> = React.forwardRef<
  React.ElementRef<typeof RPNInput.default>,
  PhoneInputProps
>(({ className, onChange, isBordered, ...props }, ref) => {
  return (
    <RPNInput.default
      ref={ref}
      className={cn(
        'flex',
        className,
        isBordered &&
          'border-b focus-within:border-primary-400 [&>*:focus-visible]:ring-0 [&>*]:rounded-none [&>*]:border-x-0 [&>*]:border-b-0 [&>*]:border-t-0 [&>*]:px-2 [&>*]:ring-0'
      )}
      flagComponent={FlagComponent}
      countrySelectComponent={CountrySelect}
      inputComponent={InputComponent}
      defaultCountry="FR"
      /**
       * Handles the onChange event.
       *
       * react-phone-number-input might trigger the onChange event as undefined
       * when a valid phone number is not entered. To prevent this,
       * the value is coerced to an empty string.
       *
       * @param {E164Number | undefined} value - The entered value
       */
      //eslint-disable-next-line
      onChange={(value) => onChange?.((value as E164Number) || ('' as E164Number))}
      {...props}
    />
  );
});
PhoneInput.displayName = 'PhoneInput';

const InputComponent = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <Input className={cn('rounded-e-md rounded-s-none', className)} {...props} ref={ref} />
  )
);
InputComponent.displayName = 'InputComponent';

type CountrySelectOption = { label: string; value: RPNInput.Country };

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  onChange: (value: RPNInput.Country) => void;
  options: CountrySelectOption[];
};

const CountrySelect = ({ disabled, value, onChange, options }: CountrySelectProps) => {
  const handleSelect = React.useCallback(
    (country: RPNInput.Country) => {
      onChange(country);
    },
    [onChange]
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant={'outline'}
          className={cn('flex gap-1 rounded-e-none rounded-s-md px-3')}
          disabled={disabled}
        >
          <FlagComponent country={value} countryName={value} />
          <ChevronsUpDown
            className={cn('-mr-2 h-4 w-4 opacity-50', disabled ? 'hidden' : 'opacity-100')}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandList className="">
            <ScrollArea className="h-72">
              <CommandInput
                className="placeholder:body-sm placeholder:text-primary-900/40"
                placeholder="Chercher un pays..."
              />
              <CommandEmpty>Aucun pays trouvé.</CommandEmpty>
              <CommandGroup>
                {options
                  .filter((x) => x.value)
                  .map((option) => (
                    <CommandItem
                      className="cursor-pointer gap-2 rounded-sm"
                      key={option.value}
                      data-value={option.value}
                      disabled={false}
                      aria-disabled={false}
                      onSelect={() => handleSelect(option.value)}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelect(option.value);
                      }} // Prevents onBlur from being called before the click event
                    >
                      <FlagComponent country={option.value} countryName={option.label} />
                      <span className="body-sm flex-1">{option.label}</span>
                      {option.value && (
                        <span className="body-sm text-foreground/50">
                          {`+${RPNInput.getCountryCallingCode(option.value)}`}
                        </span>
                      )}
                      <CheckIcon
                        className={cn(
                          'ml-auto h-4 w-4',
                          option.value === value ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country];

  return (
    <span className="flex h-4 w-6 overflow-hidden rounded-md bg-foreground/20">
      {Flag && <Flag title={countryName} />}
    </span>
  );
};
FlagComponent.displayName = 'FlagComponent';

export { PhoneInput };
