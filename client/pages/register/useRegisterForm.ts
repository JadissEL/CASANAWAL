import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RegisterSchema } from "@/lib/schemas";
import { z } from "zod";

export const useRegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    try {
      RegisterSchema.parse(formData);
      setError('');
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0].message;
        setError(firstError);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulation API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success - redirect to login
      navigate("/login", { 
        state: { message: "Compte créé avec succès ! Connectez-vous." }
      });
    } catch (error) {
      setError("Erreur lors de la création du compte");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    error,
    handleInputChange,
    handleSubmit
  };
};
