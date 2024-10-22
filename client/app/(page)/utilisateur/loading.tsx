import { Loader } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex h-[75vh] flex-col items-center justify-center gap-sm">
      <Loader size={32} className="animate-spin text-primary-900" />
    </div>
  );
}
