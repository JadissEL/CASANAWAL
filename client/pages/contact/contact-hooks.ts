import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";
import { ContactSchema } from "@/lib/schemas";

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  inquiryType: string;
  eventDate?: string;
  guestCount?: string;
  message: string;
}

export const useContactForm = () => {
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    inquiryType: "",
    eventDate: "",
    guestCount: "",
    message: ""
  });
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});

  useEffect(() => {
    const type = searchParams.get("type");
    if (type === "bulk") {
      setFormData(prev => ({ ...prev, inquiryType: "bulk" }));
    }
  }, [searchParams]);

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validateForm = (): boolean => {
    try {
      ContactSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = error.formErrors.fieldErrors;
        setErrors(Object.fromEntries(Object.entries(newErrors).map(([k, v]) => [k, v?.[0]])));
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("Form submitted:", formData);
      setIsSubmitted(true);
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          inquiryType: "",
          eventDate: "",
          guestCount: "",
          message: ""
        });
        setIsSubmitted(false);
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { formData, errors, isSubmitting, isSubmitted, handleInputChange, handleSubmit };
};


