'use client';

import { Variants, motion } from 'framer-motion';
import React from 'react';

export default function DivWrapper({
  variant,
  children,
  inverseOnExit = false,
  className,
  tag = 'div',
  style,
  noExit = false,
  custom
}: {
  variant: Variants;
  children: React.ReactNode;
  inverseOnExit?: boolean;
  className?: string;
  tag?: string;
  style?: React.CSSProperties;
  noExit?: boolean;
  custom?: number;
}) {
  //@ts-expect-error  framer-motion types are incorrect
  const MotionComponent = motion[tag || 'div'] as unknown as typeof motion.div;

  return (
    <MotionComponent
      custom={custom}
      style={style}
      className={className}
      transition={{ duration: 1, ease: 'easeInOut' }}
      variants={variant}
      initial="hidden"
      //@ts-expect-error - type is valid
      exit={() => {
        if (noExit) return;
        return inverseOnExit ? 'exit' : 'hidden';
      }}
      animate="enter"
    >
      {children}
    </MotionComponent>
  );
}
