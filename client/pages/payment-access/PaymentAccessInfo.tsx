import { motion } from "framer-motion";
import { itemVariants } from "./animation";

export const PaymentAccessInfo = () => {
  return (
    <motion.div
      variants={itemVariants}
      className="mt-8 bg-gradient-to-r from-terracotta/10 to-safran/10 rounded-xl p-6 border border-terracotta/20"
    >
      <h3 className="font-display text-lg font-bold text-nuit-900 mb-3">
        Informations importantes
      </h3>
      <ul className="space-y-2 text-sm text-nuit-700">
        <li className="flex items-start gap-2">
          <span className="text-terracotta mt-1">•</span>
          <span>
            Votre numéro de référence vous a été envoyé par email après votre commande
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-terracotta mt-1">•</span>
          <span>
            Un acompte de 50% est requis pour confirmer votre commande
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-terracotta mt-1">•</span>
          <span>
            Le paiement peut être effectué par virement bancaire ou dépôt en espèces
          </span>
        </li>
      </ul>
    </motion.div>
  );
};
