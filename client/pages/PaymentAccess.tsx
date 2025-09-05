import { motion } from "framer-motion";
import { MoroccanPattern } from "@/components/ui/moroccan-pattern";
import { containerVariants } from "./payment-access/animation";
import { PaymentAccessHeader } from "./payment-access/PaymentAccessHeader";
import { PaymentAccessForm } from "./payment-access/PaymentAccessForm";
import { PaymentAccessInfo } from "./payment-access/PaymentAccessInfo";

const PaymentAccess = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-nuit-50 via-white to-sable-50 relative overflow-hidden">
      <MoroccanPattern />
      
      <PaymentAccessHeader />

      <main className="relative z-10 flex items-center justify-center px-6 py-12">
        <motion.div
          className="w-full max-w-md"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <PaymentAccessForm />
          <PaymentAccessInfo />
        </motion.div>
      </main>
    </div>
  );
};

export default PaymentAccess;
