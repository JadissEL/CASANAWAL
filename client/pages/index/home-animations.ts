import { MotionValue } from "framer-motion";

export const sectionFadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
} as const;

export type HeroMotion = {
  y: MotionValue<number>;
  opacity: MotionValue<number>;
};


