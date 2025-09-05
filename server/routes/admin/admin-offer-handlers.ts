// =====================================================
// ADMIN OFFER HANDLERS - CRUD operations for offers
// =====================================================

import { Request, Response } from 'express';
import { db } from '../../database/connection.ts';

// Get all offers
export const getAllOffers = async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT
        id,
        title,
        description,
        image_url,
        discount_percentage,
        discount_amount,
        original_price,
        final_price,
        items,
        is_featured,
        is_active,
        sort_order,
        valid_from,
        valid_until,
        created_at,
        updated_at
      FROM offers
      ORDER BY sort_order ASC, created_at DESC
    `;

    const result = await db.query(query);
    res.json({
      success: true,
      offers: result.rows
    });
  } catch (error) {
    console.error('Error fetching offers:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des offres'
    });
  }
};

// Get offer by ID
export const getOfferById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT * FROM offers WHERE id = $1
    `;

    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Offre non trouvée'
      });
    }

    res.json({
      success: true,
      offer: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching offer:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération de l\'offre'
    });
  }
};

// Create new offer
export const createOffer = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      image_url,
      discount_percentage,
      discount_amount,
      original_price,
      final_price,
      items,
      is_featured,
      is_active,
      sort_order,
      valid_from,
      valid_until
    } = req.body;

    const query = `
      INSERT INTO offers (
        title, description, image_url, discount_percentage, discount_amount,
        original_price, final_price, items, is_featured, is_active,
        sort_order, valid_from, valid_until
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;

    const values = [
      title, description, image_url, discount_percentage, discount_amount,
      original_price, final_price, JSON.stringify(items || []), is_featured || false,
      is_active !== undefined ? is_active : true, sort_order || 0,
      valid_from, valid_until
    ];

    const result = await db.query(query, values);

    res.status(201).json({
      success: true,
      offer: result.rows[0],
      message: 'Offre créée avec succès'
    });
  } catch (error) {
    console.error('Error creating offer:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la création de l\'offre'
    });
  }
};

// Update offer
export const updateOffer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      image_url,
      discount_percentage,
      discount_amount,
      original_price,
      final_price,
      items,
      is_featured,
      is_active,
      sort_order,
      valid_from,
      valid_until
    } = req.body;

    const query = `
      UPDATE offers SET
        title = $1,
        description = $2,
        image_url = $3,
        discount_percentage = $4,
        discount_amount = $5,
        original_price = $6,
        final_price = $7,
        items = $8,
        is_featured = $9,
        is_active = $10,
        sort_order = $11,
        valid_from = $12,
        valid_until = $13,
        updated_at = NOW()
      WHERE id = $14
      RETURNING *
    `;

    const values = [
      title, description, image_url, discount_percentage, discount_amount,
      original_price, final_price, JSON.stringify(items || []), is_featured,
      is_active, sort_order, valid_from, valid_until, id
    ];

    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Offre non trouvée'
      });
    }

    res.json({
      success: true,
      offer: result.rows[0],
      message: 'Offre mise à jour avec succès'
    });
  } catch (error) {
    console.error('Error updating offer:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la mise à jour de l\'offre'
    });
  }
};

// Delete offer
export const deleteOffer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const query = 'DELETE FROM offers WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Offre non trouvée'
      });
    }

    res.json({
      success: true,
      message: 'Offre supprimée avec succès'
    });
  } catch (error) {
    console.error('Error deleting offer:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la suppression de l\'offre'
    });
  }
};

// Toggle offer status (active/inactive)
export const toggleOfferStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    const query = `
      UPDATE offers SET
        is_active = $1,
        updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `;

    const result = await db.query(query, [is_active, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Offre non trouvée'
      });
    }

    res.json({
      success: true,
      offer: result.rows[0],
      message: `Offre ${is_active ? 'activée' : 'désactivée'} avec succès`
    });
  } catch (error) {
    console.error('Error toggling offer status:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la mise à jour du statut'
    });
  }
};

// Toggle featured status
export const toggleOfferFeatured = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { is_featured } = req.body;

    const query = `
      UPDATE offers SET
        is_featured = $1,
        updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `;

    const result = await db.query(query, [is_featured, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Offre non trouvée'
      });
    }

    res.json({
      success: true,
      offer: result.rows[0],
      message: `Offre ${is_featured ? 'marquée comme vedette' : 'retirée des vedettes'}`
    });
  } catch (error) {
    console.error('Error toggling featured status:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la mise à jour du statut vedette'
    });
  }
};

// Get featured offers (for home page)
export const getFeaturedOffers = async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT
        id,
        title,
        description,
        image_url,
        discount_percentage,
        discount_amount,
        original_price,
        final_price,
        items
      FROM offers
      WHERE is_featured = true AND is_active = true
      AND (valid_until IS NULL OR valid_until > NOW())
      ORDER BY sort_order ASC, created_at DESC
    `;

    const result = await db.query(query);
    res.json({
      success: true,
      offers: result.rows
    });
  } catch (error) {
    console.error('Error fetching featured offers:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des offres vedettes'
    });
  }
};
