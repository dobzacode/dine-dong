import { Loader } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex h-[75vh] flex-col items-center justify-center gap-sm">
      <Loader
        size={64}
        className="animate-spin text-primary-900 max-tablet:w-1/2"
        strokeWidth={1}
      />
    </div>
  );
}
