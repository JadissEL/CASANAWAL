import { Variants } from "framer-motion";

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
} as const;

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
} as const;

export const chartVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5 }
  }
} as const;

export const kpiVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
} as const;
