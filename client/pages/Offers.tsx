import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { MoroccanPattern } from "@/components/ui/moroccan-pattern";
import { useLanguage } from "@/lib/useLanguage";
import { 
  ChefHat, 
  ArrowLeft, 
  Clock, 
  Star,
  Percent,
  Calendar,
  Gift,
  Bell,
  ShoppingCart,
  Utensils
} from "lucide-react";
import { cn } from "@/lib/utils";

// Animation variants
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

const Offers = () => {
  const { isRTL, t } = useLanguage();

  // Real current offers - replace "coming soon" with actual deals
  const currentOffers = [
    {
      id: "family-feast",
      title: isRTL ? "وليمة العائلة" : "Festin Familial",
      subtitle: isRTL ? "طاجين + كسكس + حلو��" : "Tagine + Couscous + Dessert",
      originalPrice: 280,
      offerPrice: 199,
      discount: 30,
      validUntil: "2024-02-15",
      description: isRTL 
        ? "عرض خاص للعائلات: طاجين دجاج، كسكس ملكي، وحلوى شباكية تقليدية"
        : "Offre spéciale famille: Tagine de poulet, couscous royal et chebakia traditionnelle",
      features: [
        isRTL ? "يكفي ل 4-6 أشخاص" : "Pour 4-6 personnes",
        isRTL ? "توصيل مجاني" : "Livraison gratuite",
        isRTL ? "مكونات طازجة" : "Ingrédients frais"
      ],
      badge: isRTL ? "الأكثر شعبية" : "Plus Populaire",
      image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&q=80"
    },
    {
      id: "weekend-special",
      title: isRTL ? "عرض نهاية الأسبوع" : "Spécial Week-end",
      subtitle: isRTL ? "خصم على جميع الطواجين" : "Réduction sur tous les Tagines",
      originalPrice: 95,
      offerPrice: 75,
      discount: 20,
      validUntil: "2024-02-11",
      description: isRTL 
        ? "استمتع بخصم 20% على جميع أنواع الطواجين خلال عطلة نهاية الأسبوع"
        : "Profitez de 20% de réduction sur tous nos tagines pendant le week-end",
      features: [
        isRTL ? "جميع أنواع الطواجين" : "Tous les tagines",
        isRTL ? "صالح الجمعة-الأ��د" : "Valable Ven-Dim",
        isRTL ? "لا يشمل التوصيل" : "Hors livraison"
      ],
      badge: isRTL ? "وقت محدود" : "Temps Limité",
      image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80"
    },
    {
      id: "first-order",
      title: isRTL ? "ترحيب بالعملاء الجدد" : "Bienvenue Nouveaux Clients",
      subtitle: isRTL ? "خصم على الطلب الأول" : "Réduction première commande",
      originalPrice: 150,
      offerPrice: 99,
      discount: 35,
      validUntil: "2024-02-29",
      description: isRTL 
        ? "خصم خاص 35% للعملاء الجدد على طلبهم الأول من منصتنا"
        : "Remise spéciale de 35% pour les nouveaux clients sur leur première commande",
      features: [
        isRTL ? "للعملاء الجدد فقط" : "Nouveaux clients uniquement",
        isRTL ? "حد أدنى 100 درهم" : "Minimum 100 MAD",
        isRTL ? "كود: BIENVENUE" : "Code: BIENVENUE"
      ],
      badge: isRTL ? "عملاء جدد" : "Nouveaux",
      image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-sable-50">
      {/* Navigation */}
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
              <Button className="bg-terracotta hover:bg-terracotta-600 text-white focus:ring-terracotta focus:ring-offset-2">
                {t('nav.cart')} (0)
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16"
        >
          {/* Back Link */}
          <motion.div variants={itemVariants}>
            <Link 
              to="/" 
              className={cn(
                "inline-flex items-center gap-2 text-terracotta hover:text-terracotta-600 transition-colors duration-200 mb-8 group focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-offset-2 rounded-lg p-2 -ml-2",
                isRTL ? "flex-row-reverse" : "flex-row"
              )}
              aria-label={t('nav.backToHome')}
            >
              <ArrowLeft 
                className={cn(
                  "h-4 w-4 transition-transform group-hover:-translate-x-1",
                  isRTL ? "rotate-180" : ""
                )} 
                aria-hidden="true"
              />
              <span className="font-medium">{t('nav.backToHome')}</span>
            </Link>
          </motion.div>

          {/* Hero Section */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h1 className={cn(
              "font-display text-4xl md:text-5xl lg:text-6xl font-bold text-nuit-900 mb-6",
              isRTL ? "font-cairo" : ""
            )}>
              {t('offers.title')}
            </h1>
            
            <div className="w-24 h-1 bg-gradient-to-r from-terracotta via-safran to-zellige mx-auto mb-8 rounded-full"></div>
            
            <p className={cn(
              "text-lg md:text-xl text-nuit-600 max-w-3xl mx-auto leading-relaxed",
              isRTL ? "font-cairo" : ""
            )}>
              {t('offers.subtitle')}
            </p>
          </motion.div>

          {/* Current Offers Section */}
          <motion.div variants={itemVariants} className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className={cn(
                "font-display text-2xl md:text-3xl font-semibold text-nuit-900",
                isRTL ? "font-cairo" : ""
              )}>
                {t('offers.currentOffers')}
              </h2>
              
              <div className="flex items-center gap-2 text-terracotta">
                <Gift className="h-5 w-5" aria-hidden="true" />
                <span className="text-sm font-medium">
                  {currentOffers.length} {isRTL ? 'عروض نشطة' : 'offres actives'}
                </span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentOffers.map((offer, index) => (
                <motion.div
                  key={offer.id}
                  variants={itemVariants}
                  className="bg-white rounded-3xl overflow-hidden shadow-soft hover:shadow-soft-lg transition-all duration-300 group border border-sable-200 relative"
                >
                  {/* Offer Badge */}
                  <div className={cn(
                    "absolute top-4 z-20",
                    isRTL ? "right-4" : "left-4"
                  )}>
                    <span className="bg-gradient-to-r from-terracotta to-safran text-white px-3 py-1.5 rounded-full text-xs font-bold">
                      {offer.badge}
                    </span>
                  </div>

                  {/* Discount Badge */}
                  <div className={cn(
                    "absolute top-4 z-20",
                    isRTL ? "left-4" : "right-4"
                  )}>
                    <div className="bg-nuit-900 text-white px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1">
                      <Percent className="h-3 w-3" aria-hidden="true" />
                      -{offer.discount}%
                    </div>
                  </div>

                  {/* Background Pattern */}
                  <MoroccanPattern
                    variant="subtle"
                    pattern="geometric"
                    animated={false}
                    corners={false}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />

                  {/* Image Section */}
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img
                      src={offer.image}
                      alt={isRTL ? offer.titleAr : offer.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-6 relative z-10">
                    <div className="mb-4">
                      <h3 className={cn(
                        "font-display text-xl font-semibold text-nuit-900 mb-2 group-hover:text-terracotta transition-colors",
                        isRTL ? "font-cairo text-right" : "text-left"
                      )}>
                        {offer.title}
                      </h3>
                      <p className={cn(
                        "text-sm text-nuit-600 mb-3",
                        isRTL ? "font-cairo text-right" : "text-left"
                      )}>
                        {offer.subtitle}
                      </p>
                      <p className={cn(
                        "text-xs text-nuit-500 line-clamp-2",
                        isRTL ? "font-cairo text-right" : "text-left"
                      )}>
                        {offer.description}
                      </p>
                    </div>

                    {/* Pricing */}
                    <div className={cn(
                      "flex items-center gap-3 mb-4",
                      isRTL ? "flex-row-reverse" : "flex-row"
                    )}>
                      <span className="font-bold text-2xl text-terracotta">
                        {offer.offerPrice} MAD
                      </span>
                      <span className="text-nuit-500 line-through text-lg">
                        {offer.originalPrice} MAD
                      </span>
                    </div>

                    {/* Features */}
                    <div className="space-y-2 mb-4">
                      {offer.features.map((feature, idx) => (
                        <div 
                          key={idx}
                          className={cn(
                            "flex items-center gap-2 text-xs text-nuit-600",
                            isRTL ? "flex-row-reverse" : "flex-row"
                          )}
                        >
                          <Star className="h-3 w-3 fill-safran text-safran" aria-hidden="true" />
                          <span className={isRTL ? "font-cairo" : ""}>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Validity */}
                    <div className={cn(
                      "flex items-center gap-2 text-xs text-nuit-500 mb-4",
                      isRTL ? "flex-row-reverse" : "flex-row"
                    )}>
                      <Calendar className="h-3 w-3" aria-hidden="true" />
                      <span className={isRTL ? "font-cairo" : ""}>
                        {t('offers.validUntil')} {offer.validUntil}
                      </span>
                    </div>

                    {/* Action Button */}
                    <Button
                      className="w-full bg-terracotta hover:bg-terracotta-600 text-white rounded-xl py-3 font-medium focus:ring-terracotta focus:ring-offset-2"
                      aria-label={`${t('offers.orderNow')} - ${offer.title}`}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" aria-hidden="true" />
                      {t('offers.orderNow')}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Newsletter Signup */}
          <motion.div variants={itemVariants} className="text-center">
            <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-soft max-w-2xl mx-auto relative overflow-hidden">
              <MoroccanPattern
                variant="subtle"
                pattern="mixed"
                animated={true}
                corners={true}
                className="rounded-3xl"
              />
              
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-safran via-terracotta to-zellige rounded-full flex items-center justify-center mx-auto mb-6">
                  <Bell className="h-10 w-10 text-white" aria-hidden="true" />
                </div>
                
                <h3 className={cn(
                  "font-display text-xl md:text-2xl font-semibold text-nuit-900 mb-4",
                  isRTL ? "font-cairo" : ""
                )}>
                  {t('offers.comingSoon')}
                </h3>
                
                <p className={cn(
                  "text-nuit-600 mb-8 leading-relaxed",
                  isRTL ? "font-cairo" : ""
                )}>
                  {t('offers.newsletter')}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder={isRTL ? "أدخل بريدك الإلكتروني" : "Votre email"}
                    className={cn(
                      "flex-1 px-4 py-3 rounded-xl border border-sable-300 focus:outline-none focus:ring-2 focus:ring-terracotta focus:border-transparent",
                      isRTL ? "text-right font-cairo" : "text-left"
                    )}
                    aria-label={isRTL ? "عنوان البريد الإلك��روني" : "Adresse email"}
                  />
                  <Button className="bg-terracotta hover:bg-terracotta-600 text-white px-6 py-3 rounded-xl focus:ring-terracotta focus:ring-offset-2">
                    {isRTL ? "اشتراك" : "S'abonner"}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Offers;
