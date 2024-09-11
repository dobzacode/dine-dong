'use client';

import { cn } from '@/lib/utils';
import { Check, ChevronDown, RotateCcw, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { Slider } from '../ui/slider';

interface FilterProps {
  type: 'radius' | 'max_price';
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  label: string;
  unit: string;
  triggerLabel: string;
  aboveValue: number;
}

const SliderFilter = ({
  type,
  min,
  max,
  step,
  defaultValue,
  label,
  unit,
  triggerLabel,
  aboveValue
}: FilterProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [value, setValue] = useState<number>(
    parseInt(searchParams.get(type) ?? defaultValue.toString())
  );
  const [sliderValue, setSliderValue] = useState<number>(value);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleValueChange = (newValue: number[]) => {
    if (newValue[0] === max) {
      return setSliderValue(aboveValue);
    }
    const updatedValue = newValue[0] ?? min;
    setSliderValue(updatedValue);
  };

  const applyChanges = () => {
    setValue(sliderValue);

    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set(type, sliderValue.toString());

    const url = new URL(window.location.href);
    url.search = newSearchParams.toString();
    router.push(url.toString());

    setIsOpen(false);
  };

  const handleReinitialize = () => {
    const url = new URL(window.location.href);
    setValue(defaultValue);
    setSliderValue(defaultValue);
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete(type);
    url.search = newSearchParams.toString();
    router.push(url.toString());
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger
        className={cn(
          `body flex h-10 w-fit items-center justify-between gap-sm rounded-full border border-input bg-background px-3 py-2 outline-none ring-offset-background duration-medium focus:outline-none focus:ring-0 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-primary-900/[0.4] [&>span]:line-clamp-1`,
          searchParams.get(type) && 'border-primary-900 bg-primary-900 text-white'
        )}
      >
        {triggerLabel}
        <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit rounded-xs">
        <DropdownMenuLabel className="flex items-center justify-between gap-md">
          {label}
          <X
            onClick={() => setIsOpen(false)}
            className="h-4 w-4 cursor-pointer opacity-50 duration-fast"
          />
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <section className={'flex flex-col justify-center gap-smd p-md'}>
          <p className="body-sm flex justify-center gap-xs">
            {type === 'radius'
              ? sliderValue === aboveValue
                ? `Dans un rayon de plus de`
                : `Dans un rayon de`
              : sliderValue === aboveValue
                ? `Au delà de`
                : `Au maximum`}{' '}
            <span className="font-bold">{sliderValue === aboveValue ? max : sliderValue}</span>{' '}
            {unit}
          </p>
          <Slider
            defaultValue={[defaultValue]}
            className={cn(
              !searchParams.get(type) && 'opacity-40 duration-medium hover:opacity-100',
              'cursor-pointer'
            )}
            max={max}
            min={min}
            step={step}
            onValueChange={handleValueChange}
            value={[sliderValue]}
          />
        </section>

        <DropdownMenuSeparator />

        <div className="flex justify-center">
          <DropdownMenuItem className="gap-sm" onSelect={handleReinitialize}>
            <RotateCcw className="h-4 w-4 opacity-50" />
            Réinitialiser
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-sm" onSelect={applyChanges}>
            <Check className="h-4 w-4 opacity-50" />
            Appliquer
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SliderFilter;
