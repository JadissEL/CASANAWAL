import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { MoroccanPattern } from "@/components/ui/moroccan-pattern";
import { useLanguage } from "@/lib/useLanguage";
import { 
  ChefHat, 
  ArrowLeft, 
  Heart,
  Star,
  Clock,
  Users,
  Award,
  MapPin,
  Mail,
  Phone
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

const About = () => {
  const { isRTL, t } = useLanguage();

  // Values/principles data
  const values = [
    {
      icon: Heart,
      title: t('about.values.authenticity'),
      description: t('about.values.authenticityDesc'),
      color: "from-terracotta to-safran"
    },
    {
      icon: Award,
      title: t('about.values.quality'),
      description: t('about.values.qualityDesc'),
      color: "from-safran to-zellige"
    },
    {
      icon: Users,
      title: t('about.values.passion'),
      description: t('about.values.passionDesc'),
      color: "from-zellige to-terracotta"
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
          {/* Breadcrumb */}
          <motion.nav 
            variants={itemVariants}
            aria-label={t('about.breadcrumbLabel')} 
            className="mb-6"
          >
            <Link 
              to="/" 
              className={cn(
                "inline-flex items-center gap-2 text-terracotta hover:text-terracotta-600 transition-colors duration-200 group focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-offset-2 rounded-lg p-2 -ml-2",
                isRTL ? "flex-row-reverse" : "flex-row"
              )}
              aria-label={t('about.backHome')}
            >
              <ArrowLeft 
                className={cn(
                  "h-4 w-4 transition-transform group-hover:-translate-x-1",
                  isRTL ? "rotate-180" : ""
                )} 
                aria-hidden="true"
              />
              <span className="font-medium">{t('about.backHome')}</span>
            </Link>
          </motion.nav>

          {/* Page Header */}
          <motion.header variants={itemVariants} className="mb-12">
            <h1 className={cn(
              "font-display text-4xl md:text-5xl lg:text-6xl font-bold text-nuit-900 mb-6",
              isRTL ? "font-cairo text-right" : "text-left"
            )}>
              {t('about.title')}
            </h1>
            <div className={cn(
              "w-24 h-1 bg-gradient-to-r from-terracotta via-safran to-zellige rounded-full mb-8",
              isRTL ? "mr-auto" : "ml-0"
            )}></div>
          </motion.header>

          {/* Hero Story Section */}
          <motion.section 
            variants={itemVariants}
            className="mb-16 grid gap-8 lg:grid-cols-5"
          >
            {/* Content */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-soft relative overflow-hidden">
                <MoroccanPattern
                  variant="subtle"
                  pattern="mixed"
                  animated={false}
                  corners={true}
                  className="rounded-3xl"
                />
                
                <div className="relative z-10">
                  <p className={cn(
                    "text-lg leading-relaxed text-nuit-800 mb-6",
                    isRTL ? "font-cairo text-right" : "text-left"
                  )}>
                    {t('about.intro')}
                  </p>
                  
                  <div className="p-4 bg-sable-100 rounded-2xl border-l-4 border-terracotta">
                    <p className={cn(
                      "text-sm text-nuit-600 italic",
                      isRTL ? "font-cairo text-right border-r-4 border-l-0" : "text-left"
                    )} 
                    aria-live="polite">
                      {t('about.moreSoon')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="lg:col-span-2">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl shadow-soft">
                <img
                  src="https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?w=800&q=80"
                  alt={t('about.imageAlt')}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4">
                    <div className="flex items-center gap-3">
                      <ChefHat className="h-8 w-8 text-terracotta" aria-hidden="true" />
                      <div>
                        <p className={cn(
                          "font-semibold text-nuit-900",
                          isRTL ? "font-cairo" : ""
                        )}>
                          {isRTL ? "نوال" : "Nawal"}
                        </p>
                        <p className={cn(
                          "text-xs text-nuit-600",
                          isRTL ? "font-cairo" : ""
                        )}>
                          {isRTL ? "طباخة ماهرة" : "Chef Experte"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Values Section */}
          <motion.section variants={itemVariants} className="mb-16">
            <h2 className={cn(
              "font-display text-2xl md:text-3xl font-semibold text-nuit-900 mb-8",
              isRTL ? "font-cairo text-right" : "text-left"
            )}>
              {isRTL ? "قيمنا" : "Nos Valeurs"}
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value, index) => {
                const IconComponent = value.icon;
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-soft-lg transition-all duration-300 group text-center"
                  >
                    <div className={cn(
                      "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-gradient-to-br",
                      value.color
                    )}>
                      <IconComponent className="h-8 w-8 text-white" aria-hidden="true" />
                    </div>
                    
                    <h3 className={cn(
                      "font-semibold text-nuit-900 mb-3 group-hover:text-terracotta transition-colors",
                      isRTL ? "font-cairo" : ""
                    )}>
                      {value.title}
                    </h3>
                    
                    <p className={cn(
                      "text-sm text-nuit-600 leading-relaxed",
                      isRTL ? "font-cairo" : ""
                    )}>
                      {value.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          {/* Journey Preview Section */}
          <motion.section variants={itemVariants} className="mb-16">
            <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-soft max-w-4xl mx-auto relative overflow-hidden">
              <MoroccanPattern
                variant="subtle"
                pattern="geometric"
                animated={true}
                corners={false}
                className="rounded-3xl"
              />
              
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-terracotta via-safran to-zellige rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="h-10 w-10 text-white" aria-hidden="true" />
                </div>
                
                <h2 className={cn(
                  "font-display text-xl md:text-2xl font-semibold text-nuit-900 mb-4",
                  isRTL ? "font-cairo" : ""
                )}>
                  {t('about.journey.title')}
                </h2>
                
                <p className={cn(
                  "text-nuit-600 mb-8 leading-relaxed max-w-2xl mx-auto",
                  isRTL ? "font-cairo" : ""
                )}>
                  {t('about.journey.timeline')}
                </p>

                {/* Timeline Preview */}
                <div className="flex justify-center items-center gap-4 mb-8">
                  {[1, 2, 3].map((step, index) => (
                    <div key={step} className="flex items-center">
                      <div className="w-8 h-8 bg-terracotta rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {step}
                      </div>
                      {index < 2 && (
                        <div className="w-12 h-0.5 bg-sable-300 mx-2" />
                      )}
                    </div>
                  ))}
                </div>
                
                <Button 
                  asChild
                  className="bg-zellige hover:bg-zellige-600 text-white px-8 py-3 rounded-2xl focus:ring-zellige focus:ring-offset-2"
                  aria-label={t('about.ctaLabel')}
                >
                  <Link to="/menu">
                    {t('about.ctaLabel')}
                  </Link>
                </Button>
              </div>
            </div>
          </motion.section>

          {/* Contact Information */}
          <motion.section variants={itemVariants} className="text-center">
            <div className="bg-nuit-900 text-white rounded-3xl p-8 lg:p-12 max-w-4xl mx-auto">
              <h2 className={cn(
                "font-display text-xl md:text-2xl font-semibold mb-6",
                isRTL ? "font-cairo" : ""
              )}>
                {isRTL ? "تواصل معنا" : "Contactez CasaNawal"}
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="flex flex-col items-center">
                  <MapPin className="h-6 w-6 text-safran mb-2" aria-hidden="true" />
                  <p className={cn(
                    "text-sm text-gray-300",
                    isRTL ? "font-cairo" : ""
                  )}>
                    {isRTL ? "الدار البيضاء، المغرب" : "Casablanca, Maroc"}
                  </p>
                </div>
                
                <div className="flex flex-col items-center">
                  <Phone className="h-6 w-6 text-safran mb-2" aria-hidden="true" />
                  <p className="text-sm text-gray-300">+212 6 XX XX XX XX</p>
                </div>
                
                <div className="flex flex-col items-center">
                  <Mail className="h-6 w-6 text-safran mb-2" aria-hidden="true" />
                  <p className="text-sm text-gray-300">contact@casanawal.ma</p>
                </div>
              </div>
            </div>
          </motion.section>
        </motion.div>
      </main>
    </div>
  );
};

export default About;
