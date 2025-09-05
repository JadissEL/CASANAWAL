import type { MenuItem, MenuCategory, DynamicOffer } from './types';

export const createSingleItemOffer = (item: MenuItem): DynamicOffer => {
  const discount = Math.floor(Math.random() * 15) + 10; // 10-25% discount
  const originalPrice = item.basePrice * 2; // Price for 2 persons
  const discountPrice = Math.round(originalPrice * (1 - discount / 100));

  return {
    id: `single-${item.id}`,
    title: `Offre Spéciale: ${item.name}`,
    description: `${item.description} - Portion pour 2 personnes`,
    originalPrice,
    discountPrice,
    imageUrl: item.imageUrl,
    discount,
    rating: item.rating,
    preparationTime: item.preparationTime,
    items: [item],
    category: item.category,
    type: 'single'
  };
};

export const createBundleOffer = (
  config: any,
  allItems: MenuItem[],
  categories: MenuCategory[]
): DynamicOffer | null => {
  const bundleItems: MenuItem[] = [];

  // Select items from specified categories
  for (const categoryId of config.categories) {
    const category = categories.find(cat => cat.id === categoryId);
    if (category) {
      const categoryItems = allItems.filter(item => {
        const itemCategory = categories.find(cat => cat.items.includes(item));
        return itemCategory?.id === categoryId;
      });

      if (categoryItems.length > 0) {
        // Pick highest rated item from each category
        const bestItem = categoryItems.reduce((best, current) =>
          current.rating > best.rating ? current : best
        );
        bundleItems.push(bestItem);
      }
    }
  }

  if (bundleItems.length < config.minItems) {
    return null;
  }

  const originalPrice = bundleItems.reduce((total, item) => total + item.basePrice, 0);
  const discountPrice = Math.round(originalPrice * (1 - config.discount / 100));

  // Use the highest rated item's image
  const featuredItem = bundleItems.reduce((best, current) =>
    current.rating > best.rating ? current : best
  );

  return {
    id: config.id,
    title: config.title,
    description: config.description,
    originalPrice,
    discountPrice,
    imageUrl: featuredItem.imageUrl,
    discount: config.discount,
    rating: bundleItems.reduce((sum, item) => sum + item.rating, 0) / bundleItems.length,
    preparationTime: `${Math.max(...bundleItems.map(item => parseInt(item.preparationTime)))} min`,
    items: bundleItems,
    type: 'bundle'
  };
};

export const createCategoryOffer = (
  categoryId: string,
  allItems: MenuItem[],
  categories: MenuCategory[]
): DynamicOffer | null => {
  const category = categories.find(cat => cat.id === categoryId);
  if (!category || category.items.length < 2) {
    return null;
  }

  // Select top 2 items from the category
  const topItems = category.items
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 2);

  const discount = 20;
  const originalPrice = topItems.reduce((total, item) => total + item.basePrice, 0);
  const discountPrice = Math.round(originalPrice * (1 - discount / 100));

  return {
    id: `category-${categoryId}`,
    title: `Duo ${category.name}`,
    description: `Les 2 meilleurs plats de notre catégorie ${category.name.toLowerCase()}`,
    originalPrice,
    discountPrice,
    imageUrl: topItems[0].imageUrl,
    discount,
    rating: topItems.reduce((sum, item) => sum + item.rating, 0) / topItems.length,
    preparationTime: `${Math.max(...topItems.map(item => parseInt(item.preparationTime)))} min`,
    items: topItems,
    category: categoryId,
    type: 'category'
  };
};

export const createSeasonalOffer = (
  config: any,
  allItems: MenuItem[],
  categories: MenuCategory[]
): DynamicOffer | null => {
  const seasonalItems: MenuItem[] = [];

  // First, try to find required items
  if (config.requiredItems) {
    for (const itemId of config.requiredItems) {
      const item = allItems.find(item => item.id === itemId);
      if (item) {
        seasonalItems.push(item);
      }
    }
  }

  // Then add items from specified categories
  for (const categoryId of config.categories) {
    const category = categories.find(cat => cat.id === categoryId);
    if (category) {
      const categoryItems = allItems.filter(item => {
        const itemCategory = categories.find(cat => cat.items.includes(item));
        return itemCategory?.id === categoryId;
      });

      if (categoryItems.length > 0 && seasonalItems.length < 3) {
        const bestItem = categoryItems.reduce((best, current) =>
          current.rating > best.rating ? current : best
        );
        if (!seasonalItems.includes(bestItem)) {
          seasonalItems.push(bestItem);
        }
      }
    }
  }

  if (seasonalItems.length < 2) {
    return null;
  }

  const originalPrice = seasonalItems.reduce((total, item) => total + item.basePrice, 0);
  const discountPrice = Math.round(originalPrice * (1 - config.discount / 100));

  return {
    id: config.id,
    title: config.title,
    description: config.description,
    originalPrice,
    discountPrice,
    imageUrl: seasonalItems[0].imageUrl,
    discount: config.discount,
    rating: seasonalItems.reduce((sum, item) => sum + item.rating, 0) / seasonalItems.length,
    preparationTime: `${Math.max(...seasonalItems.map(item => parseInt(item.preparationTime)))} min`,
    items: seasonalItems,
    type: 'seasonal'
  };
};

export const createDefaultComboOffer = (allItems: MenuItem[]): DynamicOffer | null => {
  // Create a "Chef's Choice" offer with top-rated items from different categories
  const topRatedItems = allItems
    .filter(item => item.rating >= 4.7)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  if (topRatedItems.length < 2) {
    return null;
  }

  const discount = 22;
  const originalPrice = topRatedItems.reduce((total, item) => total + item.basePrice, 0);
  const discountPrice = Math.round(originalPrice * (1 - discount / 100));

  return {
    id: 'chefs-choice',
    title: 'Menu du Chef',
    description: 'Sélection des plats préférés de notre chef pour une expérience authentique',
    originalPrice,
    discountPrice,
    imageUrl: topRatedItems[0].imageUrl,
    discount,
    rating: topRatedItems.reduce((sum, item) => sum + item.rating, 0) / topRatedItems.length,
    preparationTime: `${Math.max(...topRatedItems.map(item => parseInt(item.preparationTime)))} min`,
    items: topRatedItems,
    type: 'bundle'
  };
};
