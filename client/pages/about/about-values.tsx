import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { values } from "./about-data";
import { itemVariants } from "./about-animations";

export const AboutValues = () => (
  <motion.section variants={itemVariants} className="mb-16">
    <h2 className={cn(
      "font-display text-2xl md:text-3xl font-semibold text-nuit-900 mb-8",
      "text-left"
    )}>
      Nos Valeurs
    </h2>

    <div className="grid md:grid-cols-3 gap-8">
      {values.map((value, index) => {
        const IconComponent = value.icon;
        return (
          <motion.div
            key={index}
            variants={itemVariants}
            className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-soft-lg transition-all duration-300 group text-center"
          >
            <div className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-gradient-to-br",
              value.color
            )}>
              <IconComponent className="h-8 w-8 text-white" aria-hidden={true} />
            </div>

            <h3 className={cn(
              "font-semibold text-nuit-900 mb-3 group-hover:text-terracotta transition-colors",
              ""
            )}>
              {value.title}
            </h3>

            <p className={cn(
              "text-sm text-nuit-600 leading-relaxed",
              ""
            )}>
              {value.description}
            </p>
          </motion.div>
        );
      })}
    </div>
  </motion.section>
);
