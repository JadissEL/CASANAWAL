import { motion } from "framer-motion";
import { Heart, Shield, Truck, CreditCard } from "lucide-react";

export const HomeFeatures = () => (
  <motion.section className="py-16 bg-sable-50" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
    <div className="container-standard">
      <div className="text-center mb-12">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-nuit-900 mb-4">Pourquoi Choisir CasaNawal ?</h2>
        <p className="text-lg text-nuit-600 max-w-2xl mx-auto">Une expérience culinaire authentique et un service exceptionnel</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <Feature icon={<Heart className="h-8 w-8 text-white" />} bg="bg-terracotta" title="Cuisine d'Amour" desc="Chaque plat est préparé avec passion et des ingrédients frais" />
        <Feature icon={<Shield className="h-8 w-8 text-white" />} bg="bg-safran" title="Qualité Garantie" desc="Ingrédients de première qualité et hygiène irréprochable" />
        <Feature icon={<Truck className="h-8 w-8 text-white" />} bg="bg-zellige" title="Livraison Rapide" desc="Livraison à domicile rapide et soignée" />
        <Feature icon={<CreditCard className="h-8 w-8 text-white" />} bg="bg-nuit" title="Paiement Sécurisé" desc="Paiement en ligne sécurisé et multiple options" />
      </div>
    </div>
  </motion.section>
);

const Feature = ({ icon, bg, title, desc }: { icon: React.ReactNode; bg: string; title: string; desc: string }) => (
  <motion.div className="text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
    <div className={`w-16 h-16 ${bg} rounded-full flex items-center justify-center mx-auto mb-4`}>{icon}</div>
    <h3 className="text-lg font-semibold text-nuit-900 mb-2">{title}</h3>
    <p className="text-nuit-600">{desc}</p>
  </motion.div>
);


