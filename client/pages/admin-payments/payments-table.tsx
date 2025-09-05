import { CreditCard, Eye, Check, X, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PaymentsStatusBadge } from "./payments-status-badge";

interface PaymentsTableProps {
  payments: Array<{
    id: string; order_code: string; customer_name: string; customer_email: string; amount: number; status: string; submitted_at: string; receipt_url: string;
  }>;
  onOpenReceipt: (payment: any) => void;
  onOpenAction: (payment: any, action: 'verify'|'reject'|'request_new') => void;
}

export const PaymentsTable = ({ payments, onOpenReceipt, onOpenAction }: PaymentsTableProps) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center">
        <CreditCard className="h-5 w-5 mr-2" />
        Paiements
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Commande</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">{payment.order_code}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{payment.customer_name}</p>
                    <p className="text-sm text-gray-500">{payment.customer_email}</p>
                  </div>
                </TableCell>
                <TableCell>{payment.amount.toFixed(2)} DH</TableCell>
                <TableCell>{new Date(payment.submitted_at).toLocaleDateString('fr-FR')}</TableCell>
                <TableCell><PaymentsStatusBadge status={payment.status} /></TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => onOpenReceipt(payment)}><Eye className="h-4 w-4" /></Button>
                    {payment.status === 'pending' && (
                      <>
                        <Button variant="ghost" size="sm" onClick={() => onOpenAction(payment, 'verify')}><Check className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => onOpenAction(payment, 'reject')}><X className="h-4 w-4" /></Button>
                      </>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => onOpenAction(payment, 'request_new')}><RefreshCw className="h-4 w-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </CardContent>
  </Card>
);


