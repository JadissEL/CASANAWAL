import { OfferItem } from "./offers-types";

// Static offers configuration (could be sourced from CMS or API later)
export const currentOffers: OfferItem[] = [
  {
    id: "family-feast",
    title: "Festin Familial",
    subtitle: "Tagine + Couscous + Dessert",
    originalPrice: 280,
    offerPrice: 199,
    discount: 30,
    validUntil: "2024-02-15",
    description: "Offre spéciale famille: Tagine de poulet, couscous royal et chebakia traditionnelle",
    features: [
      "Pour 4-6 personnes",
      "Livraison gratuite",
      "Ingrédients frais"
    ],
    badge: "Plus Populaire",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&q=80"
  },
  {
    id: "weekend-special",
    title: "Spécial Week-end",
    subtitle: "Réduction sur tous les Tagines",
    originalPrice: 95,
    offerPrice: 75,
    discount: 20,
    validUntil: "2024-02-11",
    description: "Profitez de 20% de réduction sur tous nos tagines pendant le week-end",
    features: [
      "Tous les tagines",
      "Valable Ven-Dim",
      "Hors livraison"
    ],
    badge: "Temps Limité",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80"
  },
  {
    id: "first-order",
    title: "Bienvenue Nouveaux Clients",
    subtitle: "Réduction première commande",
    originalPrice: 150,
    offerPrice: 99,
    discount: 35,
    validUntil: "2024-02-29",
    description: "Remise spéciale de 35% pour les nouveaux clients sur leur première commande",
    features: [
      "Nouveaux clients uniquement",
      "Minimum 100 MAD",
      "Code: BIENVENUE"
    ],
    badge: "Nouveaux",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80"
  }
];


