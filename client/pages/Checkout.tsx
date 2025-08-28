import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useLanguage } from "@/lib/useLanguage";
import { useCart } from "@/contexts/CartContext";
import { 
  ChefHat, 
  ArrowLeft, 
  Phone, 
  MapPin, 
  Calendar,
  Clock,
  Mail,
  MessageSquare,
  ShoppingCart
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

interface OrderForm {
  phone: string;
  address: string;
  deliveryDate: string;
  deliverySlot: string;
  email: string;
  notes: string;
  acceptTerms: boolean;
}

const Checkout = () => {
  const { isRTL, t } = useLanguage();
  const { state } = useCart();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<OrderForm>({
    phone: "",
    address: "",
    deliveryDate: "",
    deliverySlot: "",
    email: "",
    notes: "",
    acceptTerms: false
  });

  const deliveryFee = 25;
  const total = state.total + deliveryFee;

  // Delivery time slots
  const timeSlots = [
    { value: "10:00-13:00", label: isRTL ? "10:00 - 13:00" : "10:00 - 13:00" },
    { value: "13:00-16:00", label: isRTL ? "13:00 - 16:00" : "13:00 - 16:00" },
    { value: "18:00-21:00", label: isRTL ? "18:00 - 21:00" : "18:00 - 21:00" }
  ];

  // Set minimum date to tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, deliveryDate: minDate }));
  }, []);

  // Redirect if cart is empty
  useEffect(() => {
    if (state.items.length === 0) {
      navigate('/cart');
    }
  }, [state.items, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validatePhone = (phone: string): boolean => {
    // Moroccan phone validation
    const phoneRegex = /^(\+212|0)[5-7][0-9]{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const isFormValid = (): boolean => {
    return (
      validatePhone(formData.phone) &&
      formData.address.length >= 10 &&
      formData.deliveryDate !== "" &&
      formData.deliverySlot !== "" &&
      formData.acceptTerms
    );
  };

  const generateOrderReference = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `NAW-${year}${month}${day}-${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      alert(isRTL ? "يرجى ملء جميع الحقول المطلوبة بشكل صحيح" : "Veuillez remplir tous les champs obligatoires correctement");
      return;
    }

    setIsLoading(true);

    try {
      // Create order
      const orderRef = generateOrderReference();
      const orderData = {
        reference: orderRef,
        status: "pending-deposit",
        customer: {
          phone: formData.phone,
          email: formData.email || null,
          address: formData.address,
          notes: formData.notes || null
        },
        delivery: {
          date: formData.deliveryDate,
          slot: formData.deliverySlot
        },
        items: state.items.map(item => ({
          productId: item.id,
          name: item.name,
          nameAr: item.nameAr,
          qty: item.quantity,
          price: item.price,
          image: item.image
        })),
        pricing: {
          subtotal: state.total,
          shipping: deliveryFee,
          total: total,
          deposit_required: Math.round(total * 0.5),
          deposit_paid: 0
        },
        payments: [],
        timestamps: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        meta: {
          ip: "client-ip",
          userAgent: navigator.userAgent,
          createdFromCheckout: true
        }
      };

      // In a real app, you would send this to your API
      console.log('Order created:', orderData);
      
      // Store order persistently for future lookup and set current order
      try {
        const ordersStr = localStorage.getItem('orders');
        const ordersArr = Array.isArray(JSON.parse(ordersStr || 'null')) ? JSON.parse(ordersStr || '[]') : [];
        // Keep most recent first and cap history to 50 orders
        const updated = [orderData, ...ordersArr.filter((o: any) => o?.reference !== orderRef)].slice(0, 50);
        localStorage.setItem('orders', JSON.stringify(updated));
      } catch (e) {
        // Fallback to just current order if parsing fails
        localStorage.setItem('orders', JSON.stringify([orderData]));
      }
      localStorage.setItem('current-order', JSON.stringify(orderData));

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to confirmation page
      navigate(`/order-confirmation?ref=${orderRef}`);
      
    } catch (error) {
      console.error('Error creating order:', error);
      alert(isRTL ? "حدث خطأ أثناء معالجة طلبك" : "Une erreur s'est produite lors du traitement de votre commande");
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
                    {isRTL ? "المطبخ المغربي الأصي��" : "Cuisine Marocaine Authentique"}
                  </p>
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              <LanguageToggle />
              <Button asChild className="bg-terracotta hover:bg-terracotta-600 text-white">
                <Link to="/cart">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  ({state.itemCount})
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link 
          to="/cart" 
          className={cn(
            "inline-flex items-center gap-2 text-terracotta hover:text-terracotta-600 mb-8 transition-colors",
            isRTL ? "flex-row-reverse" : "flex-row"
          )}
        >
          <ArrowLeft className={cn("h-4 w-4", isRTL ? "rotate-180" : "")} />
          {isRTL ? "العودة للسلة" : "Retour au panier"}
        </Link>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h1 className={cn(
              "font-display text-3xl md:text-4xl font-bold text-nuit-900 mb-4",
              isRTL ? "font-cairo" : ""
            )}>
              {isRTL ? "إتمام الطلب" : "Finaliser votre commande"}
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-terracotta to-safran mx-auto"></div>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Order Form */}
            <motion.div variants={itemVariants} className="lg:col-span-3">
              <div className="bg-white rounded-xl p-6 shadow-soft border border-sable-200">
                <h2 className={cn(
                  "font-display text-xl font-bold text-nuit-900 mb-6",
                  isRTL ? "font-cairo text-right" : ""
                )}>
                  {isRTL ? "معلومات التوصيل" : "Informations de livraison"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Phone */}
                  <div className="space-y-2">
                    <label className={cn(
                      "text-sm font-medium text-nuit-700 flex items-center gap-2",
                      isRTL ? "font-cairo text-right flex-row-reverse" : ""
                    )}>
                      <Phone className="h-4 w-4 text-terracotta" />
                      {isRTL ? "رقم الهاتف *" : "Numéro de téléphone *"}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={cn(
                        "w-full bg-white border border-sable-300 rounded-lg px-4 py-3 text-nuit-900 placeholder-nuit-400 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-colors",
                        isRTL ? "text-right font-cairo" : "",
                        !validatePhone(formData.phone) && formData.phone !== "" ? "border-red-300" : ""
                      )}
                      placeholder={isRTL ? "+212XXXXXXXXX أو 0XXXXXXXXX" : "+212XXXXXXXXX ou 0XXXXXXXXX"}
                      required
                    />
                    {!validatePhone(formData.phone) && formData.phone !== "" && (
                      <p className={cn(
                        "text-sm text-red-600",
                        isRTL ? "font-cairo text-right" : ""
                      )}>
                        {isRTL ? "ت��سيق رقم الهاتف غير صحيح" : "Format de numéro de téléphone invalide"}
                      </p>
                    )}
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <label className={cn(
                      "text-sm font-medium text-nuit-700 flex items-center gap-2",
                      isRTL ? "font-cairo text-right flex-row-reverse" : ""
                    )}>
                      <MapPin className="h-4 w-4 text-terracotta" />
                      {isRTL ? "عنوان التوصيل *" : "Adresse de livraison *"}
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className={cn(
                        "w-full bg-white border border-sable-300 rounded-lg px-4 py-3 text-nuit-900 placeholder-nuit-400 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-colors resize-none",
                        isRTL ? "text-right font-cairo" : ""
                      )}
                      placeholder={isRTL ? "الشارع/الرقم، الحي، المدينة" : "Rue/numéro, quartier, ville"}
                      required
                    />
                  </div>

                  {/* Delivery Date */}
                  <div className="space-y-2">
                    <label className={cn(
                      "text-sm font-medium text-nuit-700 flex items-center gap-2",
                      isRTL ? "font-cairo text-right flex-row-reverse" : ""
                    )}>
                      <Calendar className="h-4 w-4 text-terracotta" />
                      {isRTL ? "تاريخ التوصيل *" : "Date de livraison *"}
                    </label>
                    <input
                      type="date"
                      name="deliveryDate"
                      value={formData.deliveryDate}
                      onChange={handleInputChange}
                      min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                      className={cn(
                        "w-full bg-white border border-sable-300 rounded-lg px-4 py-3 text-nuit-900 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-colors",
                        isRTL ? "text-right font-cairo" : ""
                      )}
                      required
                    />
                  </div>

                  {/* Delivery Slot */}
                  <div className="space-y-2">
                    <label className={cn(
                      "text-sm font-medium text-nuit-700 flex items-center gap-2",
                      isRTL ? "font-cairo text-right flex-row-reverse" : ""
                    )}>
                      <Clock className="h-4 w-4 text-terracotta" />
                      {isRTL ? "ساعة التوصيل *" : "Créneau de livraison *"}
                    </label>
                    <select
                      name="deliverySlot"
                      value={formData.deliverySlot}
                      onChange={handleInputChange}
                      className={cn(
                        "w-full bg-white border border-sable-300 rounded-lg px-4 py-3 text-nuit-900 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-colors",
                        isRTL ? "text-right font-cairo" : ""
                      )}
                      required
                    >
                      <option value="">
                        {isRTL ? "اختر ساعة التوصيل" : "Sélectionnez un créneau"}
                      </option>
                      {timeSlots.map((slot) => (
                        <option key={slot.value} value={slot.value}>
                          {slot.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Email (Optional) */}
                  <div className="space-y-2">
                    <label className={cn(
                      "text-sm font-medium text-nuit-700 flex items-center gap-2",
                      isRTL ? "font-cairo text-right flex-row-reverse" : ""
                    )}>
                      <Mail className="h-4 w-4 text-nuit-400" />
                      {isRTL ? "البريد الإلكتروني (اختياري)" : "Email (facultatif)"}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={cn(
                        "w-full bg-white border border-sable-300 rounded-lg px-4 py-3 text-nuit-900 placeholder-nuit-400 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-colors",
                        isRTL ? "text-right font-cairo" : ""
                      )}
                      placeholder={isRTL ? "your@email.com" : "votre@email.com"}
                    />
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <label className={cn(
                      "text-sm font-medium text-nuit-700 flex items-center gap-2",
                      isRTL ? "font-cairo text-right flex-row-reverse" : ""
                    )}>
                      <MessageSquare className="h-4 w-4 text-nuit-400" />
                      {isRTL ? "ملاحظات (اختياري)" : "Notes (facultatif)"}
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      className={cn(
                        "w-full bg-white border border-sable-300 rounded-lg px-4 py-3 text-nuit-900 placeholder-nuit-400 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-colors resize-none",
                        isRTL ? "text-right font-cairo" : ""
                      )}
                      placeholder={isRTL ? "الحساسية، تعليمات الوصول، إلخ..." : "Allergies, instructions d'accès, etc..."}
                    />
                  </div>

                  {/* Terms Acceptance */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4 text-terracotta border-sable-300 rounded focus:ring-terracotta focus:ring-offset-0"
                      required
                    />
                    <label className={cn(
                      "text-sm text-nuit-600 cursor-pointer",
                      isRTL ? "font-cairo text-right" : ""
                    )}>
                      {isRTL ? (
                        <>أوافق على <span className="text-terracotta font-semibold">شروط البيع</span> و <span className="text-terracotta font-semibold">سياسة الخصوصية</span> *</>
                      ) : (
                        <>J'accepte les <span className="text-terracotta font-semibold">conditions de vente</span> & la <span className="text-terracotta font-semibold">politique de confidentialité</span> *</>
                      )}
                    </label>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={!isFormValid() || isLoading}
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
                        {isRTL ? "جاري معالجة الطلب..." : "Traitement en cours..."}
                      </div>
                    ) : (
                      <span>{isRTL ? "تأكيد الطلب" : "Valider la commande"}</span>
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>

            {/* Order Summary */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <div className="bg-white rounded-xl p-6 shadow-soft border border-sable-200 sticky top-8">
                <h3 className={cn(
                  "font-display text-xl font-bold text-nuit-900 mb-6",
                  isRTL ? "font-cairo text-right" : ""
                )}>
                  {isRTL ? "ملخص الطلب" : "Résumé de la commande"}
                </h3>

                {/* Cart Items */}
                <div className="space-y-3 mb-6">
                  {state.items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-sable-100 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={isRTL ? item.nameAr : item.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <div className="flex-1">
                        <p className={cn(
                          "font-semibold text-sm text-nuit-900",
                          isRTL ? "font-cairo text-right" : ""
                        )}>
                          {isRTL ? item.nameAr : item.name}
                        </p>
                        <p className={cn(
                          "text-xs text-nuit-600",
                          isRTL ? "text-right" : ""
                        )}>
                          {item.quantity} × {item.price} {isRTL ? "درهم" : "MAD"}
                        </p>
                      </div>
                      <div className="text-sm font-semibold text-nuit-900">
                        {(item.price * item.quantity).toFixed(2)} {isRTL ? "درهم" : "MAD"}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing */}
                <div className="space-y-3 pt-6 border-t border-sable-200">
                  <div className={cn(
                    "flex justify-between",
                    isRTL ? "flex-row-reverse" : "flex-row"
                  )}>
                    <span className={cn(
                      "text-nuit-600",
                      isRTL ? "font-cairo" : ""
                    )}>
                      {isRTL ? "المجموع الفرعي" : "Sous-total"}
                    </span>
                    <span className="font-semibold text-nuit-900">
                      {state.total.toFixed(2)} {isRTL ? "درهم" : "MAD"}
                    </span>
                  </div>

                  <div className={cn(
                    "flex justify-between",
                    isRTL ? "flex-row-reverse" : "flex-row"
                  )}>
                    <span className={cn(
                      "text-nuit-600",
                      isRTL ? "font-cairo" : ""
                    )}>
                      {isRTL ? "رسوم التوصيل" : "Frais de livraison"}
                    </span>
                    <span className="font-semibold text-nuit-900">
                      {deliveryFee} {isRTL ? "درهم" : "MAD"}
                    </span>
                  </div>

                  <div className="border-t border-sable-200 pt-3">
                    <div className={cn(
                      "flex justify-between",
                      isRTL ? "flex-row-reverse" : "flex-row"
                    )}>
                      <span className={cn(
                        "text-lg font-bold text-nuit-900",
                        isRTL ? "font-cairo" : ""
                      )}>
                        {isRTL ? "المجموع الكلي" : "Total"}
                      </span>
                      <span className="text-lg font-bold text-terracotta">
                        {total.toFixed(2)} {isRTL ? "درهم" : "MAD"}
                      </span>
                    </div>

                    <div className={cn(
                      "flex justify-between mt-2",
                      isRTL ? "flex-row-reverse" : "flex-row"
                    )}>
                      <span className={cn(
                        "text-sm text-nuit-600",
                        isRTL ? "font-cairo" : ""
                      )}>
                        {isRTL ? "الدفعة المطلوبة (50%)" : "Dépôt requis (50%)"}
                      </span>
                      <span className="text-sm font-bold text-safran">
                        {Math.round(total * 0.5)} {isRTL ? "درهم" : "MAD"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;
