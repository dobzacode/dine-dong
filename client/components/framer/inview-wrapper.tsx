'use client';

import {
  motion,
  type MotionStyle,
  type TargetAndTransition,
  type VariantLabels,
  type Variants
} from 'framer-motion';
import { type RefObject } from 'react';

interface ViewportOptions {
  root?: RefObject<Element>;
  once?: boolean;
  margin?: string;
  amount?: 'some' | 'all' | number;
}

export default function InviewWrapper({
  style,
  variant,
  children,
  className,
  viewport = { once: true, margin: '0px 0px -200px 0px' },
  inverseOnExit,
  id,
  tag = 'div',
  noExit,
  whileHover
}: {
  style?: MotionStyle | undefined;
  variant: Variants | undefined;
  children: React.ReactNode;
  className?: string;
  viewport?: ViewportOptions;
  inverseOnExit?: boolean;
  id?: string;
  tag?: string;
  noExit?: boolean;
  whileHover?: VariantLabels | TargetAndTransition;
}) {
  //@ts-expect-error  framer-motion types are incorrect
  const MotionComponent = motion[tag || 'div'] as unknown as typeof motion.div;

  const determineExitVariant = () => {
    if (noExit) return;
    return inverseOnExit ? 'exit' : 'hidden';
  };

  return (
    <MotionComponent
      id={id}
      style={style}
      transition={{ duration: 1, ease: 'easeInOut' }}
      className={className}
      variants={variant}
      viewport={viewport}
      whileInView="enter"
      initial="hidden"
      whileHover={whileHover}
      exit={determineExitVariant()}
    >
      {children}
    </MotionComponent>
  );
}
