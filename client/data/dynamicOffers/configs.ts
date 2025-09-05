// Predefined bundle configurations
export const BUNDLE_CONFIGS = [
  {
    id: 'family-feast',
    title: 'Menu Familial Complet',
    description: 'Tajine, couscous royal et desserts traditionnels pour 4 personnes',
    categories: ['tajine', 'couscous', 'desserts'],
    discount: 25,
    minItems: 3
  },
  {
    id: 'appetizer-special',
    title: 'Plateau Découverte',
    description: 'Sélection de nos meilleures entrées marocaines',
    categories: ['bastilla', 'briwat', 'salades'],
    discount: 20,
    minItems: 3
  },
  {
    id: 'grill-combo',
    title: 'Combo Grillades',
    description: 'Assortiment de nos meilleures grillades',
    categories: ['grillades'],
    discount: 15,
    minItems: 2
  }
];

// Seasonal offer configurations
export const SEASONAL_OFFERS = [
  {
    id: 'ramadan-special',
    title: 'Menu Ramadan Spécial',
    description: 'Harira, chebakia et plats traditionnels pour l\'iftar',
    requiredItems: ['harira', 'chebakia'],
    categories: ['soupes', 'desserts', 'specialites'],
    discount: 30,
    seasonal: true
  },
  {
    id: 'weekend-brunch',
    title: 'Brunch du Weekend',
    description: 'Petit-déjeuner marocain complet avec msemen et tajine',
    categories: ['snacks', 'tajine'],
    discount: 18,
    minItems: 2
  }
];
