import { Link } from "react-router-dom";
import { ChefHat } from "lucide-react";

export const PaymentHeader = () => {
  return (
    <header className="bg-white shadow-sm border-b border-sable-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <ChefHat className="h-8 w-8 text-terracotta" />
            <span className="text-xl font-bold text-nuit-800">CasaNawal</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
