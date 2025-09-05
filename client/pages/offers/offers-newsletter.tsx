import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MoroccanPattern } from "@/components/ui/moroccan-pattern";
import { cn } from "@/lib/utils";
import { itemVariants } from "./offers-animations";

export const OffersNewsletter = () => (
  <motion.div variants={itemVariants} className="text-center">
    <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-soft max-w-2xl mx-auto relative overflow-hidden">
      <MoroccanPattern
        variant="subtle"
        pattern="mixed"
        animated={true}
        corners={true}
        className="rounded-3xl"
      />
      <div className="relative z-10">
        <div className="w-20 h-20 bg-gradient-to-br from-safran via-terracotta to-zellige rounded-full flex items-center justify-center mx-auto mb-6">
          <Bell className="h-10 w-10 text-white" aria-hidden={true} />
        </div>
        <h3 className={cn("font-display text-xl md:text-2xl font-semibold text-nuit-900 mb-4", "")}>
          Offres à venir
        </h3>
        <p className={cn("text-nuit-600 mb-8 leading-relaxed", "")}>
          Inscrivez-vous à notre newsletter pour être informé des prochaines offres exclusives et promotions spéciales
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <input
            type="email"
            placeholder="Votre email"
            className={cn(
              "flex-1 px-4 py-3 rounded-xl border border-sable-300 focus:outline-none focus:ring-2 focus:ring-terracotta focus:border-transparent",
              "text-left"
            )}
            aria-label="Adresse email"
          />
          <Button className="bg-terracotta hover:bg-terracotta-600 text-white px-6 py-3 rounded-xl focus:ring-terracotta focus:ring-offset-2">
            S'abonner
          </Button>
        </div>
      </div>
    </div>
  </motion.div>
);


