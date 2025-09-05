import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { itemVariants } from "./offers-animations";

export const OffersHero = () => (
  <motion.div variants={itemVariants} className="text-center mb-16">
    <h1 className={cn(
      "font-display text-4xl md:text-5xl lg:text-6xl font-bold text-nuit-900 mb-6",
      ""
    )}>
      Offres Spéciales
    </h1>
    <div className="w-24 h-1 bg-gradient-to-r from-terracotta via-safran to-zellige mx-auto mb-8 rounded-full"></div>
    <p className={cn("text-lg md:text-xl text-nuit-600 max-w-3xl mx-auto leading-relaxed", "")}> 
      Découvrez nos offres exclusives et profitez de réductions exceptionnelles sur nos plats traditionnels
    </p>
  </motion.div>
);


