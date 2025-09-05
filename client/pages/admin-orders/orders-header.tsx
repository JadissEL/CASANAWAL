import { Button } from "@/components/ui/button";
import { RefreshCw, Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrdersHeaderProps {
  isLoading: boolean;
  onRefresh: () => void;
}

export const OrdersHeader = ({ isLoading, onRefresh }: OrdersHeaderProps) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 className="admin-page-title">Gestion des commandes</h1>
      <p className="admin-page-subtitle">Gérez et suivez toutes les commandes</p>
    </div>

    <div className="flex items-center space-x-4 mt-4 sm:mt-0">
      <Button
        variant="outline"
        size="sm"
        onClick={onRefresh}
        disabled={isLoading}
      >
        <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
        Actualiser
      </Button>
      <Button size="sm">
        <Download className="h-4 w-4 mr-2" />
        Exporter
      </Button>
    </div>
  </div>
);
