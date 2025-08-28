import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { OfferCard } from "@/components/ui/offer-card";
import { ProductCard } from "@/components/ui/product-card";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useLanguage } from "@/lib/useLanguage";
import { useCart } from "@/contexts/CartContext";
import {
  Star,
  Clock,
  Shield,
  Truck,
  Heart,
  ChefHat,
  Users,
  Phone,
  Mail,
  MapPin,
  Menu as MenuIcon,
  CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getAllMenuItems, PortionOption } from "@/data/menuData";

const Index = () => {
  const { isRTL, t } = useLanguage();
  const { state: cartState, addItem } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Get featured products from real menu data
  const allMenuItems = getAllMenuItems();
  const featuredProducts = [
    allMenuItems.find(item => item.id === "tajine-poulet-olives"), // Tajine
    allMenuItems.find(item => item.id === "couscous-royal"), // Couscous
    allMenuItems.find(item => item.id === "bastilla-poulet") // Bastilla
  ].filter(Boolean); // Remove any undefined items

  // Mock data - in real app this would come from API
  const offers = [
    {
      id: "1",
      title: "Menu Familial Tagine",
      titleAr: "قائمة العائلة طاجين",
      description: "Tagine aux légumes, couscous royal et pâtisseries traditionnelles",
      descriptionAr: "طاجين الخضار، كس��س ملكي ��حلويات تقليدية",
      originalPrice: 350,
      discountPrice: 250,
      imageUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&q=80",
      discount: 29,
      rating: 4.8,
      preparationTime: "45 min",
      preparationTimeAr: "45 دقيقة"
    },
    {
      id: "2",
      title: "Plateau Découverte",
      titleAr: "صحن الاكتشاف",
      description: "Sélection de nos meilleures spécialités marocaines",
      descriptionAr: "مجموعة من أفضل تخصصاتنا المغربية",
      originalPrice: 200,
      discountPrice: 150,
      imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80",
      discount: 25,
      rating: 4.9,
      preparationTime: "30 min",
      preparationTimeAr: "30 دقيقة"
    }
  ];


  const handleOneClickOrder = async (offerId: string) => {
    // Mock implementation - would integrate with real ordering system
    console.log(`One-click order for offer: ${offerId}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleAddToCart = (
    productId: string,
    quantity: number,
    selectedPortion: PortionOption,
    finalPrice: number
  ) => {
    const product = allMenuItems.find(p => p.id === productId);
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addItem({
          id: product.id,
          name: product.name,
          nameAr: product.nameAr,
          price: finalPrice,
          image: product.imageUrl,
          category: product.category
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-sable-50">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-sable-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
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
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-nuit-700 hover:text-terracotta transition-colors font-medium">
                {t('nav.home')}
              </Link>
              <Link to="/menu" className="text-nuit-700 hover:text-terracotta transition-colors font-medium">
                {t('nav.menu')}
              </Link>
              <Link to="/offers" className="text-nuit-700 hover:text-terracotta transition-colors font-medium">
                {t('nav.offers')}
              </Link>
              <Link to="/about" className="text-nuit-700 hover:text-terracotta transition-colors font-medium">
                {t('nav.about')}
              </Link>
              <Link to="/contact" className="text-nuit-700 hover:text-terracotta transition-colors font-medium">
                {t('nav.contact')}
              </Link>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              <LanguageToggle />
              <Button asChild className="bg-terracotta hover:bg-terracotta-600 text-white">
                <Link to="/cart">
                  {t('nav.cart')} ({cartState.itemCount})
                </Link>
              </Button>
              
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <MenuIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=1920&q=80"
            alt={isRTL ? "مطبخ مغربي تقليدي أصيل من كازا نوال" : "Cuisine marocaine traditionnelle authentique de CasaNawal"}
            className="w-full h-full object-cover"
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-nuit-900/60 via-nuit-900/40 to-nuit-900/60" />
          <div className="absolute inset-0 bg-gradient-to-br from-terracotta/20 via-safran/10 to-zellige/20" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className={cn(
            "font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white drop-shadow-2xl",
            isRTL ? "font-cairo" : ""
          )}>
            {t('home.hero.title')}
          </h1>

          <p className={cn(
            "text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-lg",
            isRTL ? "font-cairo" : ""
          )}>
            {t('home.hero.subtitle')}
          </p>

          <div className={cn(
            "flex flex-col sm:flex-row gap-4 justify-center items-center",
            isRTL ? "sm:flex-row-reverse" : ""
          )}>
            <Button
              size="lg"
              className="bg-terracotta hover:bg-terracotta-600 text-white px-8 py-4 text-lg rounded-2xl shadow-2xl hover:shadow-terracotta/25 transition-all duration-300"
            >
              {t('home.hero.cta')}
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:border-white/50 px-8 py-4 text-lg rounded-2xl shadow-xl transition-all duration-300"
            >
              <Link to="/payment-access">
                <CreditCard className="h-5 w-5 mr-2" />
                {isRTL ? "صفحة الدفع" : "Accès Paiement"}
              </Link>
            </Button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-safran/30 to-transparent rounded-full blur-xl" />
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-br from-zellige/30 to-transparent rounded-full blur-xl" />
      </section>

      {/* Payment Access Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-terracotta/5 to-safran/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
            <div className="w-16 h-16 bg-gradient-to-br from-terracotta to-safran rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="h-8 w-8 text-white" />
            </div>
            <h2 className={cn(
              "font-display text-2xl md:text-3xl font-bold text-nuit-900 mb-4",
              isRTL ? "font-cairo" : ""
            )}>
              {isRTL ? "هل لديك طلب بالفعل؟" : "Vous avez déjà une commande ?"}
            </h2>
            <p className={cn(
              "text-lg text-nuit-600 mb-6 max-w-2xl mx-auto",
              isRTL ? "font-cairo" : ""
            )}>
              {isRTL ?
                "أدخل رقم مرجع طلبك للوصول إلى صفحة الدفع وإكمال عملية الدفع بسهولة" :
                "Entrez votre numéro de référence pour accéder à votre page de paiement et finaliser facilement votre commande"
              }
            </p>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-terracotta to-safran hover:from-terracotta-600 hover:to-safran-600 text-white px-8 py-4 text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <Link to="/payment-access">
                <CreditCard className="h-5 w-5 mr-2" />
                {isRTL ? "الوصول لصفحة الدفع" : "Accéder à la page de paiement"}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Special Offers Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className={cn(
            "text-center mb-12",
            isRTL ? "text-right" : "text-left"
          )}>
            <h2 className={cn(
              "font-display text-3xl md:text-4xl font-bold text-nuit-900 mb-4",
              isRTL ? "font-cairo" : ""
            )}>
              {t('home.offers.title')}
            </h2>
            <p className="text-nuit-600 text-lg max-w-2xl mx-auto">
              {isRTL ? "اكتشف عروضنا الخاصة مع إمكانية الطلب بنقرة واحدة" : "Découvrez nos offres spéciales avec commande en un clic"}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {offers.map((offer) => (
              <OfferCard
                key={offer.id}
                {...offer}
                onOneClick={handleOneClickOrder}
                className="mx-auto max-w-md md:max-w-none"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className={cn(
            "text-center mb-12",
            isRTL ? "text-right" : "text-left"
          )}>
            <h2 className={cn(
              "font-display text-3xl md:text-4xl font-bold text-nuit-900 mb-4",
              isRTL ? "font-cairo" : ""
            )}>
              {isRTL ? "من��ج��تنا المميزة" : "Nos Spécialités"}
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-sable-100 to-sable-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={cn(
            "font-display text-3xl md:text-4xl font-bold text-nuit-900 mb-8",
            isRTL ? "font-cairo" : ""
          )}>
            {t('home.story.title')}
          </h2>
          
          <div className="prose prose-lg max-w-none text-nuit-700">
            <p className={cn(
              "leading-relaxed",
              isRTL ? "font-cairo text-right" : "text-left"
            )}>
              {t('home.story.content')}
            </p>
          </div>
          
          <div className="flex justify-center items-center gap-8 mt-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-terracotta to-safran rounded-full flex items-center justify-center mb-4 mx-auto">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <p className="font-semibold text-nuit-900">{t('home.features.authentic')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-safran to-zellige rounded-full flex items-center justify-center mb-4 mx-auto">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <p className="font-semibold text-nuit-900">{t('home.features.quality')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-zellige to-terracotta rounded-full flex items-center justify-center mb-4 mx-auto">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <p className="font-semibold text-nuit-900">{t('home.features.delivery')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-nuit-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-terracotta to-safran rounded-full flex items-center justify-center">
                  <ChefHat className="h-7 w-7 text-white" />
                </div>
                <span className="font-display text-2xl font-bold">
                  {isRTL ? "كازا نوال" : "CasaNawal"}
                </span>
              </div>
              <p className={cn(
                "text-nuit-300 mb-6 leading-relaxed",
                isRTL ? "font-cairo text-right" : "text-left"
              )}>
                {isRTL
                  ? "أفضل المأكولات المغربية الأصيلة مع خدمة توصيل متميزة إلى باب منزلكم من كازا نوال"
                  : "La meilleure cuisine marocaine authentique avec livraison de qualité directement chez vous par CasaNawal"
                }
              </p>

              {/* Social Media Links */}
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-nuit-800 hover:bg-terracotta rounded-full flex items-center justify-center transition-colors" aria-label="Facebook">
                  <span className="text-sm">📘</span>
                </a>
                <a href="#" className="w-10 h-10 bg-nuit-800 hover:bg-terracotta rounded-full flex items-center justify-center transition-colors" aria-label="Instagram">
                  <span className="text-sm">📷</span>
                </a>
                <a href="#" className="w-10 h-10 bg-nuit-800 hover:bg-terracotta rounded-full flex items-center justify-center transition-colors" aria-label="WhatsApp">
                  <span className="text-sm">💬</span>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className={cn(
                "font-semibold text-lg mb-6",
                isRTL ? "font-cairo text-right" : "text-left"
              )}>
                {isRTL ? "روابط سريعة" : "Liens Rapides"}
              </h3>
              <div className="space-y-3">
                <Link to="/menu" className={cn(
                  "block text-nuit-300 hover:text-terracotta transition-colors",
                  isRTL ? "text-right" : "text-left"
                )}>
                  {t('nav.menu')}
                </Link>
                <Link to="/offers" className={cn(
                  "block text-nuit-300 hover:text-terracotta transition-colors",
                  isRTL ? "text-right" : "text-left"
                )}>
                  {t('nav.offers')}
                </Link>
                <Link to="/about" className={cn(
                  "block text-nuit-300 hover:text-terracotta transition-colors",
                  isRTL ? "text-right" : "text-left"
                )}>
                  {t('nav.about')}
                </Link>
                <Link to="/contact" className={cn(
                  "block text-nuit-300 hover:text-terracotta transition-colors",
                  isRTL ? "text-right" : "text-left"
                )}>
                  {t('nav.contact')}
                </Link>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className={cn(
                "font-semibold text-lg mb-6",
                isRTL ? "font-cairo text-right" : "text-left"
              )}>
                {t('nav.contact')}
              </h3>
              <div className="space-y-4">
                <div className={cn(
                  "flex items-center gap-3",
                  isRTL ? "flex-row-reverse" : "flex-row"
                )}>
                  <Phone className="h-5 w-5 text-terracotta" />
                  <div>
                    <p className="text-nuit-300">+212 6 XX XX XX XX</p>
                    <p className="text-xs text-nuit-400">
                      {isRTL ? "��تاح 24/7" : "Disponible 24h/7j"}
                    </p>
                  </div>
                </div>
                <div className={cn(
                  "flex items-center gap-3",
                  isRTL ? "flex-row-reverse" : "flex-row"
                )}>
                  <Mail className="h-5 w-5 text-terracotta" />
                  <div>
                    <p className="text-nuit-300">contact@casanawal.ma</p>
                    <p className="text-xs text-nuit-400">
                      {isRTL ? "ردود سريعة" : "Réponse rapide"}
                    </p>
                  </div>
                </div>
                <div className={cn(
                  "flex items-center gap-3",
                  isRTL ? "flex-row-reverse" : "flex-row"
                )}>
                  <MapPin className="h-5 w-5 text-terracotta" />
                  <div>
                    <p className="text-nuit-300">{isRTL ? "الدار البيضاء، المغرب" : "Casablanca, Maroc"}</p>
                    <p className="text-xs text-nuit-400">
                      {isRTL ? "توصيل محلي" : "Livraison locale"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours & Newsletter */}
            <div>
              <h3 className={cn(
                "font-semibold text-lg mb-6",
                isRTL ? "font-cairo text-right" : "text-left"
              )}>
                {isRTL ? "سا��ات العمل" : "Horaires"}
              </h3>
              <div className="space-y-2 mb-6">
                <div className={cn(
                  "flex justify-between",
                  isRTL ? "flex-row-reverse" : "flex-row"
                )}>
                  <span className="text-nuit-300">{isRTL ? "الإثنين - الجمعة" : "Lun - Ven"}</span>
                  <span className="text-white">9h - 22h</span>
                </div>
                <div className={cn(
                  "flex justify-between",
                  isRTL ? "flex-row-reverse" : "flex-row"
                )}>
                  <span className="text-nuit-300">{isRTL ? "عطلة نهاية الأسبوع" : "Week-end"}</span>
                  <span className="text-white">10h - 23h</span>
                </div>
              </div>

              {/* Newsletter */}
              <div>
                <h4 className={cn(
                  "font-medium mb-3",
                  isRTL ? "font-cairo text-right" : "text-left"
                )}>
                  {isRTL ? "النشرة الإخبارية" : "Newsletter"}
                </h4>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder={isRTL ? "بريدك ال��لكتروني" : "Votre email"}
                    className={cn(
                      "flex-1 px-3 py-2 bg-nuit-800 border border-nuit-700 rounded-lg text-white placeholder-nuit-400 focus:outline-none focus:border-terracotta text-sm",
                      isRTL ? "text-right" : "text-left"
                    )}
                  />
                  <Button className="bg-terracotta hover:bg-terracotta-600 text-white px-4 py-2 rounded-lg text-sm">
                    ���️
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-nuit-700 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className={cn(
                "text-nuit-400 text-sm",
                isRTL ? "text-right" : "text-left"
              )}>
                <p>&copy; 2024 CasaNawal. {isRTL ? "��ميع الحقوق محفوظة." : "Tous droits réservés."}</p>
              </div>

              <div className="flex gap-6 text-sm">
                <Link to="/legal/privacy" className="text-nuit-400 hover:text-terracotta transition-colors">
                  {isRTL ? "سياسة الخصوص��ة" : "Confidentialité"}
                </Link>
                <Link to="/legal/terms" className="text-nuit-400 hover:text-terracotta transition-colors">
                  {isRTL ? "شروط الاستخدام" : "Conditions"}
                </Link>
                <Link to="/legal/refund" className="text-nuit-400 hover:text-terracotta transition-colors">
                  {isRTL ? "سياسة ��لإرجاع" : "Remboursement"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
