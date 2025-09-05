import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export interface OrderDetails {
  id: string;
  reference: string;
  total: number;
  status: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  createdAt: string;
  requiredDeposit: number;
}

export const usePaymentUpload = () => {
  const { orderRef } = useParams<{ orderRef: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error("Le fichier ne doit pas dépasser 10MB");
        return;
      }
      
      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Format de fichier non supporté. Utilisez JPG, PNG, WEBP ou PDF");
        return;
      }
      
      setReceiptFile(file);
      
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setReceiptPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setReceiptPreview(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!receiptFile) {
      toast.error("Veuillez sélectionner un fichier");
      return;
    }
    
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("receipt", receiptFile);
      formData.append("orderRef", orderRef || "");
      formData.append("notes", notes);

      const response = await fetch("/api/upload-receipt", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setUploadSuccess(true);
        toast.success("Reçu envoyé avec succès !");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Erreur lors de l'envoi");
      }
    } catch (error) {
      console.error("Erreur upload:", error);
      toast.error("Erreur de connexion");
    } finally {
      setIsUploading(false);
    }
  };

  return {
    orderRef,
    navigate,
    fileInputRef,
    orderDetails,
    receiptFile,
    receiptPreview,
    notes,
    isUploading,
    isLoading,
    uploadSuccess,
    handleFileSelect,
    handleUpload,
    setNotes
  };
};
