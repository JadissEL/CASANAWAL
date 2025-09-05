import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, Mail, Instagram, Facebook, Twitter, Youtube } from "lucide-react";

export const HomeContact = () => (
  <motion.section className="py-16 bg-nuit-900 text-white" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
    <div className="container-standard">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">Prêt à Découvrir ?</h2>
          <p className="text-lg text-sable-200 mb-8 leading-relaxed">Contactez-nous pour réserver votre table ou commander en ligne. Notre équipe est là pour vous accueillir avec le sourire !</p>
          <div className="space-y-4">
            <div className="flex items-center gap-3"><Phone className="h-5 w-5 text-terracotta" /><span>+212 5XX XX XX XX</span></div>
            <div className="flex items-center gap-3"><MapPin className="h-5 w-5 text-terracotta" /><span>123 Rue de la Gastronomie, Casablanca</span></div>
            <div className="flex items-center gap-3"><Mail className="h-5 w-5 text-terracotta" /><span>contact@casanawal.ma</span></div>
          </div>
          <div className="flex gap-4 mt-8">
            <Button asChild size="lg" className="bg-terracotta hover:bg-terracotta-600 text-white px-6 py-3 rounded-xl"><Link to="/contact">Nous Contacter</Link></Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-nuit-900 px-6 py-3 rounded-xl"><Link to="/menu">Voir le Menu</Link></Button>
          </div>
        </motion.div>
        <motion.div className="relative" initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
          <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-4">Horaires d'Ouverture</h3>
            <div className="space-y-2 text-sable-200">
              <div className="flex justify-between"><span>Lundi - Vendredi</span><span>11h00 - 23h00</span></div>
              <div className="flex justify-between"><span>Samedi - Dimanche</span><span>12h00 - 00h00</span></div>
            </div>
            <div className="mt-6 pt-6 border-t border-white/20">
              <h4 className="font-semibold mb-3">Suivez-nous</h4>
              <div className="flex gap-4">
                <a href="#" className="text-sable-200 hover:text-terracotta transition-colors"><Instagram className="h-6 w-6" /></a>
                <a href="#" className="text-sable-200 hover:text-terracotta transition-colors"><Facebook className="h-6 w-6" /></a>
                <a href="#" className="text-sable-200 hover:text-terracotta transition-colors"><Twitter className="h-6 w-6" /></a>
                <a href="#" className="text-sable-200 hover:text-terracotta transition-colors"><Youtube className="h-6 w-6" /></a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </motion.section>
);


