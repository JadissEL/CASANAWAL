import { useState, useEffect } from 'react';

export interface Offer {
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

export interface OfferItem {
  id: string;
  title: string;
  subtitle: string;
  originalPrice: number;
  offerPrice: number;
  discount: number;
  validUntil: string;
  description: string;
  features: string[];
  badge: string;
  image: string;
}

// Convert database offer to frontend format
const mapOfferToOfferItem = (offer: Offer): OfferItem => {
  const originalPrice = offer.original_price || 0;
  const finalPrice = offer.final_price || 0;
  const discountPercentage = offer.discount_percentage || 0;

  return {
    id: offer.id,
    title: offer.title,
    subtitle: offer.description?.substring(0, 50) || 'Offre spéciale',
    originalPrice: originalPrice,
    offerPrice: finalPrice || (originalPrice * (1 - discountPercentage / 100)),
    discount: discountPercentage || (originalPrice > 0 ? Math.round((1 - (finalPrice / originalPrice)) * 100) : 0),
    validUntil: offer.valid_until || '',
    description: offer.description || '',
    features: [
      `Réduction de ${discountPercentage}%`,
      offer.is_featured ? 'Offre vedette' : 'Offre régulière',
      offer.items?.length ? `${offer.items.length} articles inclus` : 'Article unique'
    ],
    badge: offer.is_featured ? 'Vedette' : 'Offre',
    image: offer.image_url || 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80'
  };
};

export const useOffers = () => {
  const [offers, setOffers] = useState<OfferItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${import.meta.env.VITE_API_BASE || '/api'}/admin/offers`);
      if (response.ok) {
        const data = await response.json();
        const dbOffers = data.offers || [];
        const mappedOffers = dbOffers
          .filter((offer: Offer) => offer.is_active)
          .map(mapOfferToOfferItem);
        setOffers(mappedOffers);
      } else {
        setError('Erreur lors du chargement des offres');
      }
    } catch (err) {
      console.error('Error fetching offers:', err);
      setError('Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  return {
    offers,
    loading,
    error,
    refetch: fetchOffers
  };
};
