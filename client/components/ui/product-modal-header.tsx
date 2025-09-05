// =====================================================
// PRODUCT MODAL HEADER & STATUS (≤150 lines)
// =====================================================

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  X, 
  Save, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Shield, 
  Activity, 
  Zap 
} from "lucide-react";
import { StatusIndicatorProps, EnterpriseMessage } from "./product-modal-types";
import { StatusIndicator } from "./product-status-indicator";
export { StatusIndicator } from "./product-status-indicator";

export const EnterpriseMetrics: React.FC<{
  renderCount: number;
  validationTime: number;
  securityScore: number;
}> = ({ renderCount, validationTime, securityScore }) => (
  <div className="flex space-x-2 text-xs text-gray-500">
    <Badge variant="outline" className="text-xs">
      <Activity className="w-3 h-3 mr-1" />
      Renders: {renderCount}
    </Badge>
    <Badge variant="outline" className="text-xs">
      <Zap className="w-3 h-3 mr-1" />
      Validation: {validationTime}ms
    </Badge>
    <Badge variant="outline" className="text-xs">
      <Shield className="w-3 h-3 mr-1" />
      Sécurité: {securityScore}%
    </Badge>
  </div>
);

export const ModalHeader: React.FC<{
  title: string;
  onClose: () => void;
  status: StatusIndicatorProps['status'];
  message?: string;
  renderCount: number;
  validationTime: number;
  securityScore: number;
}> = ({ 
  title, 
  onClose, 
  status, 
  message, 
  renderCount, 
  validationTime, 
  securityScore 
}) => (
  <div className="flex justify-between items-start p-6 border-b">
    <div className="space-y-2">
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      <div className="flex items-center space-x-2">
        <StatusIndicator status={status} message={message} />
        <EnterpriseMetrics 
          renderCount={renderCount}
          validationTime={validationTime}
          securityScore={securityScore}
        />
      </div>
    </div>
    <Button
      variant="ghost"
      size="sm"
      onClick={onClose}
      className="text-gray-400 hover:text-gray-600"
    >
      <X className="h-4 w-4" />
    </Button>
  </div>
);

export const MessageAlert: React.FC<{ message: EnterpriseMessage }> = ({ message }) => {
  const getAlertStyles = () => {
    switch (message.type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className={`p-4 border rounded-md ${getAlertStyles()}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          {message.type === 'success' && <CheckCircle className="h-5 w-5" />}
          {message.type === 'error' && <AlertCircle className="h-5 w-5" />}
          {message.type === 'warning' && <AlertCircle className="h-5 w-5" />}
          {message.type === 'info' && <Activity className="h-5 w-5" />}
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium">{message.text}</p>
          {message.details && (
            <p className="mt-1 text-sm opacity-75">{message.details}</p>
          )}
          {message.requestId && (
            <p className="mt-1 text-xs opacity-50">ID: {message.requestId}</p>
          )}
        </div>
      </div>
    </div>
  );
};
