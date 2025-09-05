// =====================================================
// PRODUCT MODAL CORE COMPONENT (≤150 lines)
// =====================================================

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Save } from "lucide-react";
import { 
  ProductEditModalProps, 
  FormData, 
  FormErrors, 
  ValidationError,
  EnterpriseState 
} from "./product-modal-types";
import { validateForm, transformFormData } from "./product-validation-utils";
import { ProductModalLayout } from "./product-modal-layout";

export const ProductModalCore: React.FC<ProductEditModalProps> = ({
  product,
  isOpen,
  onClose,
  onSave,
  message
}) => {
  const [formData, setFormData] = useState<FormData>({
    sku: '',
    product_name: '',
    description: '',
    base_price: '',
    prep_time_minutes: '',
    sort_order: '',
    is_active: true,
    is_vegetarian: false,
    is_spicy: false,
    is_featured: false
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enterpriseState, setEnterpriseState] = useState<EnterpriseState>({
    monitoring: {
      validationTime: 0,
      renderCount: 0,
      lastValidation: new Date(),
      performanceMetrics: { validationDuration: 0, renderDuration: 0 }
    },
    security: {
      inputSanitized: true,
      xssProtected: true,
      lastSecurityCheck: new Date()
    },
    validation: {
      isValid: false,
      errors: [],
      hasChanges: false
    }
  });

  const renderCountRef = useRef(0);

  // Initialize form data when product changes
  useEffect(() => {
    if (product) {
      setFormData({
        sku: product.sku || '',
        product_name: product.product_name || '',
        description: product.description || '',
        base_price: product.base_price?.toString() || '',
        prep_time_minutes: product.prep_time_minutes?.toString() || '',
        sort_order: product.sort_order?.toString() || '',
        is_active: product.is_active ?? true,
        is_vegetarian: product.is_vegetarian ?? false,
        is_spicy: product.is_spicy ?? false,
        is_featured: product.is_featured ?? false
      });
    }
  }, [product]);

  // Validation and monitoring
  useEffect(() => {
    const startTime = performance.now();
    const errors = validateForm(formData);
    const endTime = performance.now();
    
    renderCountRef.current += 1;
    
    setEnterpriseState(prev => ({
      ...prev,
      monitoring: {
        ...prev.monitoring,
        validationTime: Math.round(endTime - startTime),
        renderCount: renderCountRef.current,
        lastValidation: new Date()
      },
      validation: {
        isValid: errors.length === 0,
        errors,
        hasChanges: true
      }
    }));

    const errorMap: FormErrors = {};
    errors.forEach(error => {
      errorMap[error.field] = error.message;
    });
    setFormErrors(errorMap);
  }, [formData]);

  const handleFieldChange = useCallback((field: keyof FormData) => (value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = async () => {
    if (!enterpriseState.validation.isValid || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const transformedData = transformFormData(formData);
      await onSave(transformedData);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const getModalStatus = () => {
    if (isSubmitting) return 'saving';
    if (!enterpriseState.validation.isValid) return 'invalid';
    if (enterpriseState.validation.hasChanges) return 'valid';
    return 'idle';
  };

  return (
    <ProductModalLayout
      product={product}
      formData={formData}
      formErrors={formErrors}
      enterpriseState={enterpriseState}
      message={message}
      isSubmitting={isSubmitting}
      onClose={onClose}
      onSubmit={handleSubmit}
      onFieldChange={handleFieldChange}
    />
  );
};
