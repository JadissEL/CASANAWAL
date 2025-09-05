import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, Camera } from "lucide-react";
import { usePaymentUpload } from "./usePaymentUpload";

export const PaymentUploadForm = () => {
  const {
    fileInputRef,
    receiptPreview,
    receiptFile,
    notes,
    isUploading,
    handleFileSelect,
    handleUpload,
    setNotes
  } = usePaymentUpload();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Télécharger le reçu
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-terracotta transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*,.pdf"
            className="hidden"
          />
          
          {receiptPreview ? (
            <div className="space-y-4">
              <img
                src={receiptPreview}
                alt="Aperçu du reçu"
                className="max-h-48 mx-auto rounded"
              />
              <p className="text-sm text-gray-600">
                Cliquez pour changer l"image
              </p>
            </div>
          ) : receiptFile ? (
            <div className="space-y-4">
              <FileText className="h-12 w-12 mx-auto text-gray-400" />
              <div>
                <p className="font-medium">{receiptFile.name}</p>
                <p className="text-sm text-gray-600">
                  {(receiptFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Camera className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <span className="text-sm text-gray-600">
                "Choisir une image"
              </span>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Notes (optionnel)
          </label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ajoutez des détails ou commentaires..."
            rows={3}
          />
        </div>

        <Button
          onClick={handleUpload}
          disabled={!receiptFile || isUploading}
          className="w-full"
        >
          {isUploading ? "Envoi en cours..." : "Envoyer le reçu"}
        </Button>
      </CardContent>
    </Card>
  );
};
