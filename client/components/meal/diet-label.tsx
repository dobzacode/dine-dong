import { DietsEnum } from '@/types/schema';
import { Tag } from 'lucide-react';
import { dietEnum } from '../ui/meal-form/meal-schema';

export default function Dietlabel({ diet }: { diet: keyof typeof DietsEnum }) {
  return (
    <div className="flex gap-xs rounded-xs bg-white p-xs opacity-90">
      <p className="body-sm flex items-center gap-sm text-primary-900/70">
        <Tag size={16} />
        {dietEnum.find((item) => item.value === diet)?.label}
      </p>
    </div>
  );
}
