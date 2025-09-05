import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Copy, Building2, Wallet, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { PaymentMethodsProps } from "./order-confirmation-types";
import { itemVariants } from "./order-confirmation-animations.ts";

export const OrderConfirmationPayment = ({ 
  orderData, 
  paymentConfig, 
  copySuccess, 
  onCopyToClipboard 
}: PaymentMethodsProps) => (
  <motion.div variants={itemVariants} className="space-y-6">
    {/* Bank Transfer */}
    <div className="bg-white rounded-xl p-6 shadow-soft border border-sable-200">
      <h3 className={cn(
        "font-display text-lg font-bold text-nuit-900 mb-4 flex items-center gap-2"
      )}>
        <Building2 className="h-5 w-5 text-terracotta" />
        {"Virement bancaire"}
      </h3>
      
      <p className={cn(
        "text-nuit-600 mb-4"
      )}>
        {"Effectuez un virement sur un des comptes ci-dessous :"}
      </p>

      <div className="space-y-4">
        {paymentConfig.banks.map((bank, index) => (
          <div key={index} className="bg-sable-50 rounded-lg p-4">
            <div className={cn(
              "grid grid-cols-1 md:grid-cols-3 gap-3"
            )}>
              <div>
                <label className={cn(
                  "text-sm font-medium text-nuit-700"
                )}>
                  {"Banque"}
                </label>
                <p className="font-semibold text-nuit-900">{bank.name}</p>
              </div>
              <div>
                <label className={cn(
                  "text-sm font-medium text-nuit-700"
                )}>
                  {"RIB"}
                </label>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-sm text-nuit-900">{bank.rib}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onCopyToClipboard(bank.rib, `rib-${index}`)}
                    className="p-1 h-6 w-6"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                {copySuccess === `rib-${index}` && (
                  <p className="text-xs text-green-600 mt-1">
                    {"Copié !"}
                  </p>
                )}
              </div>
              <div>
                <label className={cn(
                  "text-sm font-medium text-nuit-700"
                )}>
                  {"Bénéficiaire"}
                </label>
                <p className="font-semibold text-nuit-900">{bank.beneficiary}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Cash Deposit */}
    <div className="bg-white rounded-xl p-6 shadow-soft border border-sable-200">
      <h3 className={cn(
        "font-display text-lg font-bold text-nuit-900 mb-4 flex items-center gap-2"
      )}>
        <Wallet className="h-5 w-5 text-terracotta" />
        {"Wafacash / CashPlus"}
      </h3>
      
      <div className="bg-sable-50 rounded-lg p-4">
        <p className={cn(
          "text-nuit-900 mb-2"
        )}>
          <>Effectuez un dépôt au nom de : <strong>{paymentConfig.cashDepositBeneficiary}</strong></>
        </p>
        <p className={cn(
          "text-sm text-nuit-600"
        )}>
          {"Conservez le reçu de dépôt"}
        </p>
      </div>
    </div>

    {/* Important Note */}
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
      <div className={cn(
        "flex items-start gap-3"
      )}>
        <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
        <div>
          <h4 className={cn(
            "font-semibold text-amber-800 mb-2"
          )}>
            {"Important"}
          </h4>
          <p className={cn(
            "text-amber-700 mb-2"
          )}>
            <>Incluez ce code de référence dans le motif du virement / message de dépôt : <strong>{orderData.reference}</strong></>
          </p>
        </div>
      </div>
    </div>
  </motion.div>
);
