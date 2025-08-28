import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { MoroccanPattern } from "@/components/ui/moroccan-pattern";
import { ProductCard } from "@/components/ui/product-card";
import { useLanguage } from "@/lib/useLanguage";
import { useCart } from "@/contexts/CartContext";
import { 
  ChefHat, 
  ArrowLeft, 
  Search,
  Filter,
  SlidersHorizontal,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  MENU_DATA, 
  getAllMenuItems, 
  searchMenuItems, 
  getMenuCategories,
  MenuItem,
  PortionOption,
  calculatePortionPrice
} from "@/data/menuData";

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

const Menu = () => {
  const { isRTL, t } = useLanguage();
  const { addItem } = useCart();

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 200 });
  const [showFilters, setShowFilters] = useState(false);

  const categories = getMenuCategories();

  // Filter and search logic
  const filteredItems = useMemo(() => {
    let items = getAllMenuItems();

    // Search filter
    if (searchQuery) {
      items = searchMenuItems(searchQuery);
    }

    // Category filter
    if (selectedCategory !== "all") {
      items = items.filter(item => {
        const category = categories.find(cat => cat.items.includes(item));
        return category?.id === selectedCategory;
      });
    }

    // Price filter (based on single portion price)
    items = items.filter(item => {
      const singlePrice = calculatePortionPrice(item.basePrice, item.portionOptions[0]);
      return singlePrice >= priceRange.min && singlePrice <= priceRange.max;
    });

    return items;
  }, [searchQuery, selectedCategory, priceRange, categories]);

  const handleAddToCart = (productId: string, quantity: number, selectedPortion: PortionOption, finalPrice: number) => {
    const product = getAllMenuItems().find(p => p.id === productId);
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addItem({
          id: `${product.id}-${selectedPortion.size}`,
          name: `${product.name} (${selectedPortion.sizeFr})`,
          nameAr: `${product.nameAr} (${selectedPortion.sizeAr})`,
          price: finalPrice,
          image: product.imageUrl,
          portion: selectedPortion
        });
      }
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setPriceRange({ min: 0, max: 200 });
  };

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
            {/* Logo */}
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

            {/* Navigation Actions */}
            <div className="flex items-center gap-4">
              <LanguageToggle />
              <Button 
                asChild
                className="bg-terracotta hover:bg-terracotta-600 text-white focus:ring-terracotta focus:ring-offset-2"
              >
                <Link to="/cart">
                  {t('nav.cart')}
                </Link>
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
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h1 className={cn(
              "font-display text-4xl md:text-5xl lg:text-6xl font-bold text-nuit-900 mb-6",
              isRTL ? "font-cairo" : ""
            )}>
              {t('menu.title')}
            </h1>
            
            <div className="w-24 h-1 bg-gradient-to-r from-terracotta via-safran to-zellige mx-auto mb-8 rounded-full"></div>
            
            <p className={cn(
              "text-lg md:text-xl text-nuit-600 max-w-3xl mx-auto leading-relaxed",
              isRTL ? "font-cairo" : ""
            )}>
              {t('menu.subtitle')}
            </p>
          </motion.div>

          {/* Filters Section */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-sable-200">
              {/* Mobile Filter Toggle */}
              <div className="md:hidden mb-4">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  {isRTL ? "المرشحات" : "Filtres"}
                </Button>
              </div>

              {/* Filters */}
              <div className={cn(
                "space-y-4 md:space-y-0 md:grid md:grid-cols-4 md:gap-4",
                showFilters ? "block" : "hidden md:grid"
              )}>
                {/* Search */}
                <div>
                  <label className={cn(
                    "text-sm font-medium text-nuit-700 mb-2 block",
                    isRTL ? "text-right" : "text-left"
                  )}>
                    {isRTL ? "البحث:" : "Recherche:"}
                  </label>
                  <div className="relative">
                    <Search className={cn(
                      "absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-nuit-400",
                      isRTL ? "right-3" : "left-3"
                    )} />
                    <Input
                      type="text"
                      placeholder={isRTL ? "ابحث عن طبق..." : "Rechercher un plat..."}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={cn(
                        "w-full",
                        isRTL ? "pr-10 text-right" : "pl-10 text-left"
                      )}
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <label className={cn(
                    "text-sm font-medium text-nuit-700 mb-2 block",
                    isRTL ? "text-right" : "text-left"
                  )}>
                    {isRTL ? "الفئة:" : "Catégorie:"}
                  </label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        {isRTL ? "جميع الفئات" : "Toutes les catégories"}
                      </SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.icon} {isRTL ? category.nameAr : category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div>
                  <label className={cn(
                    "text-sm font-medium text-nuit-700 mb-2 block",
                    isRTL ? "text-right" : "text-left"
                  )}>
                    {isRTL ? "نطاق السعر:" : "Gamme de prix:"}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder={isRTL ? "الحد الأدنى" : "Min"}
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                      className="text-sm"
                    />
                    <Input
                      type="number"
                      placeholder={isRTL ? "الحد الأقصى" : "Max"}
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                      className="text-sm"
                    />
                  </div>
                </div>

                {/* Reset Filters */}
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={resetFilters}
                    className="w-full"
                  >
                    <X className="h-4 w-4 mr-2" />
                    {isRTL ? "إعادة تعيين" : "Reset"}
                  </Button>
                </div>
              </div>

              {/* Results Summary */}
              <div className="mt-4 pt-4 border-t border-sable-200">
                <p className="text-sm text-nuit-600">
                  {filteredItems.length} {isRTL ? "طبق موجود" : "plats trouvés"}
                  {searchQuery && (
                    <span>
                      {isRTL ? " للبحث عن" : " pour"} "{searchQuery}"
                    </span>
                  )}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Menu Items Grid */}
          <motion.div variants={itemVariants}>
            {filteredItems.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredItems.map((item) => (
                  <ProductCard
                    key={item.id}
                    {...item}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-sable-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="h-10 w-10 text-nuit-400" />
                </div>
                <h3 className={cn(
                  "font-display text-xl font-semibold text-nuit-900 mb-4",
                  isRTL ? "font-cairo" : ""
                )}>
                  {isRTL ? "لم توجد نتائج" : "Aucun résultat trouvé"}
                </h3>
                <p className="text-nuit-600 mb-6">
                  {isRTL ? 
                    "حاول تعديل معايير البحث أو إعادة تعيين المرشحات" :
                    "Essayez de modifier vos critères de recherche ou de réinitialiser les filtres"
                  }
                </p>
                <Button onClick={resetFilters} variant="outline">
                  {isRTL ? "إعادة تعيين المرشحات" : "Réinitialiser les filtres"}
                </Button>
              </div>
            )}
          </motion.div>

          {/* Categories Quick Access */}
          <motion.div variants={itemVariants} className="mt-16">
            <h2 className={cn(
              "font-display text-2xl md:text-3xl font-semibold text-nuit-900 mb-8 text-center",
              isRTL ? "font-cairo" : ""
            )}>
              {t('menu.categories')}
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
              {categories.map((category) => (
                <motion.div
                  key={category.id}
                  variants={itemVariants}
                  className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-soft-lg transition-all duration-300 group cursor-pointer border border-sable-200 relative overflow-hidden"
                  onClick={() => setSelectedCategory(category.id)}
                  role="button"
                  tabIndex={0}
                  aria-label={`${category.name} - ${category.items.length} ${isRTL ? 'أطباق' : 'plats'}`}
                >
                  <MoroccanPattern
                    variant="subtle"
                    pattern="geometric"
                    animated={false}
                    corners={false}
                    className="rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />
                  <div className="text-center relative z-10">
                    <div className="text-4xl mb-4">{category.icon}</div>
                    <h3 className={cn(
                      "font-semibold text-nuit-900 mb-2 group-hover:text-terracotta transition-colors",
                      isRTL ? "font-cairo" : ""
                    )}>
                      {isRTL ? category.nameAr : category.name}
                    </h3>
                    <p className="text-sm text-nuit-600 font-semibold">
                      {category.items.length} {isRTL ? 'أطباق' : 'plats'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div variants={itemVariants} className="text-center mt-16">
            <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-soft max-w-2xl mx-auto relative overflow-hidden">
              <MoroccanPattern
                variant="subtle"
                pattern="mixed"
                animated={true}
                corners={true}
                className="rounded-3xl"
              />

              <div className="relative z-10">
                <h3 className={cn(
                  "font-display text-xl md:text-2xl font-semibold text-nuit-900 mb-4",
                  isRTL ? "font-cairo" : ""
                )}>
                  {isRTL ? "هل تحتاج مساعدة في الاختيار؟" : "Besoin d'aide pour choisir?"}
                </h3>

                <p className={cn(
                  "text-nuit-600 mb-8 leading-relaxed",
                  isRTL ? "font-cairo" : ""
                )}>
                  {isRTL
                    ? "تواصل معنا وسنساعدك في اختيار الأطباق المثالية لمناسبتك"
                    : "Contactez-nous et nous vous aiderons à choisir les plats parfaits pour votre occasion"
                  }
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    asChild
                    size="lg"
                    className="bg-terracotta hover:bg-terracotta-600 text-white px-8 py-4 text-lg rounded-2xl shadow-soft-lg focus:ring-terracotta focus:ring-offset-2"
                  >
                    <Link to="/contact">
                      {isRTL ? "اتصل بنا" : "Nous Contacter"}
                    </Link>
                  </Button>

                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-terracotta text-terracotta hover:bg-terracotta hover:text-white px-8 py-4 text-lg rounded-2xl focus:ring-terracotta focus:ring-offset-2"
                  >
                    <Link to="/offers">
                      {t('menu.discoverOffers')}
                    </Link>
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

export default Menu;
