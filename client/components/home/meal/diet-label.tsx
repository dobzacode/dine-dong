import { cn } from '@/lib/utils';
import { DietsEnum } from '@/types/schema';
import { Tag } from 'lucide-react';
import { dietEnum } from '../../ui/meal-form/meal-schema';

export default function Dietlabel({
  diet,
  icon = true,
  className
}: {
  diet: keyof typeof DietsEnum;
  icon?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('flex gap-xs rounded-xs bg-white p-xs opacity-90', className)}>
      <p className="body-sm flex items-center gap-sm text-primary-900/70">
        {icon && <Tag size={16} />}
        {dietEnum.find((item) => item.value === diet)?.label}
      </p>
    </div>
  );
}
