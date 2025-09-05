// ITÉRATION 3: Modal Enterprise - UX + Monitoring + Sécurité client (FIXÉ)
import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Save, AlertCircle, CheckCircle, Clock, Shield, Activity, Zap } from "lucide-react";

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

interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

interface EnterpriseMessage {
  type: 'success' | 'error' | 'warning' | 'info';
  text: string;
  details?: string;
  duration?: number;
  requestId?: string;
}

interface ProductEditModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Partial<Product>) => Promise<void>;
  message?: EnterpriseMessage | null;
}

// Types pour les règles de validation
interface StringValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  transform?: (v: string) => string;
}

interface NumberValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  integer?: boolean;
  step?: number;
}

type ValidationRule = StringValidationRule | NumberValidationRule;

// Règles de validation simplifiées (regex fixées)
const VALIDATION_RULES: Record<string, ValidationRule> = {
  sku: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[A-Z0-9_-]+$/i,
    transform: (v: string) => v.trim().toUpperCase()
  },
  product_name: {
    required: true,
    minLength: 2,
    maxLength: 255,
    // Pattern simplifié pour éviter les problèmes d'échappement
    pattern: /^[a-zA-Z0-9\s\u00C0-\u017F\u0600-\u06FF\-'.,!?]+$/u
  },
  base_price: {
    required: true,
    min: 0,
    max: 9999.99,
    step: 0.01
  },
  prep_time_minutes: {
    required: true,
    min: 1,
    max: 999,
    integer: true
  },
  description: {
    maxLength: 2000
  },
  sort_order: {
    min: 0,
    max: 9999,
    integer: true
  }
};

