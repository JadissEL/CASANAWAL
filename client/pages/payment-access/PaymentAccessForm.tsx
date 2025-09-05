import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Search,
  AlertTriangle,
  ArrowRight
} from "lucide-react";
import { usePaymentAccess } from "./usePaymentAccess";
import { itemVariants } from "./animation";

export const PaymentAccessForm = () => {
  const {
    orderRef,
    isLoading,
    error,
    handleSubmit,
    handleInputChange
  } = usePaymentAccess();

  return (
    <motion.div
      className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden"
      variants={itemVariants}
    >
      <motion.div
        className="bg-gradient-to-r from-terracotta to-safran p-8 text-center"
        variants={itemVariants}
      >
        <Search className="h-12 w-12 text-white mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">
          Accès Paiement
        </h1>
        <p className="text-white/80">
          Entrez votre numéro de référence pour accéder au paiement
        </p>
      </motion.div>

      <motion.form
        className="p-8 space-y-6"
        variants={itemVariants}
        onSubmit={handleSubmit}
      >
        <div className="space-y-2">
          <label 
            htmlFor="orderRef" 
            className="text-sm font-medium text-nuit-700 flex items-center gap-2"
          >
            <Search className="h-4 w-4 text-terracotta" />
            Numéro de référence de commande *
          </label>
          <input
            type="text"
            id="orderRef"
            value={orderRef}
            onChange={handleInputChange}
            className="w-full bg-white border border-sable-300 rounded-lg px-4 py-3 text-nuit-900 placeholder-nuit-400 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-colors font-mono text-center text-lg tracking-wider"
            placeholder="NAW-20241220-ABC12"
            required
          />
          <p className="text-sm text-nuit-500">
            Format: NAW-AAAAMMJJ-XXXXX
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-700" />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </motion.div>
        )}

        <Button
          type="submit"
          disabled={isLoading || !orderRef.trim()}
          className="w-full bg-gradient-to-r from-terracotta to-safran hover:from-terracotta-600 hover:to-safran-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Vérification en cours...
            </div>
          ) : (
            <>
              <span>Accéder à la page de paiement</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </motion.form>

      <div className="mt-6 pt-6 border-t border-sable-200">
        <div className="text-center">
          <p className="text-sm text-nuit-600 mb-2">
            Vous ne trouvez pas votre numéro de référence ?
          </p>
          <p className="text-xs text-nuit-500">
            Vérifiez votre email de confirmation de commande
          </p>
        </div>
      </div>
    </motion.div>
  );
};
