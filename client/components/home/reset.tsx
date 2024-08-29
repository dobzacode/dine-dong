'use client';

import { cn } from '@/lib/utils';
import { RotateCcw } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function Reset() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();


  return (
    <button
      onClick={() => router.replace(pathname)}
      className={cn(
        'body flex h-10 w-fit items-center justify-between gap-sm rounded-full border border-input bg-background px-3 py-2 ring-offset-background duration-fast focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-primary-900/[0.4] [&>span]:line-clamp-1',
        searchParams.size === 0 && 'pointer-events-none opacity-40'
      )}
    >
      <RotateCcw className="h-4 w-4 shrink-0 opacity-50" />
      Réinitialiser
    </button>
  );
}
