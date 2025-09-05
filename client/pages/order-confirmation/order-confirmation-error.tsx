import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const OrderConfirmationError = () => (
  <div className="min-h-screen bg-sable-50 flex items-center justify-center">
    <div className="text-center">
      <h1 className={cn(
        "text-xl font-semibold text-nuit-900 mb-4"
      )}>
        {"Commande non trouvée"}
      </h1>
      <Button asChild className="bg-terracotta hover:bg-terracotta-600 text-white">
        <Link to="/">
          {"Retour à l'accueil"}
        </Link>
      </Button>
    </div>
  </div>
);
