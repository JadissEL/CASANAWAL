import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChefHat } from "lucide-react";
import { cn } from "@/lib/utils";

export const LoginNav = () => (
  <nav 
    className="bg-white/95 backdrop-blur-sm border-b border-sable-200 sticky top-0 z-50"
    role="navigation"
    aria-label="Navigation principale"
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <Link 
          to="/" 
          className="flex items-center focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-offset-2 rounded-lg"
          aria-label="Retour à l'accueil"
        >
          <div className={cn("flex items-center gap-3", "flex-row")}>
            <div className="w-10 h-10 bg-gradient-to-br from-terracotta to-safran rounded-full flex items-center justify-center">
              <ChefHat className="h-6 w-6 text-white" aria-hidden={true} />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-nuit-900">CasaNawal</h1>
              <p className="text-xs text-nuit-600">Cuisine Marocaine Authentique</p>
            </div>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <Button className="bg-terracotta hover:bg-terracotta-600 text-white focus:ring-terracotta focus:ring-offset-2">
            Panier (0)
          </Button>
        </div>
      </div>
    </div>
  </nav>
);


