import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { itemVariants } from "./order-confirmation-animations";

export const OrderConfirmationMessage = () => (
  <motion.div variants={itemVariants} className="bg-gradient-to-r from-terracotta/10 to-safran/10 rounded-xl p-6 border border-terracotta/20 mb-8">
    <div className={cn(
      "text-center"
    )}>
      <p className={cn(
        "text-lg text-nuit-900 mb-4 leading-relaxed"
      )}>
        <>
          Merci ! Votre commande a bien été enregistrée.<br />
          Un membre de l'équipe vous appellera dans les <strong>10 minutes</strong> pour confirmer les détails.<br />
          Pour valider la commande, merci d'effectuer un <strong>dépôt minimum de 50 %</strong> du total.
        </>
      </p>
    </div>
  </motion.div>
);
