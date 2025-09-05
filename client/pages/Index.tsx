import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { useCart } from "@/contexts/CartContext";
import { ProductVariant } from "@shared/api";
import { RefetchIndicator } from "@/components/shared/LoadingSpinner";
import { useHomePage } from "./index/home-hooks";
import { HomeHero } from "./index/home-hero";
import { HomeStats } from "./index/home-stats";
import { HomeFeatured } from "./index/home-featured";
import { HomeOffers } from "./index/home-offers";
import { HomeFeatures } from "./index/home-features";
import { HomeContact } from "./index/home-contact";

const Index = () => {
  const { addItem } = useCart();
  const { offers, heroY, heroOpacity, menuLoading, menuStats, featuredProducts } = useHomePage();

  const handleOneClickOrder = (offerId: string) => {
    const offer = offers.find(o => o.id === offerId);
    if (!offer) return;

    // If offer has items array, add them individually
    if (offer.items && offer.items.length > 0) {
      const originalPrice = offer.original_price || 0;
      const finalPrice = offer.final_price || 0;
      const discountPercentage = offer.discount_percentage || 0;
      const displayPrice = finalPrice || (originalPrice * (1 - discountPercentage / 100));
      const pricePerItem = Math.round(displayPrice / offer.items.length);

      offer.items.forEach((item: any, index: number) => {
        addItem({
          id: `${item.id || `offer-${offerId}-item-${index}`}-offer-${offerId}`,
          name: item.name || `Article ${index + 1}`,
          price: pricePerItem,
          image: item.image || offer.image_url || '/images/placeholder.svg',
          category: item.category || 'Offre spéciale'
        });
      });
    } else {
      // If no items array, add the offer as a single item
      const originalPrice = offer.original_price || 0;
      const finalPrice = offer.final_price || 0;
      const discountPercentage = offer.discount_percentage || 0;
      const displayPrice = finalPrice || (originalPrice * (1 - discountPercentage / 100));

      addItem({
        id: `offer-${offerId}`,
        name: offer.title,
        price: displayPrice,
        image: offer.image_url || '/images/placeholder.svg',
        category: 'Offre spéciale'
      });
    }
  };

  const handleAddToCart = (
    productId: string,
    quantity: number,
    selectedPortion: ProductVariant,
    finalPrice: number
  ) => {
    const product = featuredProducts.find(p => p.id === productId);
    if (!product) return;

    // Use Array.from for more efficient multiple item addition
    Array.from({ length: quantity }, () => {
        addItem({
          id: product.id,
          name: product.name,
          price: finalPrice,
          image: product.main_image || '',
          category: product.category_name
        });
    });
  };

  return (
    <div className="page-layout">
      {/* Navigation */}
      <Navigation />

      <HomeHero heroY={heroY} heroOpacity={heroOpacity} />

      <HomeStats menuStats={menuStats} />

      <HomeFeatured products={featuredProducts} loading={menuLoading} onAddToCart={handleAddToCart} />

      <HomeOffers offers={offers} onOneClickOrder={handleOneClickOrder} />

      <HomeFeatures />

      <HomeContact />
    </div>
  );
};

export default Index;
