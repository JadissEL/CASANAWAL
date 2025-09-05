// OrderConfirmation component types and interfaces

export interface OrderData {
  reference: string;
  pricing: {
    total: number;
    deposit_required: number;
  };
  customer: {
    phone: string;
  };
  delivery: {
    date: string;
    slot: string;
  };
}

export interface PaymentConfig {
  banks: Array<{
    name: string;
    rib: string;
    beneficiary: string;
  }>;
  cashDepositBeneficiary: string;
  supportPhone: string;
  autoCancelHours: number;
}

export interface OrderConfirmationProps {
  orderData: OrderData;
  copySuccess: string;
  proofFile: File | null;
  onCopyToClipboard: (text: string, type: string) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface OrderHeaderProps {
  orderData: OrderData;
  copySuccess: string;
  onCopyToClipboard: (text: string, type: string) => void;
}

export interface PaymentMethodsProps {
  orderData: OrderData;
  paymentConfig: PaymentConfig;
  copySuccess: string;
  onCopyToClipboard: (text: string, type: string) => void;
}

export interface ProofUploadProps {
  proofFile: File | null;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface OrderConfirmationRemindersProps {
  paymentConfig: PaymentConfig;
  orderData: OrderData;
}
