// =====================================================
// ADMIN PRODUCT UPDATE HANDLER - REFACTORED FROM SIMPLE-ALL.TS (≤150 lines)
// =====================================================

import { RequestHandler } from "express";
import { db } from "../../database/connection";
import { ProductUpdateData } from './admin-types.js';

// UPDATE PRODUCT (Complex logic extracted to separate file)
export const updateProduct: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData: ProductUpdateData = req.body;
    
    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Aucune donnée à modifier fournie'
      });
    }

    // Vérification d'existence
    const existingProductResult = await db.query(
      'SELECT * FROM products WHERE id = $1', 
      [id]
    );
    
    if (existingProductResult.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Produit introuvable'
      });
    }
    
    const existingProduct = existingProductResult.rows[0];
    
    // Construction de la requête de mise à jour
    const updateFields: string[] = [];
    const updateValues: any[] = [];
    let paramCount = 1;
    
    // Traitement des champs
    for (const [field, value] of Object.entries(updateData)) {
      if (value !== undefined && field !== 'product_name' && field !== 'description') {
        updateFields.push(`${field} = $${paramCount}`);
        updateValues.push(value);
        paramCount++;
      }
    }
    
    // Horodatage
    if (updateFields.length > 0) {
      updateFields.push('updated_at = NOW()');
    }
    
    let updatedProduct = existingProduct;
    
    if (updateFields.length > 0) {
      updateValues.push(id);
      const updateQuery = `
        UPDATE products SET ${updateFields.join(', ')}
        WHERE id = $${paramCount}
        RETURNING *
      `;
      
      const result = await db.query(updateQuery, updateValues);
      updatedProduct = result.rows[0];
    }

    // Mise à jour du nom et description si fournis
    if (updateData.product_name !== undefined || updateData.description !== undefined) {
      const cleanName = updateData.product_name?.trim().substring(0, 255);
      const cleanDescription = updateData.description?.trim().substring(0, 2000);
      
      if (cleanName && cleanName.length > 0) {
        await db.query(`
          UPDATE products 
          SET name = $1, description = $2
          WHERE id = $3
        `, [cleanName, cleanDescription || '', id]);
      }
    }
    
    return res.status(200).json({ 
      success: true, 
      message: 'Produit modifié avec succès',
      data: updatedProduct
    });
    
  } catch (error) {
    console.error('Erreur mise à jour produit:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Erreur interne lors de la modification du produit'
    });
  }
};
