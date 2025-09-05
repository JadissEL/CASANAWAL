import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { OrderConfirmationRemindersProps } from "./order-confirmation-types";
import { itemVariants } from "./order-confirmation-animations.ts";

export const OrderConfirmationReminders = ({ paymentConfig, orderData }: OrderConfirmationRemindersProps) => (
  <motion.div variants={itemVariants} className="bg-red-50 border border-red-200 rounded-xl p-6">
    <h3 className={cn(
      "font-display text-lg font-bold text-red-800 mb-4 flex items-center gap-2"
    )}>
      <Clock className="h-5 w-5 text-red-600" />
      {"Rappels importants"}
    </h3>
    
    <ul className={cn(
      "space-y-2 text-red-700"
    )}>
      <li className="flex items-start gap-2">
        <span className="text-red-500 mt-1">•</span>
        <span>
          {"Dépôt minimum requis : 50 %"}
        </span>
      </li>
      <li className="flex items-start gap-2">
        <span className="text-red-500 mt-1">•</span>
        <span>
          {`Sans dépôt dans les ${paymentConfig.autoCancelHours} heures, la commande peut être annulée automatiquement`}
        </span>
      </li>
      <li className="flex items-start gap-2">
        <span className="text-red-500 mt-1">•</span>
        <span>
          {`Pour toute question : ${paymentConfig.supportPhone}`}
        </span>
      </li>
    </ul>
  </motion.div>
);
