import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useLanguage } from "@/lib/useLanguage";
import { useCart } from "@/contexts/CartContext";
import { 
  ChefHat, 
  ArrowLeft, 
  CheckCircle,
  Copy,
  Upload,
  CreditCard,
  Building2,
  Wallet,
  Phone,
  Clock,
  AlertTriangle
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

interface OrderData {
  reference: string;
  pricing: {
    total: number;
    deposit_required: number;
  };
  customer: {
    phone: string;
  };
  delivery: {
    date: string;
    slot: string;
  };
}

const OrderConfirmation = () => {
  const { isRTL, t } = useLanguage();
  const { clearCart } = useCart();
  const [searchParams] = useSearchParams();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [copySuccess, setCopySuccess] = useState<string>("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const cartClearedRef = useRef(false);

  const orderRef = searchParams.get('ref');

  // Payment configuration (in a real app, these would come from environment variables)
  const paymentConfig = {
    banks: [
      {
        name: "Banque Populaire",
        rib: "011 780 0000123456789 38",
        beneficiary: "CASANAWAL CUISINE SARL"
      },
      {
        name: "Attijariwafa Bank",
        rib: "007 840 0000987654321 75",
        beneficiary: "CASANAWAL CUISINE SARL"
      }
    ],
    cashDepositBeneficiary: "CASANAWAL CUISINE",
    supportPhone: "+212 6 XX XX XX XX",
    autoCancelHours: 2
  };

  useEffect(() => {
    const loadOrder = () => {
      // Try current-order first
      const storedOrder = localStorage.getItem('current-order');
      if (storedOrder) {
        try {
          const parsed = JSON.parse(storedOrder);
          if (parsed.reference === orderRef) {
            setOrderData(parsed);
            if (!cartClearedRef.current && parsed?.meta?.createdFromCheckout) {
              clearCart();
              cartClearedRef.current = true;
            }
            return;
          }
        } catch (error) {
          console.error('Error parsing current-order:', error);
        }
      }

      // Fallback to history array 'orders'
      try {
        const ordersStr = localStorage.getItem('orders');
        const ordersArr = Array.isArray(JSON.parse(ordersStr || 'null')) ? JSON.parse(ordersStr || '[]') : [];
        const found = ordersArr.find((o: any) => o?.reference === orderRef);
        if (found) {
          setOrderData(found);
          // Ensure current-order points to this for future navigations
          localStorage.setItem('current-order', JSON.stringify(found));
        }
      } catch (err) {
        console.error('Error parsing orders history:', err);
      }
    };

    loadOrder();
  }, [orderRef]);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(type);
      setTimeout(() => setCopySuccess(""), 2000);
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert(isRTL ? "حجم الملف يجب أن يكون أقل من 5 ميجابايت" : "La taille du fichier doit être inférieure à 5 MB");
        return;
      }
      setProofFile(file);
      // In a real app, you would upload the file to your server
      console.log('File selected for upload:', file.name);
    }
  };

  if (!orderData) {
    return (
      <div className="min-h-screen bg-sable-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className={cn(
            "text-xl font-semibold text-nuit-900 mb-4",
            isRTL ? "font-cairo" : ""
          )}>
            {isRTL ? "لم يتم العثور على الطلب" : "Commande non trouvée"}
          </h1>
          <Button asChild className="bg-terracotta hover:bg-terracotta-600 text-white">
            <Link to="/">
              {isRTL ? "العودة للرئ��سية" : "Retour à l'accueil"}
            </Link>
          </Button>
        </div>
      </div>
    );
  }

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
                  {isRTL ? "قائمة جديدة" : "Nouveau menu"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Success Header */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className={cn(
              "font-display text-3xl md:text-4xl font-bold text-nuit-900 mb-2",
              isRTL ? "font-cairo" : ""
            )}>
              {isRTL ? "تم استلام الطلب — إجراء مطلوب" : "Commande reçue — action requise"}
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-terracotta to-safran mx-auto mb-6"></div>
            
            {/* Order Reference */}
            <div className="bg-white rounded-xl p-6 shadow-soft border border-sable-200 mb-6">
              <div className={cn(
                "flex items-center justify-center gap-3",
                isRTL ? "flex-row-reverse" : "flex-row"
              )}>
                <span className={cn(
                  "text-lg font-semibold text-nuit-900",
                  isRTL ? "font-cairo" : ""
                )}>
                  {isRTL ? "رمز المرجع:" : "Code de référence :"}
                </span>
                <span className="font-mono text-xl font-bold text-terracotta bg-sable-100 px-4 py-2 rounded-lg">
                  {orderData.reference}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(orderData.reference, 'reference')}
                  className="p-2 h-8 w-8"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              {copySuccess === 'reference' && (
                <p className={cn(
                  "text-sm text-green-600 mt-2",
                  isRTL ? "font-cairo text-center" : "text-center"
                )}>
                  {isRTL ? "تم نسخ الرمز!" : "Code copié !"}
                </p>
              )}
            </div>
          </motion.div>

          {/* Main Message */}
          <motion.div variants={itemVariants} className="bg-gradient-to-r from-terracotta/10 to-safran/10 rounded-xl p-6 border border-terracotta/20 mb-8">
            <div className={cn(
              "text-center",
              isRTL ? "text-right" : "text-left"
            )}>
              <p className={cn(
                "text-lg text-nuit-900 mb-4 leading-relaxed",
                isRTL ? "font-cairo" : ""
              )}>
                {isRTL ? (
                  <>
                    شكراً لك! تم تسجيل طلبك بنجاح.<br />
                    سيقوم أحد أعضاء فريقنا ب��لاتصال بك خلال <strong>10 دقائق</strong> لتأكيد التفاصيل.<br />
                    لتأكيد الطلب، يرجى إيداع <strong>50% من المبلغ الإجمالي على الأقل</strong>.
                  </>
                ) : (
                  <>
                    Merci ! Votre commande a bien été enregistrée.<br />
                    Un membre de l'équipe vous appellera dans les <strong>10 minutes</strong> pour confirmer les détails.<br />
                    Pour valider la commande, merci d'effectuer un <strong>dépôt minimum de 50 %</strong> du total.
                  </>
                )}
              </p>
            </div>
          </motion.div>

          {/* Payment Amount */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-soft border border-sable-200 mb-8">
            <h2 className={cn(
              "font-display text-xl font-bold text-nuit-900 mb-4 text-center",
              isRTL ? "font-cairo" : ""
            )}>
              {isRTL ? "المبلغ المطلوب" : "Montant à déposer"}
            </h2>
            <div className="text-center">
              <div className="text-3xl font-bold text-terracotta mb-2">
                {orderData.pricing.deposit_required} {isRTL ? "درهم" : "MAD"}
              </div>
              <p className={cn(
                "text-nuit-600",
                isRTL ? "font-cairo" : ""
              )}>
                {isRTL ? `(50% من ${orderData.pricing.total} درهم)` : `(50% de ${orderData.pricing.total} MAD)`}
              </p>
            </div>
          </motion.div>

          {/* Payment Methods */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Bank Transfer */}
            <div className="bg-white rounded-xl p-6 shadow-soft border border-sable-200">
              <h3 className={cn(
                "font-display text-lg font-bold text-nuit-900 mb-4 flex items-center gap-2",
                isRTL ? "font-cairo flex-row-reverse" : ""
              )}>
                <Building2 className="h-5 w-5 text-terracotta" />
                {isRTL ? "تحويل بنكي" : "Virement bancaire"}
              </h3>
              
              <p className={cn(
                "text-nuit-600 mb-4",
                isRTL ? "font-cairo text-right" : ""
              )}>
                {isRTL ? "قم بتحويل المبلغ إلى أحد الحسابات التالية:" : "Effectuez un virement sur un des comptes ci-dessous :"}
              </p>

              <div className="space-y-4">
                {paymentConfig.banks.map((bank, index) => (
                  <div key={index} className="bg-sable-50 rounded-lg p-4">
                    <div className={cn(
                      "grid grid-cols-1 md:grid-cols-3 gap-3",
                      isRTL ? "text-right" : ""
                    )}>
                      <div>
                        <label className={cn(
                          "text-sm font-medium text-nuit-700",
                          isRTL ? "font-cairo" : ""
                        )}>
                          {isRTL ? "البنك" : "Banque"}
                        </label>
                        <p className="font-semibold text-nuit-900">{bank.name}</p>
                      </div>
                      <div>
                        <label className={cn(
                          "text-sm font-medium text-nuit-700",
                          isRTL ? "font-cairo" : ""
                        )}>
                          RIB
                        </label>
                        <div className="flex items-center gap-2">
                          <p className="font-mono text-sm text-nuit-900">{bank.rib}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(bank.rib, `rib-${index}`)}
                            className="p-1 h-6 w-6"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        {copySuccess === `rib-${index}` && (
                          <p className="text-xs text-green-600 mt-1">
                            {isRTL ? "تم النسخ!" : "Copié !"}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className={cn(
                          "text-sm font-medium text-nuit-700",
                          isRTL ? "font-cairo" : ""
                        )}>
                          {isRTL ? "المستفيد" : "Bénéficiaire"}
                        </label>
                        <p className="font-semibold text-nuit-900">{bank.beneficiary}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cash Deposit */}
            <div className="bg-white rounded-xl p-6 shadow-soft border border-sable-200">
              <h3 className={cn(
                "font-display text-lg font-bold text-nuit-900 mb-4 flex items-center gap-2",
                isRTL ? "font-cairo flex-row-reverse" : ""
              )}>
                <Wallet className="h-5 w-5 text-terracotta" />
                Wafacash / CashPlus
              </h3>
              
              <div className="bg-sable-50 rounded-lg p-4">
                <p className={cn(
                  "text-nuit-900 mb-2",
                  isRTL ? "font-cairo text-right" : ""
                )}>
                  {isRTL ? (
                    <>قم بإيداع المبلغ باسم: <strong>{paymentConfig.cashDepositBeneficiary}</strong></>
                  ) : (
                    <>Effectuez un dépôt au nom de : <strong>{paymentConfig.cashDepositBeneficiary}</strong></>
                  )}
                </p>
                <p className={cn(
                  "text-sm text-nuit-600",
                  isRTL ? "font-cairo text-right" : ""
                )}>
                  {isRTL ? "احتفظ بإيصال الإيداع" : "Conservez le reçu de dépôt"}
                </p>
              </div>
            </div>

            {/* Important Note */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <div className={cn(
                "flex items-start gap-3",
                isRTL ? "flex-row-reverse" : "flex-row"
              )}>
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className={cn(
                    "font-semibold text-amber-800 mb-2",
                    isRTL ? "font-cairo text-right" : ""
                  )}>
                    {isRTL ? "مهم جداً" : "Important"}
                  </h4>
                  <p className={cn(
                    "text-amber-700 mb-2",
                    isRTL ? "font-cairo text-right" : ""
                  )}>
                    {isRTL ? (
                      <>أدرج رمز ��لمرجع هذا في موضوع التحويل أو رسالة الإيداع: <strong>{orderData.reference}</strong></>
                    ) : (
                      <>Incluez ce code de référence dans le motif du virement / message de dépôt : <strong>{orderData.reference}</strong></>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Upload Proof */}
            <div className="bg-white rounded-xl p-6 shadow-soft border border-sable-200">
              <h3 className={cn(
                "font-display text-lg font-bold text-nuit-900 mb-4 flex items-center gap-2",
                isRTL ? "font-cairo flex-row-reverse" : ""
              )}>
                <Upload className="h-5 w-5 text-terracotta" />
                {isRTL ? "إثبات الدفع" : "Preuve de paiement"}
              </h3>
              
              <div className="space-y-4">
                <p className={cn(
                  "text-nuit-600",
                  isRTL ? "font-cairo text-right" : ""
                )}>
                  {isRTL ? "قم برفع صورة أو ملف PDF لإيصال الدفع" : "Téléversez une photo ou un PDF du reçu de paiement"}
                </p>

                <div className="border-2 border-dashed border-sable-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="proof-upload"
                  />
                  <label htmlFor="proof-upload" className="cursor-pointer">
                    <Upload className="h-8 w-8 text-nuit-400 mx-auto mb-2" />
                    <p className={cn(
                      "text-nuit-600 mb-1",
                      isRTL ? "font-cairo" : ""
                    )}>
                      {isRTL ? "اختر ملف أو اسحبه هنا" : "Choisir un fichier ou le glisser ici"}
                    </p>
                    <p className="text-sm text-nuit-400">
                      {isRTL ? "PNG, JPG, PDF (حد أقصى 5 ميجابايت)" : "PNG, JPG, PDF (max 5MB)"}
                    </p>
                  </label>

                  {proofFile && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className={cn(
                        "text-green-700 font-medium",
                        isRTL ? "font-cairo" : ""
                      )}>
                        {isRTL ? "تم رفع الملف:" : "Fichier téléversé :"} {proofFile.name}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Reminders */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h3 className={cn(
                "font-display text-lg font-bold text-red-800 mb-4 flex items-center gap-2",
                isRTL ? "font-cairo flex-row-reverse" : ""
              )}>
                <Clock className="h-5 w-5 text-red-600" />
                {isRTL ? "تذكيرات مهمة" : "Rappels importants"}
              </h3>
              
              <ul className={cn(
                "space-y-2 text-red-700",
                isRTL ? "font-cairo text-right" : ""
              )}>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">���</span>
                  <span>
                    {isRTL ? "الدفعة المطلوبة: 50% كحد أدنى" : "Dépôt minimum requis : 50 %"}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>
                    {isRTL ? 
                      `بدون دفعة خلال ${paymentConfig.autoCancelHours} ساعات، قد يتم إلغاء الطلب تلقائياً` : 
                      `Sans dépôt dans les ${paymentConfig.autoCancelHours} heures, la commande peut être annulée automatiquement`
                    }
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>
                    {isRTL ? 
                      `للاستفسارات: ${paymentConfig.supportPhone}` : 
                      `Pour toute question : ${paymentConfig.supportPhone}`
                    }
                  </span>
                </li>
              </ul>
            </div>

            {/* Back to Home */}
            <div className="text-center pt-8">
              <Button 
                asChild
                className="bg-terracotta hover:bg-terracotta-600 text-white px-8 py-3"
              >
                <Link to="/">
                  {isRTL ? "العودة للقائمة الرئيسية" : "Retour au menu principal"}
                </Link>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
