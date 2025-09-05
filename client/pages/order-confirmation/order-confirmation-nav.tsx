import { Link } from "react-router-dom";
import { ChefHat } from "lucide-react";
import { cn } from "@/lib/utils";

export const OrderConfirmationNav = () => (
  <nav className="bg-white/95 backdrop-blur-sm border-b border-sable-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <Link to="/" className="flex items-center">
          <div className={cn(
            "flex items-center gap-3"
          )}>
            <div className="w-10 h-10 bg-gradient-to-br from-terracotta to-safran rounded-full flex items-center justify-center">
              <ChefHat className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-nuit-900">
                {"CasaNawal"}
              </h1>
              <p className="text-xs text-nuit-600">
                {"Cuisine Marocaine Authentique"}
              </p>
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <Link 
            to="/"
            className="bg-terracotta hover:bg-terracotta-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            {"Nouveau menu"}
          </Link>
        </div>
      </div>
    </div>
  </nav>
);
