import type { ComponentProps, ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { fadeUp, staggerContainer } from './variants';

type MotionSectionProps = ComponentProps<typeof motion.section> & { children: ReactNode };

export function MotionSection({ children, variants = fadeUp, viewport, ...props }: MotionSectionProps) {
  const reduce = useReducedMotion();
  return <motion.section variants={variants} initial={reduce ? false : 'hidden'} whileInView="visible" viewport={viewport ?? { once: true, amount: 0.15 }} {...props}>{children}</motion.section>;
}

export function StaggerContainer({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return <motion.div className={className} variants={staggerContainer} initial={reduce ? false : 'hidden'} whileInView="visible" viewport={{ once: true, amount: 0.15 }}>{children}</motion.div>;
}
