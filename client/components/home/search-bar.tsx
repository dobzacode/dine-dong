'use client';

import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { Input } from '../ui/input';

export default function SearchBar({ className }: { className?: string }) {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      searchTerm: ''
    }
  });

  const onSubmit = (data: Record<string, string>) => {
    console.log(data);
  };

  return (
    <form className={cn('', className)} onSubmit={handleSubmit(onSubmit)}>
      <div className="flex h-fit w-full items-center justify-center gap-sm rounded-full border border-input bg-background px-3 ring-offset-background focus-within:ring-1 focus-within:ring-ring tablet:w-fit">
        <Search className="stroke-foreground" size={16} />
        <Controller
          name="searchTerm"
          control={control}
          render={({ field }) => (
            <Input
              color="primary"
              className="border-none focus-visible:ring-0"
              placeholder="Rechercher un repas..."
              {...field}
            />
          )}
        />
      </div>
    </form>
  );
}
