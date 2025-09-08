import type { Product, Category } from '@/lib/api';
import type { MenuItem, MenuCategory, DynamicOffer } from './types';
import { BUNDLE_CONFIGS, SEASONAL_OFFERS } from './configs';
import {
  createSingleItemOffer,
  createBundleOffer,
  createCategoryOffer,
  createSeasonalOffer,
  createDefaultComboOffer
} from './creators';

export const generateDynamicOffers = (
  products: Product[],
  categories: Category[],
  selectedCategory?: string,
  featuredItems?: string[],
  currentSeason?: 'ramadan' | 'summer' | 'winter' | 'default'
): DynamicOffer[] => {
  // Convert API data to legacy format for compatibility
  const allItems: MenuItem[] = products.map(product => ({
    id: product.id,
    name: product.name,
    description: product.description,
    basePrice: product.base_price,
    imageUrl: product.main_image || '',
    rating: product.rating || 4.0,
    preparationTime: `${product.prep_time_minutes || 30} min`,
    category: product.category_slug
  }));

  const menuCategories: MenuCategory[] = categories.map(category => ({
    id: category.slug,
    name: category.name,
    items: allItems.filter(item => item.category === category.slug)
  }));

  const offers: DynamicOffer[] = [];

  // 1. Generate single item offers (featured/high-rated items)
  const singleItemOffers = allItems
    .filter(item => item.rating >= 4.7 || (featuredItems && featuredItems.includes(item.id)))
    .slice(0, 2)
    .map(item => createSingleItemOffer(item));

  offers.push(...singleItemOffers);

  // 2. Generate bundle offers
  const bundleOffers = BUNDLE_CONFIGS
    .filter(config => !selectedCategory || config.categories.includes(selectedCategory))
    .map(config => createBundleOffer(config, allItems, menuCategories))
    .filter(offer => offer !== null) as DynamicOffer[];

  offers.push(...bundleOffers);

  // 3. Generate category-specific offers
  if (selectedCategory) {
    const categoryOffer = createCategoryOffer(selectedCategory, allItems, menuCategories);
    if (categoryOffer) {
      offers.push(categoryOffer);
    }
  }

  // 4. Generate seasonal offers
  if (currentSeason && currentSeason !== 'default') {
    const seasonalOffers = SEASONAL_OFFERS
      .filter(config => config.seasonal)
      .map(config => createSeasonalOffer(config, allItems, menuCategories))
      .filter(offer => offer !== null) as DynamicOffer[];

    offers.push(...seasonalOffers);
  }

  // 5. Default combo offers if no specific category
  if (!selectedCategory) {
    const defaultCombo = createDefaultComboOffer(allItems);
    if (defaultCombo) {
      offers.push(defaultCombo);
    }
  }

  return offers.slice(0, 4); // Limit to 4 offers maximum
};
