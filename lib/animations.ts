// lib/animations.ts
export const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, delay } },
});

export const staggerContainer = (stagger = 0.12, delayChildren = 0) => ({
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: { staggerChildren: stagger, delayChildren },
  },
});

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.97 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.45 } },
};

export const revealRight = {
  hidden: { opacity: 0, x: 24 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};
