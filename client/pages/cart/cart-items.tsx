import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { itemVariants } from "./cart-animations";

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface CartItemsProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
}

export const CartItems = ({ items, onUpdateQuantity, onRemoveItem }: CartItemsProps) => (
  <motion.div variants={itemVariants} className="space-y-4">
    {items.map(item => (
      <div key={item.id} className="bg-white rounded-xl p-4 shadow-soft border border-sable-200">
        <div className={cn("flex gap-4", "flex-row")}>
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-sable-100 flex-shrink-0">
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" decoding="async" />
          </div>
          <div className="flex-1">
            <h3 className={cn("font-semibold text-nuit-900 mb-1", "")}>{item.name}</h3>
            <p className={cn("text-terracotta font-bold text-lg mb-3", "")}>{item.price} MAD</p>
            <div className={cn("flex items-center gap-3", "flex-row")}> 
              <div className="flex items-center border border-sable-300 rounded-lg">
                <Button variant="ghost" size="sm" onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="p-2 h-8 w-8"><Minus className="h-3 w-3" /></Button>
                <span className="px-3 py-1 text-sm font-medium text-nuit-900 min-w-[2rem] text-center">{item.quantity}</span>
                <Button variant="ghost" size="sm" onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="p-2 h-8 w-8"><Plus className="h-3 w-3" /></Button>
              </div>
              <Button variant="ghost" size="sm" onClick={() => onRemoveItem(item.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2 h-8 w-8"><Trash2 className="h-3 w-3" /></Button>
            </div>
          </div>
          <div className={cn("text-right", "")}>
            <p className="font-bold text-lg text-nuit-900">{(item.price * item.quantity).toFixed(2)} MAD</p>
          </div>
        </div>
      </div>
    ))}
  </motion.div>
);


