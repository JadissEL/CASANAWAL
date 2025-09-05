// =====================================================
// PRODUCT MODAL LAYOUT COMPONENT (≤150 lines)
// =====================================================

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Save } from "lucide-react";
import { 
  Product,
  FormData, 
  FormErrors, 
  EnterpriseState,
  EnterpriseMessage
} from "./product-modal-types";
import { ModalHeader, MessageAlert } from "./product-modal-header";
import { ProductFormSections } from "./product-form-sections";

interface ProductModalLayoutProps {
  product: Product | null;
  formData: FormData;
  formErrors: FormErrors;
  enterpriseState: EnterpriseState;
  message?: EnterpriseMessage | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onFieldChange: (field: keyof FormData) => (value: string | boolean) => void;
}

export const ProductModalLayout: React.FC<ProductModalLayoutProps> = ({
  product,
  formData,
  formErrors,
  enterpriseState,
  message,
  isSubmitting,
  onClose,
  onSubmit,
  onFieldChange
}) => {
  const getModalStatus = () => {
    if (isSubmitting) return 'saving';
    if (!enterpriseState.validation.isValid) return 'invalid';
    if (enterpriseState.validation.hasChanges) return 'valid';
    return 'idle';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <ModalHeader
          title={product ? 'Modifier le produit' : 'Nouveau produit'}
          onClose={onClose}
          status={getModalStatus()}
          renderCount={enterpriseState.monitoring.renderCount}
          validationTime={enterpriseState.monitoring.validationTime}
          securityScore={95}
        />
        
        {message && (
          <div className="px-6 pt-4">
            <MessageAlert message={message} />
          </div>
        )}

        <CardContent className="p-6 overflow-y-auto">
          <ProductFormSections
            formData={formData}
            formErrors={formErrors}
            onFieldChange={onFieldChange}
          />
        </CardContent>

        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button 
            onClick={onSubmit} 
            disabled={!enterpriseState.validation.isValid || isSubmitting}
          >
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </div>
      </Card>
    </div>
  );
};
