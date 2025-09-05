import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { ChefHat, Menu as MenuIcon, X, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface NavigationProps {
  className?: string;
}

export const Navigation = ({ className }: NavigationProps) => {
  const { state: cartState } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { to: "/", label: "Accueil" },
    { to: "/menu", label: "Menu" },
    { to: "/offers", label: "Offres" },
    { to: "/about", label: "À propos" },
    { to: "/contact", label: "Contact" }
  ];

  return (
    <nav className={cn("bg-white/80 supports-[backdrop-filter]:backdrop-blur-md border-b border-sable-200 sticky top-0 z-50 shadow-sm", className)} role="navigation" aria-label="Navigation principale">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-offset-2 rounded-lg"
            aria-label="Retour à l'accueil"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-terracotta to-safran rounded-full flex items-center justify-center">
                <ChefHat className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div>
                <h1 className="font-display text-xl font-bold text-nuit-900">
                  CasaNawal
                </h1>
                <p className="text-xs text-nuit-600">
                  Cuisine Marocaine Authentique
                </p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navigationItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-nuit-700 hover:text-terracotta transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-terracotta/40 focus:ring-offset-2 rounded-lg px-2 py-1"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">

            
            {/* Cart Button */}
            <Button 
              asChild 
              className="bg-terracotta hover:bg-terracotta-600 text-white focus:ring-terracotta focus:ring-offset-2 relative"
            >
              <Link to="/cart">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Panier
                {cartState.itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-safran text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {cartState.itemCount}
                  </span>
                )}
              </Link>
            </Button>
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <MenuIcon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-sable-200 py-4 bg-white/95">
            <div className="flex flex-col space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="text-nuit-700 hover:text-terracotta hover:bg-sable-50 transition-colors font-medium px-4 py-3 rounded-lg text-left"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
