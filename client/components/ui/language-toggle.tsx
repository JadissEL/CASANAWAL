import { Button } from "./button";
import { useLanguage } from "@/lib/useLanguage";
import { Globe } from "lucide-react";

export const LanguageToggle = () => {
  const { currentLanguage, changeLanguage } = useLanguage();
  
  const toggleLanguage = () => {
    changeLanguage(currentLanguage === 'fr' ? 'ar' : 'fr');
  };
  
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="gap-2"
    >
      <Globe className="h-4 w-4" />
      <span className="font-medium">
        {currentLanguage === 'fr' ? 'العربية' : 'Français'}
      </span>
    </Button>
  );
};
