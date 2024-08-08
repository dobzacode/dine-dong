'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavLink({
  className,
  href,
  title
}: {
  className?: string;
  href: string;
  title: string;
}) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={`card-neutral body shrink-0 px-md py-sm shadow-md duration-fast ${pathname === href ? 'bg-primary-400 text-white shadow-none' : ''}`}
    >
      {title}
    </Link>
  );
}
