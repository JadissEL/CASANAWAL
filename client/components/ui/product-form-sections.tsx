// =====================================================
// PRODUCT FORM SECTIONS COMPONENT (≤150 lines)
// =====================================================

import React from "react";
import { FormData, FormErrors } from "./product-modal-types";
import { 
  SKUField, 
  ProductNameField, 
  TextAreaField, 
  PriceField, 
  TimeField, 
  SortOrderField,
  CheckboxField 
} from "./product-form-fields";

interface ProductFormSectionsProps {
  formData: FormData;
  formErrors: FormErrors;
  onFieldChange: (field: keyof FormData) => (value: string | boolean) => void;
}

export const ProductFormSections: React.FC<ProductFormSectionsProps> = ({
  formData,
  formErrors,
  onFieldChange
}) => {
  return (
    <div className="space-y-4">
      {/* Basic Information Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SKUField
          label="SKU"
          value={formData.sku}
          onChange={onFieldChange('sku')}
          error={formErrors.sku}
          required
        />
        <ProductNameField
          label="Nom du produit"
          value={formData.product_name}
          onChange={onFieldChange('product_name')}
          error={formErrors.product_name}
          required
        />
      </div>

      {/* Description Section */}
      <TextAreaField
        label="Description"
        value={formData.description}
        onChange={onFieldChange('description')}
        error={formErrors.description}
      />

      {/* Pricing and Time Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PriceField
          label="Prix (€)"
          value={formData.base_price}
          onChange={onFieldChange('base_price')}
          error={formErrors.base_price}
          required
        />
        <TimeField
          label="Temps de préparation (min)"
          value={formData.prep_time_minutes}
          onChange={onFieldChange('prep_time_minutes')}
          error={formErrors.prep_time_minutes}
          required
        />
        <SortOrderField
          label="Ordre d'affichage"
          value={formData.sort_order}
          onChange={onFieldChange('sort_order')}
          error={formErrors.sort_order}
        />
      </div>

      {/* Properties Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <CheckboxField
          label="Actif"
          value={formData.is_active}
          onChange={onFieldChange('is_active')}
        />
        <CheckboxField
          label="Végétarien"
          value={formData.is_vegetarian}
          onChange={onFieldChange('is_vegetarian')}
        />
        <CheckboxField
          label="Épicé"
          value={formData.is_spicy}
          onChange={onFieldChange('is_spicy')}
        />
        <CheckboxField
          label="En vedette"
          value={formData.is_featured}
          onChange={onFieldChange('is_featured')}
        />
      </div>
    </div>
  );
};
