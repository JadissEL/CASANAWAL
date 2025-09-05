import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { CheckoutNav } from "./checkout/checkout-nav";
import { containerVariants, itemVariants } from "./checkout/checkout-animations";
import { useCheckoutPage } from "./checkout/checkout-hooks";
import { CheckoutForm } from "./checkout/checkout-form";
import { CheckoutSummary } from "./checkout/checkout-summary";

const Checkout = () => {
  const { state, isLoading, formData, timeSlots, handleInputChange, validatePhone, isFormValid, submitOrder } = useCheckoutPage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      // TODO: Replace with proper toast notification
      alert("Veuillez remplir tous les champs obligatoires correctement");
      return;
    }
    const orderRef = await submitOrder();
    window.location.assign(`/order-confirmation?ref=${orderRef}`);
  };

  return (
    <div className="min-h-screen bg-sable-50">
      {/* Navigation */}
      <CheckoutNav itemCount={state.itemCount} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-terracotta hover:text-terracotta-600 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour au panier
        </Link>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-nuit-900 mb-4">
              Finaliser votre commande
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-terracotta to-safran mx-auto"></div>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Order Form */}
            <CheckoutForm 
              formData={formData}
              timeSlots={timeSlots}
              isLoading={isLoading}
              validatePhone={validatePhone}
              isFormValid={isFormValid}
              onChange={handleInputChange}
              onSubmit={handleSubmit}
            />

            {/* Order Summary */}
            <CheckoutSummary
              items={state.items}
              subtotal={state.total}
              deliveryFee={25}
              total={state.total}
            />
            {/* TODO: Use dynamic delivery fee from cart context */}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;
