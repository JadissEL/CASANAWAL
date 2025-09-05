import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, Package, Bell, Truck, XCircle } from "lucide-react";

export const OrdersStatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    pending: { variant: "secondary" as const, label: "En attente", icon: Clock },
    confirmed: { variant: "default" as const, label: "Confirmée", icon: CheckCircle },
    preparing: { variant: "default" as const, label: "Préparation", icon: Package },
    ready: { variant: "default" as const, label: "Prête", icon: Bell },
    delivering: { variant: "default" as const, label: "Livraison", icon: Truck },
    completed: { variant: "default" as const, label: "Terminée", icon: CheckCircle },
    cancelled: { variant: "destructive" as const, label: "Annulée", icon: XCircle }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};
