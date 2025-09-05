import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Phone, MapPin } from "lucide-react";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Order, StatusUpdate } from "./orders-types";
import { OrdersStatusBadge } from "./orders-status-badge";

interface OrdersDialogsProps {
  isStatusDialogOpen: boolean;
  setIsStatusDialogOpen: (open: boolean) => void;
  isDetailsOpen: boolean;
  setIsDetailsOpen: (open: boolean) => void;
  orderDetails: Order | null;
  statusUpdate: StatusUpdate;
  setStatusUpdate: (update: StatusUpdate | ((prev: StatusUpdate) => StatusUpdate)) => void;
  isUpdatingOrderStatus: boolean;
  onHandleStatusUpdate: () => void;
}

export const OrdersDialogs = ({
  isStatusDialogOpen,
  setIsStatusDialogOpen,
  isDetailsOpen,
  setIsDetailsOpen,
  orderDetails,
  statusUpdate,
  setStatusUpdate,
  isUpdatingOrderStatus,
  onHandleStatusUpdate
}: OrdersDialogsProps) => (
  <>
    {/* Status Update Dialog */}
    <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Changer le statut de la commande</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Nouveau statut</label>
            <Select
              value={statusUpdate.status}
              onValueChange={(value) =>
                setStatusUpdate(prev => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="confirmed">Confirmée</SelectItem>
                <SelectItem value="preparing">En préparation</SelectItem>
                <SelectItem value="ready">Prête</SelectItem>
                <SelectItem value="delivering">En livraison</SelectItem>
                <SelectItem value="completed">Terminée</SelectItem>
                <SelectItem value="cancelled">Annulée</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Notes (optionnel)</label>
            <Textarea
              value={statusUpdate.notes}
              onChange={(e) => setStatusUpdate(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Ajouter des notes sur ce changement de statut..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
            Annuler
          </Button>
          <Button
            onClick={onHandleStatusUpdate}
            disabled={isUpdatingOrderStatus || !statusUpdate.status}
          >
            {isUpdatingOrderStatus ? "Mise à jour..." : "Confirmer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* Order Details Dialog */}
    <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Détails de la commande #{orderDetails?.reference}</DialogTitle>
        </DialogHeader>

        {orderDetails && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Client Information */}
            <div>
              <h3 className="font-semibold mb-3">Informations client</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{orderDetails.client_phone || 'Non renseigné'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{orderDetails.delivery_address || 'Adresse non renseignée'}</span>
                </div>
              </div>
            </div>

            {/* Order Information */}
            <div>
              <h3 className="font-semibold mb-3">Informations commande</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Statut:</span>
                  <OrdersStatusBadge status={orderDetails.status} />
                </div>
                <div className="flex justify-between">
                  <span>Montant total:</span>
                  <span className="font-semibold">{orderDetails.total_amount} DH</span>
                </div>
                <div className="flex justify-between">
                  <span>Date de création:</span>
                  <span>{format(new Date(orderDetails.created_at), 'dd/MM/yyyy HH:mm', { locale: fr })}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  </>
);
