import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useLanguage } from "@/lib/useLanguage";
import { 
  ChefHat, 
  ArrowLeft, 
  CreditCard,
  Search,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

const PaymentAccess = () => {
  const { isRTL, t } = useLanguage();
  const navigate = useNavigate();
  const [orderRef, setOrderRef] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const validateOrderReference = (ref: string): boolean => {
    // Validate NAW reference format: NAW-YYYYMMDD-XXXXX (final code 4 to 8 alphanumerics)
    const refPattern = /^NAW-\d{8}-[A-Z0-9]{4,8}$/;
    return refPattern.test(ref.trim().toUpperCase());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedRef = orderRef.trim().toUpperCase();

    if (!trimmedRef) {
      setError(isRTL ? "يرجى إدخال رمز المرجع" : "Veuillez entrer le numéro de référence");
      return;
    }

    // Validate reference format
    if (!validateOrderReference(trimmedRef)) {
      setError(isRTL ?
        "تنسيق رقم المرجع غير صحيح. يجب أن يكون NAW-YYYYMMDD-XXXX مع 4 إلى 8 أحرف/أرقام في الأخير" :
        "Format de référence invalide. Utilisez NAW-YYYYMMDD-XXXX avec 4 à 8 caractères alphanumériques à la fin"
      );
      return;
    }

    setIsLoading(true);

    try {
      // Check if order exists in localStorage (current or history)
      const storedOrder = localStorage.getItem('current-order');
      let orderFound = false;
      let matchedOrder: any | null = null;

      if (storedOrder) {
        try {
          const parsed = JSON.parse(storedOrder);
          if (parsed.reference === trimmedRef) {
            orderFound = true;
            matchedOrder = parsed;
          }
        } catch (error) {
          console.error('Error parsing stored order:', error);
        }
      }

      if (!orderFound) {
        try {
          const ordersStr = localStorage.getItem('orders');
          const ordersArr = Array.isArray(JSON.parse(ordersStr || 'null')) ? JSON.parse(ordersStr || '[]') : [];
          const found = ordersArr.find((o: any) => o?.reference === trimmedRef);
          if (found) {
            orderFound = true;
            matchedOrder = found;
            // Set as current for downstream pages
            localStorage.setItem('current-order', JSON.stringify(found));
          }
        } catch (err) {
          console.error('Error parsing orders history:', err);
        }
      }

      // In a real application, you would make an API call here:
      // const response = await fetch(`/api/orders/${trimmedRef}/verify`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ reference: trimmedRef })
      // });
      // const result = await response.json();
      // if (response.ok && result.exists) { orderFound = true; }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (orderFound) {
        // Redirect to order confirmation page with the reference
        navigate(`/order-confirmation?ref=${trimmedRef}`);
      } else {
        setError(isRTL ? "رقم المرجع غير صالح أو لا يوجد طلب مطابق. يرجى المحاولة مرة أخرى." : "Numéro de référence invalide ou aucune commande correspondante trouvée. Veuillez réessayer.");
      }
    } catch (error) {
      console.error('Error verifying order:', error);
      setError(isRTL ? "حدث خطأ أثناء التحقق من رقم المرجع" : "Une erreur s'est produite lors de la vérification du numéro de référence");
    } finally {
      setIsLoading(false);
    }
  };

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
              <Button asChild className="bg-terracotta hover:bg-terracotta-600 text-white">
                <Link to="/">
                  {isRTL ? "العودة للرئيسية" : "Retour à l'accueil"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back Button */}
        <Link 
          to="/" 
          className={cn(
            "inline-flex items-center gap-2 text-terracotta hover:text-terracotta-600 mb-8 transition-colors",
            isRTL ? "flex-row-reverse" : "flex-row"
          )}
        >
          <ArrowLeft className={cn("h-4 w-4", isRTL ? "rotate-180" : "")} />
          {isRTL ? "العودة للرئيسية" : "Retour à l'accueil"}
        </Link>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-terracotta to-safran rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="h-8 w-8 text-white" />
            </div>
            <h1 className={cn(
              "font-display text-3xl md:text-4xl font-bold text-nuit-900 mb-4",
              isRTL ? "font-cairo" : ""
            )}>
              {isRTL ? "الوصول لصفحة الدفع" : "Accès à la page de paiement"}
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-terracotta to-safran mx-auto mb-6"></div>
            <p className={cn(
              "text-lg text-nuit-600 max-w-lg mx-auto",
              isRTL ? "font-cairo" : ""
            )}>
              {isRTL ? 
                "أدخل رقم مرجع طلبك للوصول إلى صفحة الدفع وإكمال عملية الدفع" : 
                "Entrez votre numéro de référence de commande pour accéder à votre page de paiement et finaliser votre commande"
              }
            </p>
          </motion.div>

          {/* Form */}
          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-xl p-8 shadow-soft border border-sable-200"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Order Reference Input */}
              <div className="space-y-2">
                <label 
                  htmlFor="orderRef" 
                  className={cn(
                    "text-sm font-medium text-nuit-700 flex items-center gap-2",
                    isRTL ? "font-cairo text-right flex-row-reverse" : ""
                  )}
                >
                  <Search className="h-4 w-4 text-terracotta" />
                  {isRTL ? "رقم مرجع الطلب *" : "Numéro de référence de commande *"}
                </label>
                <input
                  type="text"
                  id="orderRef"
                  value={orderRef}
                  onChange={(e) => {
                    // Uppercase and keep only alphanumerics
                    let raw = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');

                    // Auto-format as NAW-YYYYMMDD-XXXXX (4-8 at the end) when starting with NAW
                    let formatted = raw;
                    if (raw.startsWith('NAW')) {
                      const rest = raw.slice(3);
                      const date = (rest.match(/^\d{0,8}/)?.[0]) ?? '';
                      let code = rest.slice(date.length).replace(/[^A-Z0-9]/g, '').slice(0, 8);
                      formatted = 'NAW';
                      if (date.length > 0) formatted += '-' + date;
                      if (code.length > 0) formatted += '-' + code;
                    }

                    // Limit length to max possible format length (21 chars)
                    if (formatted.length > 21) formatted = formatted.substring(0, 21);

                    setOrderRef(formatted);
                    if (error) setError("");
                  }}
                  className={cn(
                    "w-full bg-white border border-sable-300 rounded-lg px-4 py-3 text-nuit-900 placeholder-nuit-400 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-colors font-mono text-center text-lg tracking-wider",
                    isRTL ? "text-right font-cairo" : "",
                    error ? "border-red-300 focus:border-red-500 focus:ring-red/20" : ""
                  )}
                  placeholder={isRTL ? "NAW-20241220-ABC12" : "NAW-20241220-ABC12"}
                  maxLength={21}
                  required
                />
                <p className={cn(
                  "text-sm text-nuit-500",
                  isRTL ? "font-cairo text-right" : ""
                )}>
                  {isRTL ?
                    "يبدأ برمز NAW- ثم التاريخ (YYYYMMDD) ثم 4 إلى 8 أحرف/أرقام (مثال: NAW-20241220-ABC12)" :
                    "Commence par NAW-, puis la date (YYYYMMDD), puis 4 à 8 caractères alphanumériques (ex: NAW-20241220-ABC12)"
                  }
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 rounded-lg p-4"
                >
                  <div className={cn(
                    "flex items-center gap-3",
                    isRTL ? "flex-row-reverse" : "flex-row"
                  )}>
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                    <p className={cn(
                      "text-red-700",
                      isRTL ? "font-cairo text-right" : ""
                    )}>
                      {error}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading || !orderRef.trim()}
                className={cn(
                  "w-full bg-gradient-to-r from-terracotta to-safran hover:from-terracotta-600 hover:to-safran-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed",
                  isRTL ? "font-cairo" : ""
                )}
              >
                {isLoading ? (
                  <div className={cn(
                    "flex items-center gap-2",
                    isRTL ? "flex-row-reverse" : "flex-row"
                  )}>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {isRTL ? "جاري التحقق..." : "Vérification en cours..."}
                  </div>
                ) : (
                  <span className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    {isRTL ? "الوصول لصفحة الدفع" : "Accéder à la page de paiement"}
                  </span>
                )}
              </Button>
            </form>

            {/* Help Text */}
            <div className="mt-6 pt-6 border-t border-sable-200">
              <div className={cn(
                "text-center",
                isRTL ? "text-right" : "text-left"
              )}>
                <p className={cn(
                  "text-sm text-nuit-600 mb-2",
                  isRTL ? "font-cairo" : ""
                )}>
                  {isRTL ? "لا تجد رقم مرجع طلبك؟" : "Vous ne trouvez pas votre numéro de référence ?"}
                </p>
                <p className={cn(
                  "text-xs text-nuit-500",
                  isRTL ? "font-cairo" : ""
                )}>
                  {isRTL ? 
                    "تحقق من رسائل البريد الإلكتروني أو الرسائل النصية المرسلة بعد تأكيد طلبك" : 
                    "Vérifiez vos emails ou SMS envoyés après la confirmation de votre commande"
                  }
                </p>
              </div>
            </div>
          </motion.div>

          {/* Additional Info */}
          <motion.div 
            variants={itemVariants}
            className="mt-8 bg-gradient-to-r from-terracotta/10 to-safran/10 rounded-xl p-6 border border-terracotta/20"
          >
            <h3 className={cn(
              "font-display text-lg font-bold text-nuit-900 mb-3",
              isRTL ? "font-cairo text-right" : ""
            )}>
              {isRTL ? "معلومات مهمة" : "Informations importantes"}
            </h3>
            <ul className={cn(
              "space-y-2 text-sm text-nuit-700",
              isRTL ? "font-cairo text-right" : ""
            )}>
              <li className="flex items-start gap-2">
                <span className="text-terracotta mt-1">•</span>
                <span>
                  {isRTL ? 
                    "يمكنك الوصول لصفحة الدفع في أي وقت باستخدام رقم المرجع" : 
                    "Vous pouvez accéder à votre page de paiement à tout moment avec votre numéro de référence"
                  }
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-terracotta mt-1">•</span>
                <span>
                  {isRTL ? 
                    "الدفعة المطلوبة هي 50% من قيمة الطلب لتأكيد الحجز" : 
                    "Un acompte de 50% est requis pour confirmer votre commande"
                  }
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-terracotta mt-1">•</span>
                <span>
                  {isRTL ? 
                    "في حالة عدم الدفع خلال ساعتين، قد يتم إلغاء الطلب تلقائياً" : 
                    "Sans paiement dans les 2 heures, votre commande peut être annulée automatiquement"
                  }
                </span>
              </li>
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentAccess;
