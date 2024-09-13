import { dietEnum } from '@/components/meal/meal-form/meal-schema';
import { cn } from '@/lib/utils';
import { type DietsEnum } from '@/types/schema';
import { Tag } from 'lucide-react';

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
