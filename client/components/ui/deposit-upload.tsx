import { useState, useRef } from "react";
import { Button } from "./button";
import { Upload, FileText, CheckCircle, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DepositUploadProps {
  orderId: string;
  depositAmount: number;
  onUploadComplete?: (orderId: string, file: File) => Promise<void>;
  className?: string;
}

export const DepositUpload = ({
  orderId,
  depositAmount,
  onUploadComplete,
  className
}: DepositUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const bankInfo = {
    bank: "{{BANK_ACCOUNT_TEXT_FR}}",
    account: "RIB: 123 456 789 012 345 678 90",
    reference: `Commande: ${orderId}`,
    instructions: `Effectuez un virement de ${depositAmount} MAD avec la référence ci-dessus et téléchargez votre reçu.`
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Type de fichier non supporté');
      return;
    }

    // Validate file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('Fichier trop volumineux (max 5MB)');
      return;
    }

    setFile(selectedFile);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file || !onUploadComplete) return;

    setUploading(true);
    setError(null);

    try {
      await onUploadComplete(orderId, file);
      setUploaded(true);
    } catch (err) {
      setError('Échec du téléchargement');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  if (uploaded) {
    return (
      <div className={cn(
        "rounded-2xl border-2 border-green-200 bg-green-50 p-6",
        className
      )}>
        <div className="flex items-center gap-3 text-green-800">
          <CheckCircle className="h-6 w-6" />
          <div>
            <h3 className="font-semibold">
              Reçu téléchargé avec succès
            </h3>
            <p className="text-sm text-green-600">
              Votre dépôt sera vérifié sous 4h ouvrables
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Bank Information */}
      <div className="rounded-2xl border border-sable-300 bg-sable-50 p-6">
        <h3 className={cn(
          "font-display text-lg font-semibold text-nuit-900 mb-4 text-left"
        )}>
          Informations Bancaires
        </h3>
        
        <div className="space-y-3">
          <div>
            <p className="text-sm text-nuit-600 mb-1">
              Banque:
            </p>
            <p className="font-medium text-nuit-900">{bankInfo.bank}</p>
          </div>
          
          <div>
            <p className="text-sm text-nuit-600 mb-1">
              Compte:
            </p>
            <p className="font-mono text-nuit-900">{bankInfo.account}</p>
          </div>
          
          <div>
            <p className="text-sm text-nuit-600 mb-1">
              Référence:
            </p>
            <p className="font-mono font-semibold text-terracotta">{bankInfo.reference}</p>
          </div>
          
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <p className="text-sm text-yellow-800 text-left">
              {bankInfo.instructions}
            </p>
          </div>
        </div>
      </div>

      {/* File Upload */}
      <div className="rounded-2xl border border-sable-300 bg-white p-6">
        <h3 className={cn(
          "font-display text-lg font-semibold text-nuit-900 mb-4 text-left"
        )}>
          Télécharger le Reçu
        </h3>

        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,.pdf"
          onChange={handleFileSelect}
          className="hidden"
        />

        {!file ? (
          <div
            onClick={openFileDialog}
            className="border-2 border-dashed border-sable-300 rounded-xl p-8 text-center hover:border-terracotta hover:bg-sable-50 transition-colors cursor-pointer"
          >
            <Upload className="h-12 w-12 text-sable-400 mx-auto mb-4" />
            <p className="text-nuit-700 font-medium mb-2">
              Cliquez pour sélectionner
            </p>
            <p className="text-sm text-nuit-500">
              JPG, PNG, WebP ou PDF (max 5MB)
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-4 p-4 bg-sable-50 rounded-xl">
            <FileText className="h-8 w-8 text-terracotta" />
            <div className="flex-1">
              <p className="font-medium text-nuit-900">{file.name}</p>
              <p className="text-sm text-nuit-500">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={removeFile}
              className="text-nuit-500 hover:text-red-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {file && !error && (
          <Button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full mt-4 bg-terracotta hover:bg-terracotta-600 text-white py-3 rounded-xl"
          >
            {uploading ? 'Chargement...' : 'Télécharger le Reçu'}
          </Button>
        )}
      </div>
    </div>
  );
};