export function ProductEditModal({ product, isOpen, onClose, onSave, message }: ProductEditModalProps) {
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [originalData, setOriginalData] = useState<Partial<Product>>({});
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [fieldTouched, setFieldTouched] = useState<Record<string, boolean>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    validationTime: 0,
    renderTime: 0,
    lastSaveTime: 0
  });
  
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();
  const validationTimeoutRef = useRef<NodeJS.Timeout>();
  const performanceStartRef = useRef<number>(0);

  // Monitoring de performance
  useEffect(() => {
    performanceStartRef.current = performance.now();
    return () => {
      const renderTime = performance.now() - performanceStartRef.current;
      setPerformanceMetrics(prev => ({ ...prev, renderTime }));
    };
  }, []);

  // Initialisation sécurisée des données
  useEffect(() => {
    if (product && isOpen) {
      const initialData = {
        sku: product.sku || '',
        base_price: product.base_price || 0,
        category_id: product.category_id || '',
        product_name: product.product_name || '',
        description: product.description || '',
        is_active: product.is_active !== undefined ? product.is_active : true,
        is_vegetarian: product.is_vegetarian || false,
        is_spicy: product.is_spicy || false,
        is_featured: product.is_featured || false,
        prep_time_minutes: product.prep_time_minutes || 15,
        sort_order: product.sort_order || 0
      };
      
      setFormData(initialData);
      setOriginalData(initialData);
      setValidationErrors([]);
      setFieldTouched({});
      setHasChanges(false);
    }
  }, [product, isOpen]);

  // Détection des changements en temps réel
  useEffect(() => {
    const changes = Object.keys(formData).some(
      key => {
        const current = formData[key as keyof Product];
        const original = originalData[key as keyof Product];
        return current !== original;
      }
    );
    setHasChanges(changes);

    // Auto-save si activé
    if (changes && autoSaveEnabled && !loading) {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      autoSaveTimeoutRef.current = setTimeout(() => {
        handleSave(true); // Auto-save silencieux
      }, 3000);
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [formData, originalData, autoSaveEnabled, loading]);

  // Validation enterprise en temps réel
  const validateField = useCallback((fieldName: string, value: any): ValidationError[] => {
    const startTime = performance.now();
    const errors: ValidationError[] = [];
    const rule = VALIDATION_RULES[fieldName as keyof typeof VALIDATION_RULES];
    
    if (!rule) return errors;

    // Validation requise
    if ('required' in rule && rule.required && (!value || (typeof value === 'string' && !value.trim()))) {
      errors.push({
        field: fieldName,
        message: `${fieldName} est requis`,
        severity: 'error'
      });
      return errors;
    }

    if (value !== undefined && value !== null && value !== '') {
      // Validation longueur pour les chaînes
      if (typeof value === 'string') {
        if ('minLength' in rule && rule.minLength !== undefined && value.trim().length < rule.minLength) {
          errors.push({
            field: fieldName,
            message: `Minimum ${rule.minLength} caractères`,
            severity: 'error'
          });
        }
        if ('maxLength' in rule && rule.maxLength !== undefined && value.length > rule.maxLength) {
          errors.push({
            field: fieldName,
            message: `Maximum ${rule.maxLength} caractères`,
            severity: 'error'
          });
        }
        if ('pattern' in rule && rule.pattern && !rule.pattern.test(value)) {
          errors.push({
            field: fieldName,
            message: 'Format invalide',
            severity: 'error'
          });
        }
      }

      // Validation numérique
      if (typeof value === 'number') {
        if ('min' in rule && rule.min !== undefined && value < rule.min) {
          errors.push({
            field: fieldName,
            message: `Minimum ${rule.min}`,
            severity: 'error'
          });
        }
        if ('max' in rule && rule.max !== undefined && value > rule.max) {
          errors.push({
            field: fieldName,
            message: `Maximum ${rule.max}`,
            severity: 'error'
          });
        }
        if ('integer' in rule && rule.integer && !Number.isInteger(value)) {
          errors.push({
            field: fieldName,
            message: 'Doit être un nombre entier',
            severity: 'error'
          });
        }
      }
    }

    const validationTime = performance.now() - startTime;
    setPerformanceMetrics(prev => ({ ...prev, validationTime }));
    
    return errors;
  }, []);

  // Validation globale du formulaire
  const validateForm = useCallback((): boolean => {
    const allErrors: ValidationError[] = [];
    
    Object.keys(VALIDATION_RULES).forEach(fieldName => {
      const fieldErrors = validateField(fieldName, formData[fieldName as keyof Product]);
      allErrors.push(...fieldErrors);
    });

    setValidationErrors(allErrors);
    return allErrors.filter(e => e.severity === 'error').length === 0;
  }, [formData, validateField]);

  // Gestion des changements avec validation
  const handleChange = useCallback((field: string, value: any) => {
    const rule = VALIDATION_RULES[field as keyof typeof VALIDATION_RULES];
    let processedValue = value;

    // Transformation automatique
    if (rule && 'transform' in rule && rule.transform && typeof value === 'string') {
      processedValue = rule.transform(value);
    }

    setFormData(prev => ({ ...prev, [field]: processedValue }));
    setFieldTouched(prev => ({ ...prev, [field]: true }));

    // Validation différée pour éviter la sur-validation
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }
    validationTimeoutRef.current = setTimeout(() => {
      const fieldErrors = validateField(field, processedValue);
      setValidationErrors(prev => [
        ...prev.filter(e => e.field !== field),
        ...fieldErrors
      ]);
    }, 300);
  }, [validateField]);

  // Sauvegarde avec monitoring
  const handleSave = async (isAutoSave = false) => {
    const saveStartTime = performance.now();
    
    if (!validateForm()) {
      if (!isAutoSave) {
        // Marquer tous les champs comme touchés pour afficher les erreurs
        const allFields = Object.keys(VALIDATION_RULES);
        setFieldTouched(Object.fromEntries(allFields.map(f => [f, true])));
      }
      return;
    }

    setLoading(true);
    try {
      // Préparation des données optimisée (uniquement les changements)
      const changedData: Partial<Product> = {};
      Object.keys(formData).forEach(key => {
        const current = formData[key as keyof Product];
        const original = originalData[key as keyof Product];
        if (current !== original) {
          (changedData as any)[key] = current;
        }
      });

      await onSave(changedData);
      
      const saveTime = performance.now() - saveStartTime;
      setPerformanceMetrics(prev => ({ ...prev, lastSaveTime: saveTime }));
      
      if (!isAutoSave) {
        // Mettre à jour les données originales après succès
        setOriginalData({ ...formData });
        setHasChanges(false);
      }
    } finally {
      setLoading(false);
    }
  };

  // Récupération des erreurs par champ
  const getFieldErrors = useCallback((fieldName: string): ValidationError[] => {
    return validationErrors.filter(e => e.field === fieldName);
  }, [validationErrors]);

  // Style dynamique par champ
  const getFieldStyle = useCallback((fieldName: string): string => {
    const errors = getFieldErrors(fieldName);
    const hasError = errors.some(e => e.severity === 'error');
    const hasWarning = errors.some(e => e.severity === 'warning');
    const isTouched = fieldTouched[fieldName];
    
    let baseStyle = "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200";
    
    if (hasError && isTouched) {
      return `${baseStyle} border-red-300 focus:ring-red-500 bg-red-50`;
    }
    if (hasWarning && isTouched) {
      return `${baseStyle} border-yellow-300 focus:ring-yellow-500 bg-yellow-50`;
    }
    if (isTouched && !hasError && !hasWarning) {
      return `${baseStyle} border-green-300 focus:ring-green-500 bg-green-50`;
    }
    return `${baseStyle} border-gray-300 focus:ring-blue-500`;
  }, [getFieldErrors, fieldTouched]);

  if (!isOpen || !product) return null;

  const errorCount = validationErrors.filter(e => e.severity === 'error').length;
  const warningCount = validationErrors.filter(e => e.severity === 'warning').length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[95vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
          <div className="flex items-center space-x-4">
            <CardTitle className="text-xl font-bold">
              Édition Enterprise - Produit
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                <Shield className="h-3 w-3 mr-1" />
                Sécurisé
              </Badge>
              {hasChanges && (
                <Badge variant="outline" className="text-xs text-amber-600">
                  <Activity className="h-3 w-3 mr-1" />
                  Modifié
                </Badge>
              )}
              {autoSaveEnabled && (
                <Badge variant="outline" className="text-xs text-blue-600">
                  <Zap className="h-3 w-3 mr-1" />
                  Auto-save
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAutoSaveEnabled(!autoSaveEnabled)}
              title="Toggle auto-save"
            >
              <Zap className={`h-4 w-4 ${autoSaveEnabled ? 'text-blue-600' : 'text-gray-400'}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={loading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="overflow-y-auto max-h-[calc(95vh-200px)] p-6">
          {/* Enterprise Status Bar */}
          <div className="mb-6 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>Validation: {performanceMetrics.validationTime.toFixed(1)}ms</span>
                </span>
                {errorCount > 0 && (
                  <span className="flex items-center space-x-1 text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errorCount} erreur(s)</span>
                  </span>
                )}
                {warningCount > 0 && (
                  <span className="flex items-center space-x-1 text-yellow-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>{warningCount} avertissement(s)</span>
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500">
                ID: {product.id.substring(0, 8)}...
              </div>
            </div>
          </div>

          {/* Messages Enterprise */}
          {message && (
            <div className={`p-4 rounded-lg mb-6 border ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 border-green-200' 
                : message.type === 'error'
                ? 'bg-red-50 text-red-700 border-red-200'
                : message.type === 'warning'
                ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                : 'bg-blue-50 text-blue-700 border-blue-200'
            }`}>
              <div className="flex items-start space-x-3">
                {message.type === 'success' ? (
                  <CheckCircle className="h-5 w-5 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="font-medium">{message.text}</p>
                  {message.details && (
                    <p className="text-sm mt-1 opacity-80">{message.details}</p>
                  )}
                  {message.requestId && (
                    <p className="text-xs mt-2 font-mono opacity-60">ID: {message.requestId}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
            {/* Informations principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU * 
                  {fieldTouched.sku && getFieldErrors('sku').length === 0 && (
                    <CheckCircle className="inline h-4 w-4 text-green-600 ml-2" />
                  )}
                  <span className="text-gray-500 text-xs ml-2">({(formData.sku || '').length}/50)</span>
                </label>
                <input
                  type="text"
                  value={formData.sku || ''}
                  onChange={(e) => handleChange('sku', e.target.value)}
                  onBlur={() => setFieldTouched(prev => ({ ...prev, sku: true }))}
                  className={getFieldStyle('sku')}
                  placeholder="Ex: PROD_001"
                  disabled={loading}
                  maxLength={50}
                />
                {getFieldErrors('sku').map((error, idx) => (
                  <p key={idx} className={`text-xs mt-1 ${
                    error.severity === 'error' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {error.message}
                  </p>
                ))}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix (DHS) *
                  {fieldTouched.base_price && getFieldErrors('base_price').length === 0 && (
                    <CheckCircle className="inline h-4 w-4 text-green-600 ml-2" />
                  )}
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="9999.99"
                  value={formData.base_price || ''}
                  onChange={(e) => handleChange('base_price', parseFloat(e.target.value) || 0)}
                  onBlur={() => setFieldTouched(prev => ({ ...prev, base_price: true }))}
                  className={getFieldStyle('base_price')}
                  placeholder="0.00"
                  disabled={loading}
                />
                {getFieldErrors('base_price').map((error, idx) => (
                  <p key={idx} className={`text-xs mt-1 ${
                    error.severity === 'error' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {error.message}
                  </p>
                ))}
              </div>
            </div>

            {/* Nom et description */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du produit *
                  {fieldTouched.product_name && getFieldErrors('product_name').length === 0 && (
                    <CheckCircle className="inline h-4 w-4 text-green-600 ml-2" />
                  )}
                  <span className="text-gray-500 text-xs ml-2">({(formData.product_name || '').length}/255)</span>
                </label>
                <input
                  type="text"
                  value={formData.product_name || ''}
                  onChange={(e) => handleChange('product_name', e.target.value)}
                  onBlur={() => setFieldTouched(prev => ({ ...prev, product_name: true }))}
                  className={getFieldStyle('product_name')}
                  placeholder="Nom du produit"
                  disabled={loading}
                  maxLength={255}
                />
                {getFieldErrors('product_name').map((error, idx) => (
                  <p key={idx} className={`text-xs mt-1 ${
                    error.severity === 'error' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {error.message}
                  </p>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                  <span className="text-gray-500 text-xs ml-2">({(formData.description || '').length}/2000)</span>
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={4}
                  className={getFieldStyle('description')}
                  placeholder="Description détaillée du produit..."
                  disabled={loading}
                  maxLength={2000}
                />
                {formData.description && formData.description.length > 1800 && (
                  <p className="text-amber-600 text-xs mt-1">
                    Attention: {2000 - formData.description.length} caractères restants
                  </p>
                )}
              </div>
            </div>

            {/* Temps et ordre */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temps de préparation (minutes) *
                  {fieldTouched.prep_time_minutes && getFieldErrors('prep_time_minutes').length === 0 && (
                    <CheckCircle className="inline h-4 w-4 text-green-600 ml-2" />
                  )}
                </label>
                <input
                  type="number"
                  min="1"
                  max="999"
                  value={formData.prep_time_minutes || ''}
                  onChange={(e) => handleChange('prep_time_minutes', parseInt(e.target.value) || 1)}
                  onBlur={() => setFieldTouched(prev => ({ ...prev, prep_time_minutes: true }))}
                  className={getFieldStyle('prep_time_minutes')}
                  placeholder="15"
                  disabled={loading}
                />
                {getFieldErrors('prep_time_minutes').map((error, idx) => (
                  <p key={idx} className={`text-xs mt-1 ${
                    error.severity === 'error' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {error.message}
                  </p>
                ))}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ordre d'affichage
                  {fieldTouched.sort_order && getFieldErrors('sort_order').length === 0 && (
                    <CheckCircle className="inline h-4 w-4 text-green-600 ml-2" />
                  )}
                </label>
                <input
                  type="number"
                  min="0"
                  max="9999"
                  value={formData.sort_order || ''}
                  onChange={(e) => handleChange('sort_order', parseInt(e.target.value) || 0)}
                  onBlur={() => setFieldTouched(prev => ({ ...prev, sort_order: true }))}
                  className={getFieldStyle('sort_order')}
                  placeholder="0"
                  disabled={loading}
                />
                {getFieldErrors('sort_order').map((error, idx) => (
                  <p key={idx} className={`text-xs mt-1 ${
                    error.severity === 'error' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {error.message}
                  </p>
                ))}
              </div>
            </div>

            {/* Options booléennes */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">Options du produit</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { key: 'is_active', label: 'Actif', icon: '✓', color: 'blue' },
                  { key: 'is_vegetarian', label: 'Végétarien', icon: '🌱', color: 'green' },
                  { key: 'is_spicy', label: 'Épicé', icon: '🌶️', color: 'red' },
                  { key: 'is_featured', label: 'Vedette', icon: '⭐', color: 'yellow' }
                ].map(({ key, label, icon }) => (
                  <label key={key} className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData[key as keyof Product] as boolean || false}
                      onChange={(e) => handleChange(key, e.target.checked)}
                      className="w-4 h-4 border-gray-300 rounded focus:ring-blue-500"
                      disabled={loading}
                    />
                    <span className="text-sm text-gray-700 flex items-center space-x-1">
                      <span>{icon}</span>
                      <span>{label}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </form>
        </CardContent>

        {/* Actions Enterprise */}
        <div className="border-t p-6 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              {hasChanges && (
                <div className="flex items-center space-x-2 text-amber-600">
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">
                    {Object.keys(formData).filter(k => 
                      formData[k as keyof Product] !== originalData[k as keyof Product]
                    ).length} modification(s) en attente
                  </span>
                </div>
              )}
              {performanceMetrics.lastSaveTime > 0 && (
                <span className="text-xs text-gray-500">
                  Dernière sauvegarde: {performanceMetrics.lastSaveTime.toFixed(0)}ms
                </span>
              )}
            </div>
            
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className="min-w-[100px]"
              >
                {hasChanges ? 'Annuler' : 'Fermer'}
              </Button>
              <Button
                onClick={() => handleSave()}
                disabled={loading || !hasChanges || errorCount > 0}
                className="min-w-[140px] bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sauvegarde...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Save className="h-4 w-4" />
                    <span>
                      {!hasChanges ? 'Aucune modification' : 
                       errorCount > 0 ? 'Corriger les erreurs' : 
                       'Sauvegarder Enterprise'}
                    </span>
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
