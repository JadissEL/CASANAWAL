import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { MoroccanPattern } from "@/components/ui/moroccan-pattern";
import { cn } from "@/lib/utils";
import { itemVariants } from "./about-animations";

export const AboutJourney = () => (
  <motion.section variants={itemVariants} className="mb-16">
    <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-soft max-w-4xl mx-auto relative overflow-hidden">
      <MoroccanPattern
        variant="subtle"
        pattern="geometric"
        animated={true}
        corners={false}
        className="rounded-3xl"
      />

      <div className="relative z-10 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-terracotta via-safran to-zellige rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="h-10 w-10 text-white" aria-hidden={true} />
        </div>

        <h2 className={cn(
          "font-display text-xl md:text-2xl font-semibold text-nuit-900 mb-4",
          ""
        )}>
          Notre parcours
        </h2>

        <p className={cn(
          "text-nuit-600 mb-8 leading-relaxed max-w-2xl mx-auto",
          ""
        )}>
          Découvrez comment CasaNawal est devenue une référence de la cuisine marocaine authentique
        </p>

        {/* Timeline Preview */}
        <div className="flex justify-center items-center gap-4 mb-8">
          {[1, 2, 3].map((step, index) => (
            <div key={step} className="flex items-center">
              <div className="w-8 h-8 bg-terracotta rounded-full flex items-center justify-center text-white text-sm font-bold">
                {step}
              </div>
              {index < 2 && (
                <div className="w-12 h-0.5 bg-sable-300 mx-2" />
              )}
            </div>
          ))}
        </div>

        <Button
          asChild
          className="bg-zellige hover:bg-zellige-600 text-white px-8 py-3 rounded-2xl focus:ring-zellige focus:ring-offset-2"
          aria-label="Découvrir notre menu"
        >
          <Link to="/menu">
            Découvrir notre menu
          </Link>
        </Button>
      </div>
    </div>
  </motion.section>
);
