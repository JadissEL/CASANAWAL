import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { itemVariants } from "./cart-animations";

interface CartSummaryProps {
  subtotal: number;
  discount: { percentage: number; amount: number; reason?: string };
  itemCount: number;
  deliveryFee: number;
  total: number;
}

export const CartSummary = ({ subtotal, discount, itemCount, deliveryFee, total }: CartSummaryProps) => (
  <motion.div variants={itemVariants} className="lg:col-span-1">
    <div className="bg-white rounded-xl p-6 shadow-soft border border-sable-200 sticky top-8">
      <h3 className={cn("font-display text-xl font-bold text-nuit-900 mb-6", "")}>Résumé de la commande</h3>
      <div className="space-y-4 mb-6">
        <div className={cn("flex justify-between", "flex-row")}><span className={cn("text-nuit-600", "")}>Sous-total</span><span className="font-semibold text-nuit-900">{subtotal.toFixed(2)} MAD</span></div>
        {discount.percentage > 0 && (
          <div className={cn("flex justify-between bg-green-50 p-3 rounded-lg border border-green-200", "flex-row")}>
            <div>
              <span className={cn("text-green-700 font-medium block text-sm", "")}>{discount.reason}</span>
              <span className={cn("text-green-600 text-xs", "")}>-{discount.percentage}%</span>
            </div>
            <span className="font-semibold text-green-700">-{discount.amount.toFixed(2)} MAD</span>
          </div>
        )}
        <div className={cn("flex justify-between", "flex-row")}>
          <span className={cn("text-nuit-600", "")}>Frais de livraison</span>
          <div className="flex items-center space-x-2">
            <span className="line-through text-nuit-400 text-sm">{deliveryFee} MAD</span>
            <span className="font-semibold text-green-600">0 MAD</span>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">GRATUIT</span>
          </div>
        </div>
        <div className="border-t border-sable-200 pt-4">
          <div className={cn("flex justify-between", "flex-row")}>
            <span className={cn("text-lg font-bold text-nuit-900", "")}>Total</span>
            <span className="text-lg font-bold text-terracotta">{total.toFixed(2)} MAD</span>
          </div>
        </div>
      </div>
      <Button asChild className="w-full bg-gradient-to-r from-terracotta to-safran hover:from-terracotta-600 hover:to-safran-600 text-white font-semibold py-3"><Link to="/checkout">Procéder au checkout</Link></Button>
      <Button asChild variant="outline" className="w-full mt-3"><Link to="/">Continuer les achats</Link></Button>
      {itemCount > 0 && (
        <div className="mt-4 p-4 bg-gradient-to-r from-terracotta/5 to-safran/5 rounded-lg border border-terracotta/20">
          <div className={cn("text-center", "text-left")}>
            {discount.percentage === 0 && itemCount === 1 && (
              <div>
                <p className={cn("text-sm text-terracotta font-medium mb-1", "")}>🎉 Ajoutez un autre produit et obtenez 5% de réduction!</p>
                <p className={cn("text-xs text-nuit-600", "")}>Économisez {(subtotal * 0.05).toFixed(2)} MAD</p>
              </div>
            )}
            {discount.percentage === 5 && itemCount < 4 && (
              <div>
                <p className={cn("text-sm text-terracotta font-medium mb-1", "")}>🔥 Ajoutez {4 - itemCount} produits de plus pour 10% de réduction!</p>
                <p className={cn("text-xs text-nuit-600", "")}>Économisez {((subtotal * 0.10) - discount.amount).toFixed(2)} MAD</p>
              </div>
            )}
            {discount.percentage < 20 && subtotal < 700 && (
              <div>
                <p className={cn("text-sm text-terracotta font-medium mb-1", "")}>⭐ Ajoutez {(700 - subtotal).toFixed(0)} MAD de plus pour 20% de réduction!</p>
                <p className={cn("text-xs text-nuit-600", "")}>Économisez jusqu'à {(700 * 0.20).toFixed(2)} MAD</p>
              </div>
            )}
            {discount.percentage === 20 && (
              <div>
                <p className={cn("text-sm text-green-600 font-medium", "")}>🏆 Félicitations! Vous avez notre meilleure réduction!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  </motion.div>
);


