'use client';
import { useTheme } from 'next-themes';
import { FC, useEffect, useState } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import { Button } from '../button';

interface DarkModeButtonProps {
  className?: string;
}

const DarkModeButton: FC<DarkModeButtonProps> = ({ className }) => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  console.log(theme);

  return (
    <Button
      variant={'ghost'}
      className={className}
      onClick={() => (theme === 'dark' ? setTheme('light') : setTheme('dark'))}
    >
      {theme === 'dark' ? <FaMoon size={20} /> : <FaSun size={20} />}
    </Button>
  );
};

export default DarkModeButton;
