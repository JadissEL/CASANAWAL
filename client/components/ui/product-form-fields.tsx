// =====================================================
// PRODUCT FORM FIELD COMPONENTS (≤150 lines)
// =====================================================

import React from "react";
import { FieldProps } from "./product-modal-types";

export const FormField: React.FC<FieldProps> = ({
  label,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  placeholder,
  type = "text",
  min,
  max,
  step
}) => {
  const fieldId = `field-${label.toLowerCase().replace(/\s+/g, '-')}`;

  if (type === 'checkbox') {
    return (
      <div className="flex items-center space-x-2">
        <input
          id={fieldId}
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor={fieldId} className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {error && (
          <span className="text-red-500 text-xs">{error}</span>
        )}
      </div>
    );
  }

  if (type === 'textarea') {
    return (
      <div className="space-y-1">
        <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <textarea
          id={fieldId}
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          rows={3}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
            error ? 'border-red-300' : 'border-gray-300'
          }`}
        />
        {error && (
          <span className="text-red-500 text-xs">{error}</span>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={fieldId}
        type={type}
        value={String(value)}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
          error ? 'border-red-300' : 'border-gray-300'
        }`}
      />
      {error && (
        <span className="text-red-500 text-xs">{error}</span>
      )}
    </div>
  );
};

export const PriceField: React.FC<Omit<FieldProps, 'type'>> = (props) => (
  <FormField {...props} type="number" step={0.01} min={0} max={9999.99} />
);

export const TimeField: React.FC<Omit<FieldProps, 'type'>> = (props) => (
  <FormField {...props} type="number" min={1} max={999} step={1} />
);

export const TextAreaField: React.FC<Omit<FieldProps, 'type'>> = (props) => (
  <FormField {...props} type="textarea" />
);

export const CheckboxField: React.FC<Omit<FieldProps, 'type'>> = (props) => (
  <FormField {...props} type="checkbox" />
);

export const SKUField: React.FC<Omit<FieldProps, 'type'>> = (props) => (
  <FormField {...props} type="text" placeholder="Ex: PIZZA_MARGHERITA" />
);

export const ProductNameField: React.FC<Omit<FieldProps, 'type'>> = (props) => (
  <FormField {...props} type="text" placeholder="Nom du produit" />
);

export const SortOrderField: React.FC<Omit<FieldProps, 'type'>> = (props) => (
  <FormField {...props} type="number" min={0} max={9999} step={1} placeholder="0" />
);
