'use client';

import { Search } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { Input } from '../ui/input';

export default function SearchBar() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      searchTerm: ''
    }
  });

  const onSubmit = (data: Record<string, string>) => {
    console.log(data);
  };

  return (
    <section className="px-2xl">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex h-fit w-fit items-center justify-center gap-sm rounded-full border border-input bg-background px-3 ring-offset-background focus-within:ring-1 focus-within:ring-ring">
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
    </section>
  );
}
