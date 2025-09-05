import { db } from '../connection.ts';

export async function seedOffers(): Promise<void> {
  console.log('Seeding offers...');

  const offers = [
    {
      title: 'Festin Familial Traditionnel',
      description: 'Tagine de poulet aux olives et citrons confits, couscous royal et chebakia traditionnelle pour 4-6 personnes',
      discount_percentage: 25,
      original_price: 280,
      final_price: 210,
      items: [
        { name: 'Tagine Poulet', quantity: 1 },
        { name: 'Couscous Royal', quantity: 1 },
        { name: 'Chebakia', quantity: 6 }
      ],
      is_featured: true,
      is_active: true,
      sort_order: 1,
      valid_until: '2025-12-31T23:59:59Z'
    },
    {
      title: 'Menu Week-end Économique',
      description: 'Réduction spéciale de 20% sur tous les tagines pendant le week-end',
      discount_percentage: 20,
      original_price: 95,
      final_price: 76,
      items: [],
      is_featured: true,
      is_active: true,
      sort_order: 2,
      valid_until: '2024-12-31T23:59:59Z'
    },
    {
      title: 'Bienvenue Nouveaux Clients',
      description: 'Première commande avec 35% de réduction pour les nouveaux clients',
      discount_percentage: 35,
      original_price: 150,
      final_price: 97,
      items: [],
      is_featured: false,
      is_active: true,
      sort_order: 3,
      valid_until: '2024-12-31T23:59:59Z'
    },
    {
      title: 'Offre Ramadan Spéciale',
      description: 'Menu spécial Ramadan avec harira, chebakia et dattes premium',
      discount_percentage: 30,
      original_price: 120,
      final_price: 84,
      items: [
        { name: 'Harira', quantity: 1 },
        { name: 'Chebakia', quantity: 4 },
        { name: 'Dattes Premium', quantity: 500 }
      ],
      is_featured: true,
      is_active: true,
      sort_order: 4,
      valid_until: '2025-04-15T23:59:59Z'
    },
    {
      title: 'Combo Étudiant',
      description: 'Offre spéciale pour étudiants : tagine + boisson à prix réduit',
      discount_percentage: 40,
      original_price: 80,
      final_price: 48,
      items: [
        { name: 'Tagine', quantity: 1 },
        { name: 'Boisson', quantity: 1 }
      ],
      is_featured: false,
      is_active: true,
      sort_order: 5,
      valid_until: '2024-12-31T23:59:59Z'
    }
  ];

  for (const offer of offers) {
    await db.query(`
      INSERT INTO offers (
        title, description, discount_percentage, original_price, final_price,
        items, is_featured, is_active, sort_order, valid_until
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (title) DO NOTHING
    `, [
      offer.title,
      offer.description,
      offer.discount_percentage,
      offer.original_price,
      offer.final_price,
      JSON.stringify(offer.items),
      offer.is_featured,
      offer.is_active,
      offer.sort_order,
      offer.valid_until
    ]);
  }

  console.log('Offers seeded successfully');
}
