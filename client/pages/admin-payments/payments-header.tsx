import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentsHeaderProps {
  loading: boolean;
  onRefresh: () => void;
}

export const PaymentsHeader = ({ loading, onRefresh }: PaymentsHeaderProps) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Gestion des paiements</h1>
      <p className="text-gray-600 mt-2">Vérifiez les reçus de paiement des clients</p>
    </div>

    <div className="flex items-center space-x-4 mt-4 sm:mt-0">
      <Button
        variant="outline"
        size="sm"
        onClick={onRefresh}
        disabled={loading}
      >
        <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
        Actualiser
      </Button>
    </div>
  </div>
);
