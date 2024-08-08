import BrandLogo from '@/public/assets/brand/logo.svg';
import Link from 'next/link';

interface LogoProps {
  className?: string;
}

export default function Logo({ className }: LogoProps) {
  return (
    <Link href="/">
      <BrandLogo className={className} />
    </Link>
  );
}
