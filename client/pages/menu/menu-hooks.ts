import { useState, useMemo } from "react";
import { useMenuData, searchMenuItems } from "@/hooks/useProducts";
import { Product } from "@/lib/api";

export const useMenuPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });

  const { data: menuData, loading, error, stableData: stableMenuData } = useMenuData({
    category: selectedCategory !== "all" ? selectedCategory : undefined,
    search: searchQuery || undefined,
    min_price: priceRange.min,
    max_price: priceRange.max
  });

  const categories = stableMenuData?.categories || [];
  const products: Product[] = stableMenuData?.products || [];

  const filteredItems = useMemo(() => {
    let items = products;
    if (searchQuery && !menuData?.filters?.search) {
      items = searchMenuItems(items, searchQuery);
    }
    if (selectedCategory !== "all" && !menuData?.filters?.category) {
      items = items.filter(item => item.category_slug === selectedCategory);
    }
    if (!menuData?.filters?.min_price || !menuData?.filters?.max_price) {
      items = items.filter(item => {
        const singlePrice = item.base_price;
        return singlePrice >= priceRange.min && singlePrice <= priceRange.max;
      });
    }
    return items;
  }, [products, searchQuery, selectedCategory, priceRange, menuData?.filters]);

  return {
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
  };
};
