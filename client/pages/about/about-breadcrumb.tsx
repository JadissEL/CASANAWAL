import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { itemVariants } from "./about-animations";

export const AboutBreadcrumb = () => (
  <motion.nav
    variants={itemVariants}
    aria-label="Fil d'Ariane"
    className="mb-6"
  >
    <Link
      to="/"
      className={cn(
        "inline-flex items-center gap-2 text-terracotta hover:text-terracotta-600 transition-colors duration-200 group focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-offset-2 rounded-lg p-2 -ml-2",
        "flex-row"
      )}
      aria-label="Retour à l'accueil"
    >
      <ArrowLeft
        className={cn(
          "h-4 w-4 transition-transform group-hover:-translate-x-1",
          ""
        )}
        aria-hidden={true}
      />
      <span className="font-medium">Retour à l'accueil</span>
    </Link>
  </motion.nav>
);
