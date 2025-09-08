import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Star, StarOff, Gift } from "lucide-react";
import { Offer, UpdateMessage } from "./dashboard-types";

interface DashboardOffersProps {
  onMessage: (message: UpdateMessage) => void;
}

export const DashboardOffers = ({ onMessage }: DashboardOffersProps) => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await fetch('/api/admin/offers');
      if (response.ok) {
        const data = await response.json();
        setOffers(data.offers || []);
      } else {
        onMessage({ type: 'error', text: 'Erreur lors du chargement des offres' });
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
      onMessage({ type: 'error', text: 'Erreur réseau' });
    } finally {
      setLoading(false);
    }
  };

  const toggleOfferStatus = async (offerId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/offers/${offerId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: isActive })
      });

      if (response.ok) {
        setOffers(offers.map(offer =>
          offer.id === offerId ? { ...offer, is_active: isActive } : offer
        ));
        onMessage({
          type: 'success',
          text: `Offre ${isActive ? 'activée' : 'désactivée'} avec succès`
        });
      } else {
        onMessage({ type: 'error', text: 'Erreur lors de la mise à jour' });
      }
    } catch (error) {
      console.error('Error updating offer status:', error);
      onMessage({ type: 'error', text: 'Erreur réseau' });
    }
  };

  const toggleFeaturedStatus = async (offerId: string, isFeatured: boolean) => {
    try {
      const response = await fetch(`/api/admin/offers/${offerId}/featured`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_featured: isFeatured })
      });

      if (response.ok) {
        setOffers(offers.map(offer =>
          offer.id === offerId ? { ...offer, is_featured: isFeatured } : offer
        ));
        onMessage({
          type: 'success',
          text: `Offre ${isFeatured ? 'marquée comme vedette' : 'retirée des vedettes'}`
        });
      } else {
        onMessage({ type: 'error', text: 'Erreur lors de la mise à jour' });
      }
    } catch (error) {
      console.error('Error updating featured status:', error);
      onMessage({ type: 'error', text: 'Erreur réseau' });
    }
  };

  const deleteOffer = async (offerId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) return;

    try {
      const response = await fetch(`/api/admin/offers/${offerId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setOffers(offers.filter(offer => offer.id !== offerId));
        onMessage({ type: 'success', text: 'Offre supprimée avec succès' });
      } else {
        onMessage({ type: 'error', text: 'Erreur lors de la suppression' });
      }
    } catch (error) {
      console.error('Error deleting offer:', error);
      onMessage({ type: 'error', text: 'Erreur réseau' });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des Offres</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Offre
        </Button>
      </div>

      <div className="grid gap-4">
        {offers.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-64">
              <Gift className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucune offre</h3>
              <p className="text-muted-foreground text-center">
                Créez votre première offre promotionnelle
              </p>
            </CardContent>
          </Card>
        ) : (
          offers.map((offer) => (
            <Card key={offer.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {offer.image_url && (
                      <img
                        src={offer.image_url}
                        alt={offer.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold flex items-center gap-2">
                        {offer.title}
                        {offer.is_featured && (
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        )}
                      </h3>
                      {offer.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {offer.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={offer.is_active ? "default" : "secondary"}>
                          {offer.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        {offer.discount_percentage && (
                          <Badge variant="outline">
                            -{offer.discount_percentage}%
                          </Badge>
                        )}
                        {offer.final_price && (
                          <span className="text-sm font-medium">
                            {offer.final_price} MAD
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2">
                      <label className="text-sm">Vedette</label>
                      <Switch
                        checked={offer.is_featured}
                        onCheckedChange={(checked) => toggleFeaturedStatus(offer.id, checked)}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <label className="text-sm">Active</label>
                      <Switch
                        checked={offer.is_active}
                        onCheckedChange={(checked) => toggleOfferStatus(offer.id, checked)}
                      />
                    </div>

                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteOffer(offer.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
