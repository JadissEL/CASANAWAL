import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MoroccanPattern } from "@/components/ui/moroccan-pattern";
import { Percent, Star, Calendar, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { itemVariants } from "./offers-animations";
import { OfferItem } from "./offers-types";

interface OffersCardProps {
  offer: OfferItem;
}

export const OffersCard = ({ offer }: OffersCardProps) => (
  <motion.div
    variants={itemVariants}
    className="bg-white rounded-3xl overflow-hidden shadow-soft hover:shadow-soft-lg transition-all duration-300 group border border-sable-200 relative"
  >
    {/* Offer Badge */}
    <div className={cn("absolute top-4 z-20", "left-4")}>
      <span className="bg-gradient-to-r from-terracotta to-safran text-white px-3 py-1.5 rounded-full text-xs font-bold">
        {offer.badge}
      </span>
    </div>

    {/* Discount Badge */}
    <div className={cn("absolute top-4 z-20", "right-4")}>
      <div className="bg-nuit-900 text-white px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1">
        <Percent className="h-3 w-3" aria-hidden={true} />
        -{offer.discount}%
      </div>
    </div>

    {/* Background Pattern */}
    <MoroccanPattern
      variant="subtle"
      pattern="geometric"
      animated={false}
      corners={false}
      className="opacity-0 group-hover:opacity-100 transition-opacity duration-500"
    />

    {/* Image Section */}
    <div className="aspect-[4/3] relative overflow-hidden">
      <img
        src={offer.image}
        alt={offer.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
        decoding="async"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
    </div>

    {/* Content */}
    <div className="p-6 relative z-10">
      <div className="mb-4">
        <h3 className={cn(
          "font-display text-xl font-semibold text-nuit-900 mb-2 group-hover:text-terracotta transition-colors",
          "text-left"
        )}>
          {offer.title}
        </h3>
        <p className={cn("text-sm text-nuit-600 mb-3", "text-left")}>
          {offer.subtitle}
        </p>
        <p className={cn("text-xs text-nuit-500 line-clamp-2", "text-left")}>
          {offer.description}
        </p>
      </div>

      {/* Pricing */}
      <div className={cn("flex items-center gap-3 mb-4", "flex-row")}>
        <span className="font-bold text-2xl text-terracotta">{offer.offerPrice} MAD</span>
        <span className="text-nuit-500 line-through text-lg">{offer.originalPrice} MAD</span>
      </div>

      {/* Features */}
      <div className="space-y-2 mb-4">
        {offer.features.map((feature, idx) => (
          <div key={idx} className={cn("flex items-center gap-2 text-xs text-nuit-600", "flex-row")}>
            <Star className="h-3 w-3 fill-safran text-safran" aria-hidden={true} />
            <span>{feature}</span>
          </div>
        ))}
      </div>

      {/* Validity */}
      <div className={cn("flex items-center gap-2 text-xs text-nuit-500 mb-4", "flex-row")}>
        <Calendar className="h-3 w-3" aria-hidden={true} />
        <span>Valable jusqu'au {offer.validUntil}</span>
      </div>

      {/* Action Button */}
      <Button className="w-full bg-terracotta hover:bg-terracotta-600 text-white rounded-xl py-3 font-medium shadow-sm focus:ring-terracotta focus:ring-offset-2">
        <ShoppingCart className="h-4 w-4 mr-2" aria-hidden={true} />
        Commander maintenant
      </Button>
    </div>
  </motion.div>
);
