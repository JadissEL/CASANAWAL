import { useState, useCallback, useMemo } from 'react';
import type { FieldValidation } from './types';
import { validateField, validateForm } from './core';

// Form validation hooks
export function useFormValidation<T extends Record<string, any>>(
  initialData: T,
  validationSchema: FieldValidation
) {
  const [data, setData] = useState<T>(initialData);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = useCallback(() => {
    const validationResults = validateForm(data, validationSchema);
    const newErrors: Record<string, string[]> = {};

    Object.entries(validationResults).forEach(([field, result]) => {
      if (!result.isValid) {
        newErrors[field] = result.errors;
      }
    });

    setErrors(newErrors);
    return validationResults;
  }, [data, validationSchema]);

  const handleChange = useCallback((field: keyof T, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));

    // Validate field on change if it has been touched
    if (touched[field as string]) {
      const fieldRules = validationSchema[field as string];
      if (fieldRules) {
        const result = validateField(value, fieldRules);
        setErrors(prev => ({
          ...prev,
          [field]: result.errors,
        }));
      }
    }
  }, [touched, validationSchema]);

  const handleBlur = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }));

    const fieldRules = validationSchema[field as string];
    if (fieldRules) {
      const value = data[field];
      const result = validateField(value, fieldRules);
      setErrors(prev => ({
        ...prev,
        [field]: result.errors,
      }));
    }
  }, [data, validationSchema]);

  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  return {
    data,
    errors,
    touched,
    isValid,
    setData,
    handleChange,
    handleBlur,
    validate,
  };
}
