import { cn } from '@/lib/utils';

export default function Hamburger({
  showMenu,
  setShowMenu,
  className
}: {
  showMenu: boolean;
  setShowMenu: (showMenu: boolean) => void;
  className?: string;
}) {
  return (
    <button
      onClick={() => setShowMenu(!showMenu)}
      className={cn('hamburger', className)}
      aria-controls="primary-navigation"
      aria-expanded={showMenu ? 'true' : 'false'}
    >
      <svg viewBox="0 0 100 100">
        <rect className="line top" width="80" height="6" x="10" y="25" rx="5"></rect>
        <rect className="line middle" width="80" height="6" x="10" y="45" rx="5"></rect>
        <rect className="line bottom" width="80" height="6" x="10" y="65" rx="5"></rect>
      </svg>
    </button>
  );
}
