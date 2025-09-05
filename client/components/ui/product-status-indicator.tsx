// =====================================================
// PRODUCT STATUS INDICATOR COMPONENT (≤150 lines)
// =====================================================

import React from "react";
import { 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Activity,
  Save
} from "lucide-react";
import { StatusIndicatorProps } from "./product-modal-types";

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  message,
  details
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'validating':
        return {
          icon: Clock,
          color: 'bg-yellow-100 text-yellow-800',
          text: 'Validation en cours...'
        };
      case 'valid':
        return {
          icon: CheckCircle,
          color: 'bg-green-100 text-green-800',
          text: 'Données valides'
        };
      case 'invalid':
        return {
          icon: AlertCircle,
          color: 'bg-red-100 text-red-800',
          text: 'Erreurs détectées'
        };
      case 'saving':
        return {
          icon: Save,
          color: 'bg-blue-100 text-blue-800',
          text: 'Sauvegarde...'
        };
      case 'saved':
        return {
          icon: CheckCircle,
          color: 'bg-green-100 text-green-800',
          text: 'Sauvegardé'
        };
      case 'error':
        return {
          icon: AlertCircle,
          color: 'bg-red-100 text-red-800',
          text: 'Erreur'
        };
      default:
        return {
          icon: Activity,
          color: 'bg-gray-100 text-gray-800',
          text: 'En attente'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      <Icon className="w-3 h-3 mr-1" />
      {message || config.text}
      {details && (
        <span className="ml-1 opacity-75">({details})</span>
      )}
    </div>
  );
};
