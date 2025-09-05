import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { itemVariants } from "./login-animations";

export const LoginHero = () => (
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
);


