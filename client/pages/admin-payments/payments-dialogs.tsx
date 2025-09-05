import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PaymentsStatusBadge } from "./payments-status-badge";

interface PaymentReceipt {
  id: string;
  order_code: string;
  customer_name: string;
  amount: number;
  receipt_url: string;
  status: string;
}

interface PaymentsDialogsProps {
  selectedPayment: PaymentReceipt | null;
  isReceiptDialogOpen: boolean;
  setIsReceiptDialogOpen: (open: boolean) => void;
  isActionDialogOpen: boolean;
  setIsActionDialogOpen: (open: boolean) => void;
  actionType: "verify" | "reject" | "request_new";
  actionNotes: string;
  setActionNotes: (notes: string) => void;
  processing: boolean;
  onHandlePaymentAction: (paymentId: string, action: string, notes?: string) => void;
}

export const PaymentsDialogs = ({
  selectedPayment,
  isReceiptDialogOpen,
  setIsReceiptDialogOpen,
  isActionDialogOpen,
  setIsActionDialogOpen,
  actionType,
  actionNotes,
  setActionNotes,
  processing,
  onHandlePaymentAction
}: PaymentsDialogsProps) => (
  <>
    {/* Receipt Dialog */}
    <Dialog open={isReceiptDialogOpen} onOpenChange={setIsReceiptDialogOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Reçu de paiement</DialogTitle>
        </DialogHeader>

        {selectedPayment && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Commande</Label>
                <p className="font-medium">{selectedPayment.order_code}</p>
              </div>
              <div>
                <Label>Montant</Label>
                <p className="font-medium">{selectedPayment.amount.toFixed(2)} DH</p>
              </div>
              <div>
                <Label>Client</Label>
                <p className="font-medium">{selectedPayment.customer_name}</p>
              </div>
              <div>
                <Label>Statut</Label>
                <PaymentsStatusBadge status={selectedPayment.status} />
              </div>
            </div>

            <div>
              <Label>Image du reçu</Label>
              <div className="mt-2 border rounded-lg p-4">
                <img
                  src={selectedPayment.receipt_url}
                  alt="Reçu de paiement"
                  className="max-w-full h-auto"
                />
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>

    {/* Action Dialog */}
    <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {actionType === "verify" && "Vérifier le paiement"}
            {actionType === "reject" && "Rejeter le paiement"}
            {actionType === "request_new" && "Demander un nouveau reçu"}
          </DialogTitle>
        </DialogHeader>

        {actionType === "reject" && (
          <div>
            <Label>Raison du rejet</Label>
            <Textarea
              value={actionNotes}
              onChange={(e) => setActionNotes(e.target.value)}
              placeholder="Expliquez pourquoi ce reçu est rejeté..."
              className="mt-1"
            />
          </div>
        )}

        {actionType === "request_new" && (
          <div>
            <p className="text-sm text-gray-600">
              Le client recevra un email avec votre demande et un lien pour uploader un nouveau reçu.
            </p>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsActionDialogOpen(false)}
          >
            Annuler
          </Button>
          <Button
            onClick={() => onHandlePaymentAction(
              selectedPayment?.id || "",
              actionType,
              actionNotes
            )}
            disabled={processing}
          >
            {processing ? "Traitement..." : (
              actionType === "verify" ? "Vérifier" :
              actionType === "reject" ? "Rejeter" : "Demander"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </>
);
