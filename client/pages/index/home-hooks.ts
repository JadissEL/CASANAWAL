import { useEffect, useState } from "react";
import { useScroll, useTransform } from "framer-motion";
import { useMenuData, useMenuStats } from "@/hooks/useProducts";

interface FeaturedOffer {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  discount_percentage?: number;
  discount_amount?: number;
  original_price?: number;
  final_price?: number;
  items: any[];
  is_featured: boolean;
  is_active: boolean;
  sort_order?: number;
  valid_from?: string;
  valid_until?: string;
  created_at: string;
  updated_at: string;
}

export const useHomePage = () => {
  const [offers, setOffers] = useState<FeaturedOffer[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [offersLoading, setOffersLoading] = useState(true);

  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);

  const { data: menuData, loading: menuLoading, stableData: stableMenuData } = useMenuData({ featured_only: true });
  const { data: menuStats } = useMenuStats();

  const featuredProducts = stableMenuData?.products || [];

  // Fetch featured offers from database
  useEffect(() => {
    const fetchFeaturedOffers = async () => {
      try {
        setOffersLoading(true);
        const response = await fetch('/api/offers/featured');
        if (response.ok) {
          const data = await response.json();
          setOffers(data.offers || []);
        } else {
          console.error('Failed to fetch featured offers');
          // Fallback to dynamic offers if database fails
          const { generateDynamicOffers, getCurrentSeason } = await import("@/data/dynamicOffers");
          const currentSeason = getCurrentSeason();
          const dynamicOffers = generateDynamicOffers(
            featuredProducts,
            menuData?.categories || [],
            selectedCategory,
            undefined,
            currentSeason
          );
          setOffers(dynamicOffers);
        }
      } catch (error) {
        console.error('Error fetching featured offers:', error);
        // Fallback to dynamic offers if network fails
        const { generateDynamicOffers, getCurrentSeason } = await import("@/data/dynamicOffers");
        const currentSeason = getCurrentSeason();
        const dynamicOffers = generateDynamicOffers(
          featuredProducts,
          menuData?.categories || [],
          selectedCategory,
          undefined,
          currentSeason
        );
        setOffers(dynamicOffers);
      } finally {
        setOffersLoading(false);
      }
    };

    fetchFeaturedOffers();
  }, [selectedCategory, featuredProducts, menuData?.categories]);

  return {
    offers,
    setSelectedCategory,
    heroY,
    heroOpacity,
    menuLoading: menuLoading || offersLoading,
    menuStats,
    featuredProducts
  };
};


