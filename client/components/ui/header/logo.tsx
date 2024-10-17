import Link from 'next/link';

interface LogoProps {
  className?: string;
}

export default function Logo({}: LogoProps) {
  return <Link href="/"></Link>;
}
