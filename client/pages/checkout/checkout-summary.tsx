import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { itemVariants } from "./checkout-animations";

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface CheckoutSummaryProps {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}

export const CheckoutSummary = ({ items, subtotal, deliveryFee, total }: CheckoutSummaryProps) => (
  <motion.div variants={itemVariants} className="lg:col-span-2">
    <div className="bg-white rounded-xl p-6 shadow-soft border border-sable-200 sticky top-8">
      <h3 className={cn("font-display text-xl font-bold text-nuit-900 mb-6")}>Résumé de la commande</h3>
      <div className="space-y-3 mb-6">
        {items.map(item => (
          <div key={item.id} className="flex gap-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-sable-100 flex-shrink-0">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" decoding="async" />
            </div>
            <div className="flex-1">
              <p className={cn("font-semibold text-sm text-nuit-900")}>{item.name}</p>
              <p className={cn("text-xs text-nuit-600")}>{item.quantity} × {item.price} MAD</p>
            </div>
            <div className="text-sm font-semibold text-nuit-900">{(item.price * item.quantity).toFixed(2)} MAD</div>
          </div>
        ))}
      </div>
      <div className="space-y-3 pt-6 border-t border-sable-200">
        <div className="flex justify-between"><span className="text-nuit-600">Sous-total</span><span className="font-semibold text-nuit-900">{subtotal.toFixed(2)} MAD</span></div>
        <div className="flex justify-between">
          <span className="text-nuit-600">Frais de livraison</span>
          <div className="flex items-center space-x-2">
            <span className="line-through text-nuit-400 text-sm">{deliveryFee} MAD</span>
            <span className="font-semibold text-green-600">0 MAD</span>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">GRATUIT</span>
          </div>
        </div>
        <div className="border-t border-sable-200 pt-3">
          <div className="flex justify-between"><span className="text-lg font-bold text-nuit-900">Total</span><span className="text-lg font-bold text-terracotta">{total.toFixed(2)} MAD</span></div>
          <div className="flex justify-between mt-2"><span className="text-sm text-nuit-600">Dépôt requis (50%)</span><span className="text-sm font-bold text-safran">{Math.round(total * 0.5)} MAD</span></div>
        </div>
      </div>
    </div>
  </motion.div>
);


