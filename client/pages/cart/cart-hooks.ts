import { useMemo } from "react";
import { useCart } from "@/contexts/CartContext";

export const useCartPage = () => {
  const { state, updateQuantity, removeItem } = useCart();
  const deliveryFee = 25;
  const actualDeliveryFee = 0;
  const total = useMemo(() => state.total + actualDeliveryFee, [state.total]);
  return { state, updateQuantity, removeItem, deliveryFee, total };
};


