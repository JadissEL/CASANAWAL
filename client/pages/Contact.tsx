import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useLanguage } from "@/lib/useLanguage";
import { ChefHat, ArrowLeft, Phone, Mail, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const Contact = () => {
  const { isRTL, t } = useLanguage();

  return (
    <div className="min-h-screen bg-sable-50">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-sable-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <div className={cn(
                "flex items-center gap-3",
                isRTL ? "flex-row-reverse" : "flex-row"
              )}>
                <div className="w-10 h-10 bg-gradient-to-br from-terracotta to-safran rounded-full flex items-center justify-center">
                  <ChefHat className="h-6 w-6 text-white" />
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
              <Button className="bg-terracotta hover:bg-terracotta-600 text-white">
                {t('nav.cart')} (0)
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-terracotta hover:text-terracotta-600 mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            {isRTL ? "العودة للرئيسية" : "Retour à l'accueil"}
          </Link>
          
          <h1 className={cn(
            "font-display text-4xl md:text-5xl font-bold text-nuit-900 mb-6",
            isRTL ? "font-cairo" : ""
          )}>
            {t('nav.contact')}
          </h1>
          
          <div className="w-24 h-1 bg-gradient-to-r from-terracotta to-safran mx-auto mb-8"></div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Phone */}
          <div className="bg-white rounded-2xl p-6 shadow-soft text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-terracotta to-safran rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-nuit-900 mb-2">
              {isRTL ? "الهاتف" : "Téléphone"}
            </h3>
            <p className="text-nuit-600 text-sm">+212 6 XX XX XX XX</p>
          </div>

          {/* Email */}
          <div className="bg-white rounded-2xl p-6 shadow-soft text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-safran to-zellige rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-nuit-900 mb-2">
              {isRTL ? "البريد الإلكتروني" : "Email"}
            </h3>
            <p className="text-nuit-600 text-sm">contact@casanawal.ma</p>
          </div>

          {/* Location */}
          <div className="bg-white rounded-2xl p-6 shadow-soft text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-zellige to-terracotta rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-nuit-900 mb-2">
              {isRTL ? "الموقع" : "Localisation"}
            </h3>
            <p className="text-nuit-600 text-sm">
              {isRTL ? "الدار البيضاء، المغرب" : "Casablanca, Maroc"}
            </p>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-soft max-w-2xl mx-auto">
            <h3 className={cn(
              "font-display text-xl font-semibold text-nuit-900 mb-4",
              isRTL ? "font-cairo" : ""
            )}>
              {isRTL ? "تواصل معنا" : "Contactez-nous"}
            </h3>
            <p className={cn(
              "text-nuit-600 mb-6",
              isRTL ? "font-cairo" : ""
            )}>
              {isRTL 
                ? "سنكون سعداء لسماع آرائكم واقتراحاتكم. تواصلوا معنا للحصول على معلومات حول الطلبات والخ��مات."
                : "Nous serions ravis d'entendre vos commentaires et suggestions. Contactez-nous pour toute information concernant les commandes et services."
              }
            </p>
            
            <Button 
              asChild
              className="bg-terracotta hover:bg-terracotta-600 text-white px-8 py-3"
            >
              <Link to="/">
                {isRTL ? "العودة للقائمة الرئيسية" : "Retour au Menu Principal"}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
