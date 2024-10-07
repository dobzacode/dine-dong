'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import * as React from 'react';
import { DayPicker } from 'react-day-picker';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months:
          'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 items-center justify-center',
        month: 'space-y-4 body',
        caption: 'flex justify-center pt-1 relative items-center',
        caption_label: 'text-sm font-medium',
        nav: 'space-x-1 flex items-center',
        nav_button: cn(
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
          'text-primary-900'
        ),
        nav_button_previous: 'absolute left-2',
        nav_button_next: 'absolute -right-1',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex ',
        head_cell: 'text-black  w-9 font-normal caption ',
        row: 'flex w-full mt-2',
        cell: 'h-9 w-9 text-center  body-sm p-0 relative rounded-xs  [&:has([aria-selected].day-range-end)]: [&:has([aria-selected].day-outside)]:bg-primary/50 [&:has([aria-selected])]:bg-primary [&:has([aria-selected])]:text-primary-foreground first:[&:has([aria-selected])]: last:[&:has([aria-selected])]: focus-within:relative focus-within:z-20',
        day: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-xs body-sm hover:bg-transparent hover:text-black hover:opacity-70 '
        ),
        day_range_end: 'day-range-end',

        day_selected:
          'bg-primary  hover:bg-primary hover:text-primary-foreground focus:bg-primary  focus:text-primary-foreground ',

        day_outside:
          'day-outside text-primary-900/[0.4] opacity-50 aria-selected:bg-primary/50 aria-selected:text-primary-900/[0.4] aria-selected:opacity-30',
        day_disabled: 'text-primary-900/[0.4] opacity-50',
        day_range_middle: 'aria-selected:bg-primary aria-selected:text-primary-foreground',
        day_hidden: 'invisible',
        ...classNames
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
