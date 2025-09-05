import { useState } from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { useCart } from "@/contexts/CartContext";
import { ProductVariant } from "@shared/api";
import { DataLoadingState } from "@/components/shared/LoadingSpinner";
import { containerVariants } from "./menu/menu-animations";
import { useMenuPage } from "./menu/menu-hooks";
import { MenuHero } from "./menu/menu-hero";
import { MenuFilters } from "./menu/menu-filters";
import { MenuResultsHeader } from "./menu/menu-results-header";
import { MenuGrid } from "./menu/menu-grid";

const Menu = () => {
  const { addItem } = useCart();
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    categories,
    products,
    filteredItems,
    loading,
    error
  } = useMenuPage();

  const [showFilters, setShowFilters] = useState(false);

  const handleAddToCart = (productId: string, quantity: number, selectedPortion: ProductVariant, finalPrice: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Use Array.from for more efficient multiple item addition
    Array.from({ length: quantity }, () => {
      addItem({
        id: `${product.id}-${selectedPortion.name}`,
        name: `${product.name} (${selectedPortion.name})`,
        price: finalPrice,
        image: product.main_image || '',
        portion: {
          size: selectedPortion.name,
          discount: 0, // Calculate discount based on price modifier
          persons: 1
        }
      });
    });
  };

  // Loading and error state
  if (loading || error) {
    return (
      <div className="page-layout">
        <Navigation />
        <div className="page-content">
          <DataLoadingState
            loading={loading}
            error={error}
            loadingText="Chargement du menu..."
            errorText="Erreur de chargement"
            onRetry={() => window.location.reload()}
          >
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <p className="text-lg font-medium text-muted-foreground mb-4">
                  Chargement en cours...
                </p>
              </div>
            </div>
          </DataLoadingState>
        </div>
      </div>
    );
  }

  return (
    <div className="page-layout">
      <Navigation />
      <MenuHero searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Menu Content */}
      <div className="page-content">
        <div className="flex flex-col lg:flex-row gap-8">
          <MenuFilters
            categories={categories}
            selectedCategory={selectedCategory}
            onChangeCategory={setSelectedCategory}
            priceRange={priceRange}
            onChangePriceRange={setPriceRange}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
          />

          <motion.main className="flex-1" initial="hidden" animate="visible" variants={containerVariants}>
            <MenuResultsHeader
              selectedCategory={selectedCategory}
              categories={categories}
              resultsCount={filteredItems.length}
            />
            <MenuGrid items={filteredItems} onAddToCart={handleAddToCart} />
          </motion.main>
        </div>
      </div>
    </div>
  );
};

export default Menu;
