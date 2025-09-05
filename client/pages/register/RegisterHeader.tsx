import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChefHat, ArrowLeft } from "lucide-react";

export const RegisterHeader = () => {
  return (
    <motion.header 
      className="relative z-10 p-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Link
          to="/"
          className="flex items-center text-nuit-600 hover:text-nuit-800 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Retour à l'accueil
        </Link>
        
        <div className="flex items-center space-x-2">
          <ChefHat className="h-8 w-8 text-terracotta" />
          <span className="text-xl font-bold text-nuit-900">CasaNawal</span>
        </div>
      </div>
    </motion.header>
  );
};
