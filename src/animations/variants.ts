import type { Variants } from 'framer-motion';
import { premiumEase, restrainedSpring, revealTransition, swiftTransition } from './transitions';

const reveal = (x = 0, y = 0): Variants => ({
  hidden: { opacity: 0, x, y },
  visible: { opacity: 1, x: 0, y: 0, transition: revealTransition },
});

export const fadeIn = reveal();
export const fadeUp = reveal(0, 20);
export const fadeDown = reveal(0, -20);
export const fadeLeft = reveal(20, 0);
export const fadeRight = reveal(-20, 0);
export const scaleIn: Variants = { hidden: { opacity: 0, scale: 0.96 }, visible: { opacity: 1, scale: 1, transition: swiftTransition } };
export const staggerContainer: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.075, delayChildren: 0.04 } } };
export const staggerItem = fadeUp;
export const cardReveal: Variants = { hidden: { opacity: 0, y: 16, scale: 0.99 }, visible: { opacity: 1, y: 0, scale: 1, transition: revealTransition } };
export const pageTransition: Variants = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: swiftTransition }, exit: { opacity: 0, y: -5, transition: { duration: 0.18, ease: premiumEase } } };
export const modalTransition: Variants = { hidden: { opacity: 0, scale: 0.97, y: 10 }, visible: { opacity: 1, scale: 1, y: 0, transition: swiftTransition }, exit: { opacity: 0, scale: 0.98, y: 8, transition: { duration: 0.18 } } };
export const drawerTransition: Variants = { hidden: { y: '100%' }, visible: { y: 0, transition: restrainedSpring }, exit: { y: '100%', transition: { duration: 0.22, ease: premiumEase } } };
