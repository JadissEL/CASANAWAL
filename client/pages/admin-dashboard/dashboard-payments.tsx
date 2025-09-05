import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Eye } from "lucide-react";
import { Payment } from "./dashboard-types";

interface DashboardPaymentsProps {
  payments: Payment[];
  onVerifyPayment: (paymentId: string) => void;
}

export const DashboardPayments = ({ payments, onVerifyPayment }: DashboardPaymentsProps) => (
  <div className="admin-card">
    <div className="admin-card-header">
      <div className="admin-card-title">💳 Gestion des Paiements ({payments.length})</div>
    </div>
    <div className="admin-card-content">
      <div className="space-y-4">
        {payments.slice(0, 10).map((payment) => (
          <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex-1">
              <h3 className="font-medium">Commande: {payment.order_reference}</h3>
              <p className="text-sm text-gray-600">Client: {payment.client_name}</p>
              <p className="text-lg font-bold">{payment.amount} DHS</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge
                variant={
                  payment.status === 'verified' ? "default" :
                  payment.status === 'pending' ? "secondary" : "destructive"
                }
              >
                {payment.status}
              </Badge>
              {payment.status === 'pending' && (
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    onClick={() => onVerifyPayment(payment.id)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              {payment.receipt_url && (
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
        {payments.length > 10 && (
          <p className="text-center text-gray-500">
            ... et {payments.length - 10} autres paiements
          </p>
        )}
      </div>
    </div>
  </div>
);
