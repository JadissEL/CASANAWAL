import { Link } from "react-router-dom";
import { Button } from "./button";
import { LanguageToggle } from "./language-toggle";
import { useLanguage } from "@/lib/useLanguage";
import { ChefHat } from "lucide-react";
import { cn } from "@/lib/utils";

export const Navigation = () => {
  const { isRTL, t } = useLanguage();

  return (
    <nav 
      className="bg-white/95 backdrop-blur-sm border-b border-sable-200 sticky top-0 z-50"
      role="navigation"
      aria-label={isRTL ? "التنقل الرئيسي" : "Navigation principale"}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link 
            to="/" 
            className="flex items-center focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-offset-2 rounded-lg"
            aria-label={isRTL ? "العودة إلى الصفحة الرئيسية" : "Retour à l'accueil"}
          >
            <div className={cn(
              "flex items-center gap-3",
              isRTL ? "flex-row-reverse" : "flex-row"
            )}>
              <div className="w-10 h-10 bg-gradient-to-br from-terracotta to-safran rounded-full flex items-center justify-center">
                <ChefHat className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div>
                <h1 className="font-display text-xl font-bold text-nuit-900">
                  {isRTL ? "كازا نوال" : "CasaNawal"}
                </h1>
                <p className="text-xs text-nuit-600">
                  {isRTL ? "المطبخ المغربي الأصيل" : "Cuisine Marocaine Authentique"}
                </p>
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <LanguageToggle />
            <Button 
              asChild
              variant="outline"
              className="hidden sm:inline-flex focus:ring-terracotta"
            >
              <Link to="/login">
                {t('nav.login')}
              </Link>
            </Button>
            <Button className="bg-terracotta hover:bg-terracotta-600 text-white focus:ring-terracotta focus:ring-offset-2">
              {t('nav.cart')} (0)
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
