import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { containerVariants, itemVariants } from "./offers/offers-animations";
import { OffersNav } from "./offers/offers-nav";
import { OffersHero } from "./offers/offers-hero";
import { OffersList } from "./offers/offers-list";
import { OffersNewsletter } from "./offers/offers-newsletter";
import { useOffers } from "./offers/offers-hooks";

const Offers = () => {
  const { offers, loading, error } = useOffers();

  return (
    <div className="page-layout">
      <OffersNav />
      <main className="relative">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16"
        >
          <motion.div variants={itemVariants}>
            <Link
              to="/"
              className={cn(
                "inline-flex items-center gap-2 text-terracotta hover:text-terracotta-600 transition-colors duration-200 mb-8 group focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-offset-2 rounded-lg p-2 -ml-2",
                "flex-row"
              )}
              aria-label="Retour à l'accueil"
            >
              <ArrowLeft className={cn("h-4 w-4 transition-transform group-hover:-translate-x-1", "")} aria-hidden={true} />
              <span className="font-medium">Retour à l'accueil</span>
            </Link>
          </motion.div>

          <OffersHero />

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <p className="text-muted-foreground">Veuillez réessayer plus tard.</p>
            </div>
          ) : (
            <OffersList offers={offers} />
          )}

          <OffersNewsletter />
        </motion.div>
      </main>
    </div>
  );
};

export default Offers;
