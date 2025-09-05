import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const usePaymentAccess = () => {
  const navigate = useNavigate();
  const [orderRef, setOrderRef] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const validateOrderReference = (ref: string): boolean => {
    // NAW-YYYYMMDD-XXXXX format
    const pattern = /^NAW-\d{8}-[A-Z0-9]{5}$/;
    return pattern.test(ref);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedRef = orderRef.trim().toUpperCase();

    if (!trimmedRef) {
      setError("Veuillez entrer le numéro de référence");
      return;
    }

    if (!validateOrderReference(trimmedRef)) {
      setError("Format de référence invalide. Format attendu: NAW-YYYYMMDD-XXXXX");
      return;
    }

    setIsLoading(true);

    try {
      // Vérifier l'existence de la commande
      const response = await fetch(`/api/orders/${trimmedRef}`);
      const data = await response.json();

      if (response.ok && data.success) {
        // Rediriger vers la page de téléchargement de preuve de paiement
        navigate(`/payment-upload/${trimmedRef}`);
      } else {
        setError("Numéro de référence introuvable. Vérifiez et réessayez.");
      }
    } catch (error) {
      setError("Erreur de connexion. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
    setOrderRef(value);
    if (error) setError("");
  };

  return {
    orderRef,
    isLoading,
    error,
    handleSubmit,
    handleInputChange
  };
};
