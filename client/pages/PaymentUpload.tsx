import { Link } from "react-router-dom";
import { motion, cubicBezier } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { usePaymentUpload } from "./payment/usePaymentUpload";
import { PaymentHeader } from "./payment/PaymentHeader";
import { UploadSuccess } from "./payment/UploadSuccess";
import { PaymentUploadForm } from "./payment/PaymentUploadForm";
import { PaymentInstructions } from "./payment/PaymentInstructions";

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
      ease: cubicBezier(0.25, 1, 0.5, 1)
    }
  }
};

const PaymentUpload = () => {
  const { uploadSuccess, orderDetails } = usePaymentUpload();

  if (uploadSuccess) {
    return <UploadSuccess orderDetails={orderDetails} />;
  }

  return (
    <div className="min-h-screen bg-sable-50">
      <PaymentHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.div variants={itemVariants}>
            <Link
              to="/cart"
              className="inline-flex items-center text-terracotta hover:text-terracotta-600 font-medium mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Link>
            
            <h1 className="text-3xl font-bold text-nuit-800 mb-2">
              Upload du reçu de paiement
            </h1>
            <p className="text-nuit-600">
              Téléchargez votre reçu de paiement pour confirmer votre commande
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div variants={itemVariants}>
              <PaymentUploadForm />
            </motion.div>

            <motion.div variants={itemVariants}>
              <PaymentInstructions />
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default PaymentUpload;
