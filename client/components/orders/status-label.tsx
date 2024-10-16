import { translateStatus } from '@/lib/utils';
import { OrderStatusEnum } from '@/types/schema';
import { CheckIcon, Loader, X } from 'lucide-react';

export default function StatusLabel({ status }: { status: keyof typeof OrderStatusEnum }) {
  const icon = () => {
    switch (status) {
      case 'FINALIZED':
        return <CheckIcon className="h-4 w-4 shrink-0 text-green-500" />;
      case 'CANCELLED':
        return <X className="h-4 w-4 shrink-0 text-error" />;
      case 'IN_PROGRESS':
        return <Loader className="h-4 w-4 shrink-0 text-primary-500" />;
    }
  };

  return (
    <div className="flex items-center gap-xs">
      {icon()} <p className="body-sm">{translateStatus(status)}</p>
    </div>
  );
}
