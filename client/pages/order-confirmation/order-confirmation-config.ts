import { PaymentConfig } from "./order-confirmation-types";

// Payment configuration (in a real app, these would come from environment variables)
export const paymentConfig: PaymentConfig = {
  banks: [
    {
      name: "Banque Populaire",
      rib: "011 780 0000123456789 38",
      beneficiary: "CASANAWAL CUISINE SARL"
    },
    {
      name: "Attijariwafa Bank",
      rib: "007 840 0000987654321 75",
      beneficiary: "CASANAWAL CUISINE SARL"
    }
  ],
  cashDepositBeneficiary: "CASANAWAL CUISINE",
  supportPhone: "+212 6 12 34 56 78",
  autoCancelHours: 24
};
