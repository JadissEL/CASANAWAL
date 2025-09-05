import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";
import { OrderFilters } from "./orders-types";

interface OrdersFiltersProps {
  filters: OrderFilters;
  setFilters: (filters: OrderFilters | ((prev: OrderFilters) => OrderFilters)) => void;
  selectedOrders: string[];
  bulkAction: string;
  setBulkAction: (action: string) => void;
  onBulkAction: () => void;
  onClearSelection: () => void;
  isBulkUpdating: boolean;
}

export const OrdersFilters = ({
  filters,
  setFilters,
  selectedOrders,
  bulkAction,
  setBulkAction,
  onBulkAction,
  onClearSelection,
  isBulkUpdating
}: OrdersFiltersProps) => (
  <div className="space-y-4">
    {/* Main filters */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <Input
          placeholder="Rechercher une commande..."
          value={filters.search}
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          className="w-full"
        />
      </div>

      <Select
        value={filters.status}
        onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les statuts</SelectItem>
          <SelectItem value="pending">En attente</SelectItem>
          <SelectItem value="confirmed">Confirmées</SelectItem>
          <SelectItem value="preparing">En préparation</SelectItem>
          <SelectItem value="ready">Prêtes</SelectItem>
          <SelectItem value="delivering">En livraison</SelectItem>
          <SelectItem value="completed">Terminées</SelectItem>
          <SelectItem value="cancelled">Annulées</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.date_range}
        onValueChange={(value) => setFilters(prev => ({ ...prev, date_range: value }))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Période" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les dates</SelectItem>
          <SelectItem value="today">Aujourd'hui</SelectItem>
          <SelectItem value="week">Cette semaine</SelectItem>
          <SelectItem value="month">Ce mois</SelectItem>
        </SelectContent>
      </Select>

      <Button className="w-full">
        <Filter className="h-4 w-4 mr-2" />
        Appliquer les filtres
      </Button>
    </div>

    {/* Bulk actions */}
    {selectedOrders.length > 0 && (
      <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
        <span className="text-sm font-medium">
          {selectedOrders.length} commande(s) sélectionnée(s)
        </span>

        <Select value={bulkAction} onValueChange={setBulkAction}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Action groupée" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updateStatus">Changer le statut</SelectItem>
            <SelectItem value="delete">Annuler</SelectItem>
          </SelectContent>
        </Select>

        <Button
          onClick={onBulkAction}
          disabled={isBulkUpdating || !bulkAction}
          size="sm"
        >
          {isBulkUpdating ? "Traitement..." : "Appliquer"}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onClearSelection}
        >
          Annuler
        </Button>
      </div>
    )}
  </div>
);
