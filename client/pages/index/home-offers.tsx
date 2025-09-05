import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MoroccanPattern } from "@/components/ui/moroccan-pattern";

interface HomeOffersProps {
  offers: Array<{
    id: string;
    title: string;
    description?: string;
    discount_percentage?: number;
    discount_amount?: number;
    original_price?: number;
    final_price?: number;
    items: any[];
    image_url?: string;
  }>;
  onOneClickOrder: (offerId: string) => void;
}

export const HomeOffers = ({ offers, onOneClickOrder }: HomeOffersProps) => (
  <motion.section className="py-16 bg-white" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
    <div className="container-standard">
      <div className="text-center mb-12">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-nuit-900 mb-4">Offres Spéciales</h2>
        <p className="text-lg text-nuit-600 max-w-2xl mx-auto">Profitez de nos offres exclusives et combos savoureux</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {offers.map((offer) => {
          const originalPrice = offer.original_price || 0;
          const finalPrice = offer.final_price || 0;
          const discountPercentage = offer.discount_percentage || 0;
          const displayPrice = finalPrice || (originalPrice * (1 - discountPercentage / 100));

          return (
            <motion.div key={offer.id} className="bg-gradient-to-br from-terracotta to-safran rounded-2xl p-6 text-white relative overflow-hidden" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
              <MoroccanPattern className="absolute inset-0 opacity-10" />
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">{offer.title}</h3>
                <p className="text-sable-200 mb-4">{offer.description || 'Offre spéciale disponible maintenant'}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold">{Math.round(displayPrice)} MAD</span>
                  {originalPrice > displayPrice && (
                    <span className="text-sable-200 line-through">{originalPrice} MAD</span>
                  )}
                </div>
                {discountPercentage > 0 && (
                  <div className="mb-4">
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                      -{discountPercentage}% de réduction
                    </span>
                  </div>
                )}
                <Button onClick={() => onOneClickOrder(offer.id)} className="w-full bg-white text-terracotta hover:bg-sable-100">Commander en 1 Clic</Button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </motion.section>
);


