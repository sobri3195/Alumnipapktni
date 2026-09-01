import type { Transition } from 'framer-motion';

export const premiumEase = [0.22, 1, 0.36, 1] as const;
export const swiftTransition: Transition = { duration: 0.32, ease: premiumEase };
export const revealTransition: Transition = { duration: 0.5, ease: premiumEase };
export const restrainedSpring: Transition = { type: 'spring', stiffness: 280, damping: 30, mass: 0.8 };
