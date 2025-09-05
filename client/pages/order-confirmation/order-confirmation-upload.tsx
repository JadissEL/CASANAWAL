import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProofUploadProps } from "./order-confirmation-types";
import { itemVariants } from "./order-confirmation-animations";

export const OrderConfirmationUpload = ({ proofFile, onFileUpload }: ProofUploadProps) => (
  <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-soft border border-sable-200">
    <h3 className={cn(
      "font-display text-lg font-bold text-nuit-900 mb-4 flex items-center gap-2"
    )}>
      <Upload className="h-5 w-5 text-terracotta" />
      {"Preuve de paiement"}
    </h3>
    
    <div className="space-y-4">
      <p className={cn(
        "text-nuit-600"
      )}>
        {"Téléversez une photo ou un PDF du reçu de paiement"}
      </p>

      <div className="border-2 border-dashed border-sable-300 rounded-lg p-6 text-center">
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={onFileUpload}
          className="hidden"
          id="proof-upload"
        />
        <label htmlFor="proof-upload" className="cursor-pointer">
          <Upload className="h-8 w-8 text-nuit-400 mx-auto mb-2" />
          <p className={cn(
            "text-nuit-600 mb-1"
          )}>
            {"Choisir un fichier ou le glisser ici"}
          </p>
          <p className="text-sm text-nuit-400">
            {"PNG, JPG, PDF (max 5MB)"}
          </p>
        </label>

        {proofFile && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className={cn(
              "text-green-700 font-medium"
            )}>
              {"Fichier téléversé :"} {proofFile.name}
            </p>
          </div>
        )}
      </div>
    </div>
  </motion.div>
);
