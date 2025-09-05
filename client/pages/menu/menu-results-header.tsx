import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { itemVariants } from "./menu-animations";

interface MenuResultsHeaderProps {
  selectedCategory: string;
  categories: Array<{ id: string; slug: string; name: string }>;
  resultsCount: number;
}

export const MenuResultsHeader = ({ selectedCategory, categories, resultsCount }: MenuResultsHeaderProps) => (
  <motion.div variants={itemVariants} className="mb-6">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          {selectedCategory !== "all" 
            ? categories.find(c => c.slug === selectedCategory)?.name || "Menu"
            : "Tous nos plats"
          }
        </h2>
        <p className="text-gray-600">
          {resultsCount} plat{resultsCount !== 1 ? 's' : ''} trouvé{resultsCount !== 1 ? 's' : ''}
        </p>
      </div>
      <Link to="/" className="flex items-center gap-2 text-nuit-600 hover:text-nuit-800 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Retour à l'accueil
      </Link>
    </div>
  </motion.div>
);


