import { motion } from "framer-motion";
import { ChefHat } from "lucide-react";
import { MoroccanPattern } from "@/components/ui/moroccan-pattern";
import { cn } from "@/lib/utils";
import { itemVariants } from "./about-animations";

export const AboutHero = () => (
  <motion.section
    variants={itemVariants}
    className="mb-16 grid gap-8 lg:grid-cols-5"
  >
    {/* Content */}
    <div className="lg:col-span-3 space-y-6">
      <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-soft relative overflow-hidden">
        <MoroccanPattern
          variant="subtle"
          pattern="mixed"
          animated={false}
          corners={true}
          className="rounded-3xl"
        />

        <div className="relative z-10">
          <p className={cn(
            "text-lg leading-relaxed text-nuit-800 mb-6",
            "text-left"
          )}>
            CasaNawal est née de la passion pour la cuisine marocaine authentique.
            Notre histoire commence dans les ruelles animées de Casablanca, où les
            arômes des épices et les saveurs traditionnelles ont inspiré la création
            d'une expérience culinaire unique.
          </p>

          <div className="p-4 bg-sable-100 rounded-2xl border-l-4 border-terracotta">
            <p className={cn(
              "text-sm text-nuit-600 italic",
              "text-left"
            )}
            aria-live="polite">
              Notre histoire complète sera bientôt disponible
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Image */}
    <div className="lg:col-span-2">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl shadow-soft">
        <img
          src="https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?w=800&q=80"
          alt="Cuisine marocaine traditionnelle"
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <ChefHat className="h-8 w-8 text-terracotta" aria-hidden={true} />
              <div>
                <p className={cn(
                  "font-semibold text-nuit-900",
                  ""
                )}>
                  Nawal
                </p>
                <p className={cn(
                  "text-xs text-nuit-600",
                  ""
                )}>
                  Chef Experte
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </motion.section>
);
