import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { OrderData } from "./order-confirmation-types";

export const useOrderConfirmation = () => {
  const { clearCart } = useCart();
  const [searchParams] = useSearchParams();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [copySuccess, setCopySuccess] = useState<string>("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const cartClearedRef = useRef(false);

  const orderRef = searchParams.get('ref');

  useEffect(() => {
    const loadOrder = () => {
      // Try current-order first
      const storedOrder = localStorage.getItem('current-order');
      if (storedOrder) {
        try {
          const parsed = JSON.parse(storedOrder);
          if (parsed.reference === orderRef) {
            setOrderData(parsed);
            if (!cartClearedRef.current && parsed?.meta?.createdFromCheckout) {
              clearCart();
              cartClearedRef.current = true;
            }
            return;
          }
        } catch (error) {
          console.error('Error parsing current-order:', error);
        }
      }

      // Fallback to history array 'orders'
      try {
        const ordersStr = localStorage.getItem('orders');
        const ordersArr = Array.isArray(JSON.parse(ordersStr || 'null')) ? JSON.parse(ordersStr || '[]') : [];
        const found = ordersArr.find((o: any) => o?.reference === orderRef);
        if (found) {
          setOrderData(found);
          // Ensure current-order points to this for future navigations
          localStorage.setItem('current-order', JSON.stringify(found));
        }
      } catch (err) {
        console.error('Error parsing orders history:', err);
      }
    };

    loadOrder();
  }, [orderRef, clearCart]);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(type);
      setTimeout(() => setCopySuccess(''), 2000);
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert("La taille du fichier doit être inférieure à 5 MB");
        return;
      }
      setProofFile(file);
      // In a real app, you would upload the file to your server
      console.log('File selected for upload:', file.name);
    }
  };

  return {
    orderData,
    copySuccess,
    proofFile,
    copyToClipboard,
    handleFileUpload
  };
};
