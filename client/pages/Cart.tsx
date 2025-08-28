import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useLanguage } from "@/lib/useLanguage";
import { useCart } from "@/contexts/CartContext";
import { ChefHat, ArrowLeft, Plus, Minus, Trash2, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

const Cart = () => {
  const { isRTL, t } = useLanguage();
  const { state, updateQuantity, removeItem } = useCart();

  const deliveryFee = 25; // MAD
  const total = state.total + deliveryFee;

  return (
    <div className="min-h-screen bg-sable-50">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-sable-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <div className={cn(
                "flex items-center gap-3",
                isRTL ? "flex-row-reverse" : "flex-row"
              )}>
                <div className="w-10 h-10 bg-gradient-to-br from-terracotta to-safran rounded-full flex items-center justify-center">
                  <ChefHat className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="font-display text-xl font-bold text-nuit-900">
                    {isRTL ? "كازا نوال" : "CasaNawal"}
                  </h1>
                  <p className="text-xs text-nuit-600">
                    {isRTL ? "المطبخ المغربي الأصيل" : "Cuisine Marocaine Authentique"}
                  </p>
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              <LanguageToggle />
              <Button className="bg-terracotta hover:bg-terracotta-600 text-white">
                <ShoppingCart className="h-4 w-4 mr-2" />
                ({state.itemCount})
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link 
          to="/" 
          className={cn(
            "inline-flex items-center gap-2 text-terracotta hover:text-terracotta-600 mb-8 transition-colors",
            isRTL ? "flex-row-reverse" : "flex-row"
          )}
        >
          <ArrowLeft className={cn("h-4 w-4", isRTL ? "rotate-180" : "")} />
          {isRTL ? "العودة للقائمة" : "Retour au menu"}
        </Link>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h1 className={cn(
              "font-display text-3xl md:text-4xl font-bold text-nuit-900 mb-4",
              isRTL ? "font-cairo" : ""
            )}>
              {isRTL ? "سلة التسوق" : "Votre Panier"}
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
              <h2 className={cn(
                "text-xl font-semibold text-nuit-600 mb-2",
                isRTL ? "font-cairo" : ""
              )}>
                {isRTL ? "سلة التسوق فارغة" : "Votre panier est vide"}
              </h2>
              <p className={cn(
                "text-nuit-500 mb-6",
                isRTL ? "font-cairo" : ""
              )}>
                {isRTL ? "أضف ��نتجات لذيذة من قائمتنا" : "Ajoutez de délicieux plats de notre menu"}
              </p>
              <Button asChild className="bg-terracotta hover:bg-terracotta-600 text-white">
                <Link to="/">
                  {isRTL ? "تصفح القائمة" : "Parcourir le menu"}
                </Link>
              </Button>
            </motion.div>
          ) : (
            /* Cart with Items */
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <motion.div variants={itemVariants} className="space-y-4">
                  {state.items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl p-4 shadow-soft border border-sable-200"
                    >
                      <div className={cn(
                        "flex gap-4",
                        isRTL ? "flex-row-reverse" : "flex-row"
                      )}>
                        {/* Product Image */}
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-sable-100 flex-shrink-0">
                          <img
                            src={item.image}
                            alt={isRTL ? item.nameAr : item.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <h3 className={cn(
                            "font-semibold text-nuit-900 mb-1",
                            isRTL ? "font-cairo text-right" : ""
                          )}>
                            {isRTL ? item.nameAr : item.name}
                          </h3>
                          <p className={cn(
                            "text-terracotta font-bold text-lg mb-3",
                            isRTL ? "text-right" : ""
                          )}>
                            {item.price} {isRTL ? "درهم" : "MAD"}
                          </p>

                          {/* Quantity Controls */}
                          <div className={cn(
                            "flex items-center gap-3",
                            isRTL ? "flex-row-reverse" : "flex-row"
                          )}>
                            <div className="flex items-center border border-sable-300 rounded-lg">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-2 h-8 w-8"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="px-3 py-1 text-sm font-medium text-nuit-900 min-w-[2rem] text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-2 h-8 w-8"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2 h-8 w-8"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        {/* Item Total */}
                        <div className={cn(
                          "text-right",
                          isRTL ? "text-left" : ""
                        )}>
                          <p className="font-bold text-lg text-nuit-900">
                            {(item.price * item.quantity).toFixed(2)} {isRTL ? "درهم" : "MAD"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Order Summary */}
              <motion.div variants={itemVariants} className="lg:col-span-1">
                <div className="bg-white rounded-xl p-6 shadow-soft border border-sable-200 sticky top-8">
                  <h3 className={cn(
                    "font-display text-xl font-bold text-nuit-900 mb-6",
                    isRTL ? "font-cairo text-right" : ""
                  )}>
                    {isRTL ? "ملخص الطلب" : "Résumé de la commande"}
                  </h3>

                  <div className="space-y-4 mb-6">
                    <div className={cn(
                      "flex justify-between",
                      isRTL ? "flex-row-reverse" : "flex-row"
                    )}>
                      <span className={cn(
                        "text-nuit-600",
                        isRTL ? "font-cairo" : ""
                      )}>
                        {isRTL ? "المجموع الفرعي" : "Sous-total"}
                      </span>
                      <span className="font-semibold text-nuit-900">
                        {state.total.toFixed(2)} {isRTL ? "درهم" : "MAD"}
                      </span>
                    </div>

                    <div className={cn(
                      "flex justify-between",
                      isRTL ? "flex-row-reverse" : "flex-row"
                    )}>
                      <span className={cn(
                        "text-nuit-600",
                        isRTL ? "font-cairo" : ""
                      )}>
                        {isRTL ? "رسوم التوصيل" : "Frais de livraison"}
                      </span>
                      <span className="font-semibold text-nuit-900">
                        {deliveryFee} {isRTL ? "درهم" : "MAD"}
                      </span>
                    </div>

                    <div className="border-t border-sable-200 pt-4">
                      <div className={cn(
                        "flex justify-between",
                        isRTL ? "flex-row-reverse" : "flex-row"
                      )}>
                        <span className={cn(
                          "text-lg font-bold text-nuit-900",
                          isRTL ? "font-cairo" : ""
                        )}>
                          {isRTL ? "المجموع الكلي" : "Total"}
                        </span>
                        <span className="text-lg font-bold text-terracotta">
                          {total.toFixed(2)} {isRTL ? "درهم" : "MAD"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    asChild
                    className="w-full bg-gradient-to-r from-terracotta to-safran hover:from-terracotta-600 hover:to-safran-600 text-white font-semibold py-3"
                  >
                    <Link to="/checkout">
                      {isRTL ? "إتمام الطلب" : "Procéder au checkout"}
                    </Link>
                  </Button>

                  <Button 
                    asChild
                    variant="outline"
                    className="w-full mt-3"
                  >
                    <Link to="/">
                      {isRTL ? "مواصلة التسوق" : "Continuer les achats"}
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Cart;
