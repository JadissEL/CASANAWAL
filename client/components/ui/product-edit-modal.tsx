// ITÉRATION 2: Modal d'édition produit - UX Optimisée + Feedback Avancé
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Save, AlertCircle, CheckCircle } from "lucide-react";

interface Product {
  id: string;
  sku: string;
  base_price: number;
  category_id: string;
  category_name: string;
  product_name?: string;
  description?: string;
  is_active: boolean;
  is_vegetarian?: boolean;
  is_spicy?: boolean;
  is_featured?: boolean;
  prep_time_minutes?: number;
  sort_order?: number;
}

interface ProductEditModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Partial<Product>) => Promise<void>;
  message?: {type: 'success' | 'error', text: string} | null;
}

export function ProductEditModal({ product, isOpen, onClose, onSave, message }: ProductEditModalProps) {
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [loading, setLoading] = useState(false);
  const [localErrors, setLocalErrors] = useState<string[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalData, setOriginalData] = useState<Partial<Product>>({});
  const [validationTouched, setValidationTouched] = useState<Record<string, boolean>>({});

  // Pré-remplir les champs lors de l'ouverture + Détection changements
  useEffect(() => {
    if (product && isOpen) {
      const initialData = {
        sku: product.sku || '',
        base_price: product.base_price || 0,
        category_id: product.category_id || '',
        product_name: product.product_name || '',
        description: product.description || '',
        is_active: product.is_active,
        is_vegetarian: product.is_vegetarian || false,
        is_spicy: product.is_spicy || false,
        is_featured: product.is_featured || false,
        prep_time_minutes: product.prep_time_minutes || 15,
        sort_order: product.sort_order || 0
      };
      
      setFormData(initialData);
      setOriginalData(initialData);
      setLocalErrors([]);
      setHasChanges(false);
      setValidationTouched({});
    }
  }, [product, isOpen]);
  
  // Détecter les changements en temps réel
  useEffect(() => {
    const hasRealChanges = Object.keys(formData).some(
      key => formData[key as keyof Product] !== originalData[key as keyof Product]
    );
    setHasChanges(hasRealChanges);
  }, [formData, originalData]);

  const validateForm = (): boolean => {
    const errors: string[] = [];
    
    // Validation SKU
    if (!formData.sku?.trim()) {
      errors.push('SKU requis');
    } else if (formData.sku.trim().length < 2 || formData.sku.trim().length > 50) {
      errors.push('SKU doit contenir entre 2 et 50 caractères');
    }
    
    // Validation nom produit
    if (!formData.product_name?.trim()) {
      errors.push('Nom du produit requis');
    } else if (formData.product_name.trim().length < 2 || formData.product_name.trim().length > 255) {
      errors.push('Nom du produit doit contenir entre 2 et 255 caractères');
    }
    
    // Validation prix
    if (formData.base_price === undefined || formData.base_price === null) {
      errors.push('Prix requis');
    } else if (formData.base_price < 0 || formData.base_price > 9999.99) {
      errors.push('Prix doit être entre 0 et 9999.99 DHS');
    }
    
    // Validation temps préparation
    if (!formData.prep_time_minutes || formData.prep_time_minutes < 1 || formData.prep_time_minutes > 999) {
      errors.push('Temps de préparation doit être entre 1 et 999 minutes');
    }
    
    // Validation description (optionnelle mais limitée)
    if (formData.description && formData.description.length > 2000) {
      errors.push('Description ne peut pas dépasser 2000 caractères');
    }
    
    // Validation ordre affichage
    if (formData.sort_order !== undefined && (formData.sort_order < 0 || formData.sort_order > 9999)) {
      errors.push('Ordre d\'affichage doit être entre 0 et 9999');
    }
    
    setLocalErrors(errors);
    return errors.length === 0;
  };
  
  const validateField = (fieldName: string, value: any): string | null => {
    switch (fieldName) {
      case 'sku':
        if (!value?.trim()) return 'SKU requis';
        if (value.trim().length < 2 || value.trim().length > 50) return 'Entre 2 et 50 caractères';
        return null;
      case 'product_name':
        if (!value?.trim()) return 'Nom requis';
        if (value.trim().length < 2 || value.trim().length > 255) return 'Entre 2 et 255 caractères';
        return null;
      case 'base_price':
        if (value === undefined || value === null) return 'Prix requis';
        if (value < 0 || value > 9999.99) return 'Entre 0 et 9999.99 DHS';
        return null;
      case 'prep_time_minutes':
        if (!value || value < 1 || value > 999) return 'Entre 1 et 999 minutes';
        return null;
      default:
        return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await onSave(formData);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setValidationTouched(prev => ({ ...prev, [field]: true }));
    
    // Validation en temps réel pour ce champ
    if (localErrors.length > 0) {
      const fieldError = validateField(field, value);
      const otherErrors = localErrors.filter(error => !error.toLowerCase().includes(field.toLowerCase()));
      if (fieldError) {
        setLocalErrors([...otherErrors, fieldError]);
      } else {
        setLocalErrors(otherErrors);
      }
    }
  };
  
  const getFieldError = (fieldName: string): string | null => {
    if (!validationTouched[fieldName]) return null;
    return validateField(fieldName, formData[fieldName as keyof Product]);
  };
  
  const getFieldStyle = (fieldName: string): string => {
    const error = getFieldError(fieldName);
    if (error) {
      return "w-full px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-red-50";
    }
    if (validationTouched[fieldName] && !error) {
      return "w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50";
    }
    return "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-bold">
            Modifier le produit
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={loading}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          {/* Messages */}
          {message && (
            <div className={`p-3 rounded-lg mb-4 flex items-center space-x-2 ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <span className="text-sm font-medium">{message.text}</span>
            </div>
          )}
          
          {localErrors.length > 0 && (
            <div className="p-3 rounded-lg mb-4 bg-red-50 text-red-700 border border-red-200">
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Erreurs de validation :</span>
              </div>
              <ul className="text-sm list-disc list-inside space-y-1">
                {localErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Informations principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SKU *
                  {validationTouched.sku && !getFieldError('sku') && (
                    <span className="text-green-600 text-xs ml-2">✓</span>
                  )}
                </label>
                <input
                  type="text"
                  value={formData.sku || ''}
                  onChange={(e) => handleChange('sku', e.target.value)}
                  onBlur={() => setValidationTouched(prev => ({ ...prev, sku: true }))}
                  className={getFieldStyle('sku')}
                  placeholder="Ex: PROD_001"
                  disabled={loading}
                  required
                />
                {getFieldError('sku') && (
                  <p className="text-red-600 text-xs mt-1">{getFieldError('sku')}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix (DHS) *
                  {validationTouched.base_price && !getFieldError('base_price') && (
                    <span className="text-green-600 text-xs ml-2">✓</span>
                  )}
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="9999.99"
                  value={formData.base_price || ''}
                  onChange={(e) => handleChange('base_price', parseFloat(e.target.value) || 0)}
                  onBlur={() => setValidationTouched(prev => ({ ...prev, base_price: true }))}
                  className={getFieldStyle('base_price')}
                  placeholder="0.00"
                  disabled={loading}
                  required
                />
                {getFieldError('base_price') && (
                  <p className="text-red-600 text-xs mt-1">{getFieldError('base_price')}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom du produit *
                {validationTouched.product_name && !getFieldError('product_name') && (
                  <span className="text-green-600 text-xs ml-2">✓</span>
                )}
                <span className="text-gray-500 text-xs ml-2">({(formData.product_name || '').length}/255)</span>
              </label>
              <input
                type="text"
                value={formData.product_name || ''}
                onChange={(e) => handleChange('product_name', e.target.value)}
                onBlur={() => setValidationTouched(prev => ({ ...prev, product_name: true }))}
                className={getFieldStyle('product_name')}
                placeholder="Nom du produit"
                disabled={loading}
                required
                maxLength={255}
              />
              {getFieldError('product_name') && (
                <p className="text-red-600 text-xs mt-1">{getFieldError('product_name')}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
                <span className="text-gray-500 text-xs ml-2">({(formData.description || '').length}/2000)</span>
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Description détaillée du produit..."
                disabled={loading}
                maxLength={2000}
              />
              {formData.description && formData.description.length > 1900 && (
                <p className="text-amber-600 text-xs mt-1">
                  Attention: {2000 - formData.description.length} caractères restants
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Temps de préparation (minutes) *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.prep_time_minutes || ''}
                  onChange={(e) => handleChange('prep_time_minutes', parseInt(e.target.value) || 15)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="15"
                  disabled={loading}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ordre d'affichage
                </label>
                <input
                  type="number"
                  value={formData.sort_order || ''}
                  onChange={(e) => handleChange('sort_order', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Options booléennes */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">Options</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active || false}
                    onChange={(e) => handleChange('is_active', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    disabled={loading}
                  />
                  <span className="text-sm text-gray-700">Actif</span>
                </label>
                
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_vegetarian || false}
                    onChange={(e) => handleChange('is_vegetarian', e.target.checked)}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    disabled={loading}
                  />
                  <span className="text-sm text-gray-700">🌱 Végétarien</span>
                </label>
                
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_spicy || false}
                    onChange={(e) => handleChange('is_spicy', e.target.checked)}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    disabled={loading}
                  />
                  <span className="text-sm text-gray-700">🌶️ Épicé</span>
                </label>
                
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_featured || false}
                    onChange={(e) => handleChange('is_featured', e.target.checked)}
                    className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                    disabled={loading}
                  />
                  <span className="text-sm text-gray-700">⭐ Vedette</span>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-4 border-t">
              <div className="flex items-center space-x-2">
                {hasChanges && (
                  <div className="flex items-center space-x-1 text-amber-600">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span className="text-xs">Modifications non sauvées</span>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={loading}
                >
                  {hasChanges ? 'Annuler les modifications' : 'Fermer'}
                </Button>
                <Button
                  type="submit"
                  disabled={loading || !hasChanges}
                  className="min-w-[120px]"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sauvegarde...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Save className="h-4 w-4" />
                      <span>{hasChanges ? 'Sauvegarder les modifications' : 'Aucune modification'}</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
