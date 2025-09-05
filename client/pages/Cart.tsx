import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/ui/navigation";
import { ArrowLeft, Plus, Minus, Trash2, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { containerVariants, itemVariants } from "./cart/cart-animations";
import { useCartPage } from "./cart/cart-hooks";
import { CartItems } from "./cart/cart-items";
import { CartSummary } from "./cart/cart-summary";

const Cart = () => {
  const { state, updateQuantity, removeItem, deliveryFee, total } = useCartPage();

  return (
    <div className="page-layout">
      {/* Navigation */}
      <Navigation />

      <div className="page-content-narrow">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-terracotta hover:text-terracotta-600 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour au menu
        </Link>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-nuit-900 mb-4">
              Votre Panier
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-terracotta to-safran mx-auto"></div>
          </motion.div>

          {state.items.length === 0 ? (
            /* Empty Cart */
            <motion.div
              variants={itemVariants}
              className="text-center py-16"
            >
              <ShoppingCart className="h-16 w-16 text-nuit-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-nuit-600 mb-2">
                Votre panier est vide
              </h2>
              <p className="text-nuit-500 mb-6">
                Ajoutez de délicieux plats de notre menu
              </p>
              <Button asChild className="bg-terracotta hover:bg-terracotta-600 text-white">
                <Link to="/">
                  Parcourir le menu
                </Link>
              </Button>
            </motion.div>
          ) : (
            /* Cart with Items */
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2"><CartItems items={state.items} onUpdateQuantity={updateQuantity} onRemoveItem={removeItem} /></div>

              {/* Order Summary */}
              <CartSummary subtotal={state.subtotal} discount={state.discount} itemCount={state.itemCount} deliveryFee={deliveryFee} total={total} />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Cart;
