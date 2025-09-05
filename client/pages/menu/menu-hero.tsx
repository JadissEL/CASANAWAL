import { motion } from "framer-motion";
import { MoroccanPattern } from "@/components/ui/moroccan-pattern";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { containerVariants, itemVariants } from "./menu-animations";

interface MenuHeroProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const MenuHero = ({ searchQuery, onSearchChange }: MenuHeroProps) => (
  <motion.section 
    className="relative bg-gradient-to-br from-nuit-900 via-nuit-800 to-sable-700 text-white py-16 lg:py-24"
    initial="hidden"
    animate="visible"
    variants={containerVariants}
  >
    <MoroccanPattern className="absolute inset-0 opacity-10" />
    <div className="container-standard relative z-10">
      <motion.div variants={itemVariants} className="text-center max-w-3xl mx-auto">
        <h1 className="font-display text-4xl lg:text-6xl font-bold mb-6">Notre Menu</h1>
        <p className="text-xl text-sable-200 mb-8">
          Découvrez nos délicieuses spécialités marocaines, préparées avec passion et des ingrédients frais
        </p>
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Rechercher un plat..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-sable-300 focus:bg-white/20"
          />
        </div>
      </motion.div>
    </div>
  </motion.section>
);


