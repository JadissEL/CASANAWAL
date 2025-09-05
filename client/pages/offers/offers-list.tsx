import { motion } from "framer-motion";
import { Gift } from "lucide-react";
import { cn } from "@/lib/utils";
import { itemVariants } from "./offers-animations";
import { OfferItem } from "./offers-types";
import { OffersCard } from "./offers-card";

interface OffersListProps {
  offers: OfferItem[];
}

export const OffersList = ({ offers }: OffersListProps) => (
  <motion.div variants={itemVariants} className="mb-16">
    <div className="flex items-center justify-between mb-8">
      <h2 className={cn("font-display text-2xl md:text-3xl font-semibold text-nuit-900", "")}>
        Offres Actuelles
      </h2>
      <div className="flex items-center gap-2 text-terracotta">
        <Gift className="h-5 w-5" aria-hidden={true} />
        <span className="text-sm font-medium">{offers.length} offres actives</span>
      </div>
    </div>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {offers.map(offer => (
        <OffersCard key={offer.id} offer={offer} />
      ))}
    </div>
  </motion.div>
);


