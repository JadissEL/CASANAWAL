import { motion } from "framer-motion";
import { OrderConfirmationNav } from "./order-confirmation/order-confirmation-nav";
import { OrderConfirmationError } from "./order-confirmation/order-confirmation-error";
import { OrderHeader } from "./order-confirmation/order-header";
import { OrderConfirmationMessage } from "./order-confirmation/order-confirmation-message";
import { OrderConfirmationAmount } from "./order-confirmation/order-confirmation-amount";
import { OrderConfirmationPayment } from "./order-confirmation/order-confirmation-payment";
import { OrderConfirmationUpload } from "./order-confirmation/order-confirmation-upload";
import { OrderConfirmationReminders } from "./order-confirmation/order-confirmation-reminders";
import { OrderConfirmationBackButton } from "./order-confirmation/order-confirmation-back-button";
import { containerVariants } from "./order-confirmation/order-confirmation-animations";
import { useOrderConfirmation } from "./order-confirmation/order-confirmation-hooks";
import { paymentConfig } from "./order-confirmation/order-confirmation-config";

const OrderConfirmation = () => {
  const {
    orderData,
    copySuccess,
    proofFile,
    copyToClipboard,
    handleFileUpload
  } = useOrderConfirmation();

  if (!orderData) {
    return <OrderConfirmationError />;
  }

  return (
    <div className="min-h-screen bg-sable-50">
      <OrderConfirmationNav />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <OrderHeader
            orderData={orderData}
            copySuccess={copySuccess}
            onCopyToClipboard={copyToClipboard}
          />
          <OrderConfirmationMessage />
          <OrderConfirmationAmount orderData={orderData} />
          <OrderConfirmationPayment
            orderData={orderData}
            paymentConfig={paymentConfig}
            copySuccess={copySuccess}
            onCopyToClipboard={copyToClipboard}
          />
          <OrderConfirmationUpload
            proofFile={proofFile}
            onFileUpload={handleFileUpload}
          />
          <OrderConfirmationReminders
            paymentConfig={paymentConfig}
            orderData={orderData}
          />
          <OrderConfirmationBackButton />
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
