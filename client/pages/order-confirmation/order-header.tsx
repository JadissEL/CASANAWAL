import { motion } from "framer-motion";
import { CheckCircle, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { OrderHeaderProps } from "./order-confirmation-types";
import { itemVariants } from "./order-confirmation-animations";

export const OrderHeader = ({ orderData, copySuccess, onCopyToClipboard }: OrderHeaderProps) => (
  <motion.div variants={itemVariants} className="text-center mb-8">
    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <CheckCircle className="h-8 w-8 text-green-600" />
    </div>
    <h1 className={cn("font-display text-3xl md:text-4xl font-bold text-nuit-900 mb-2")}>
      {"Commande reçue — action requise"}
    </h1>
    <div className="w-24 h-1 bg-gradient-to-r from-terracotta to-safran mx-auto mb-6"></div>
    
    {/* Order Reference */}
    <div className="bg-white rounded-xl p-6 shadow-soft border border-sable-200 mb-6">
      <div className={cn("flex items-center justify-center gap-3")}>
        <span className={cn("text-lg font-semibold text-nuit-900")}>
          {"Code de référence :"}
        </span>
        <span className="font-mono text-xl font-bold text-terracotta bg-sable-100 px-4 py-2 rounded-lg">
          {orderData.reference}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onCopyToClipboard(orderData.reference, "reference")}
          className="p-2 h-8 w-8"
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
      {copySuccess === "reference" && (
        <p className={cn("text-sm text-green-600 mt-2 text-center")}>
          {"Code copié !"}
        </p>
      )}
    </div>
  </motion.div>
);
