import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { OrderData } from "./order-confirmation-types";
import { itemVariants } from "./order-confirmation-animations.ts";

interface OrderConfirmationAmountProps {
  orderData: OrderData;
}

export const OrderConfirmationAmount = ({ orderData }: OrderConfirmationAmountProps) => (
  <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-soft border border-sable-200 mb-8">
    <h2 className={cn(
      "font-display text-xl font-bold text-nuit-900 mb-4 text-center"
    )}>
      {"Montant à déposer"}
    </h2>
    <div className="text-center">
      <div className="text-3xl font-bold text-terracotta mb-2">
        {orderData.pricing.deposit_required} {"MAD"}
      </div>
      <p className={cn(
        "text-nuit-600"
      )}>
        {`(50% de ${orderData.pricing.total} MAD)`}
      </p>
    </div>
  </motion.div>
);
