import { Badge } from "@/components/ui/badge";
import { Clock, Check, X } from "lucide-react";

export const PaymentsStatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    pending: { variant: "secondary" as const, label: "En attente", icon: Clock },
    verified: { variant: "default" as const, label: "Vérifié", icon: Check },
    rejected: { variant: "destructive" as const, label: "Rejeté", icon: X }
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


