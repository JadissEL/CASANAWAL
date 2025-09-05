import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { itemVariants } from "./about-animations";

export const AboutHeader = () => (
  <motion.header variants={itemVariants} className="mb-12">
    <h1 className={cn(
      "font-display text-4xl md:text-5xl lg:text-6xl font-bold text-nuit-900 mb-6",
      "text-left"
    )}>
      À propos de CasaNawal
    </h1>
    <div className={cn(
      "w-24 h-1 bg-gradient-to-r from-terracotta via-safran to-zellige rounded-full mb-8",
      "ml-0"
    )}></div>
  </motion.header>
);
