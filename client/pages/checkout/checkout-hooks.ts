import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";

export interface OrderForm {
  phone: string;
  address: string;
  deliveryDate: string;
  deliverySlot: string;
  email: string;
  notes: string;
  acceptTerms: boolean;
}

export const useCheckoutPage = () => {
  const { state } = useCart();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<OrderForm>({
    phone: "",
    address: "",
    deliveryDate: "",
    deliverySlot: "",
    email: "",
    notes: "",
    acceptTerms: false
  });

  const deliveryFee = 25;
  const actualDeliveryFee = 0;
  const total = state.total + actualDeliveryFee;

  const timeSlots = [
    { value: "10:00-13:00", label: "10:00 - 13:00" },
    { value: "13:00-16:00", label: "13:00 - 16:00" },
    { value: "18:00-21:00", label: "18:00 - 21:00" }
  ];

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split("T")[0];
    setFormData(prev => ({ ...prev, deliveryDate: minDate }));
  }, []);

  useEffect(() => {
    if (state.items.length === 0) navigate('/cart');
  }, [state.items, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^(\+212|0)[5-7][0-9]{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const isFormValid = (): boolean => (
    validatePhone(formData.phone) &&
    formData.address.length >= 10 &&
    formData.deliveryDate !== "" &&
    formData.deliverySlot !== "" &&
    formData.acceptTerms
  );

  const generateOrderReference = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `NAW-${year}${month}${day}-${random}`;
  };

  const submitOrder = async (): Promise<string> => {
    setIsLoading(true);
    const orderRef = generateOrderReference();
    const orderData = {
      reference: orderRef,
      status: "pending-deposit",
      customer: {
        phone: formData.phone,
        email: formData.email || null,
        address: formData.address,
        notes: formData.notes || null
      },
      delivery: { date: formData.deliveryDate, slot: formData.deliverySlot },
      items: state.items.map(item => ({ productId: item.id, name: item.name, qty: item.quantity, price: item.price, image: item.image })),
      pricing: { subtotal: state.total, shipping: deliveryFee, total, deposit_required: Math.round(total * 0.5), deposit_paid: 0 },
      payments: [],
      timestamps: { createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      meta: { ip: "client-ip", userAgent: navigator.userAgent, createdFromCheckout: true }
    } as const;

    try {
      const ordersStr = localStorage.getItem('orders');
      const ordersArr = Array.isArray(JSON.parse(ordersStr || 'null')) ? JSON.parse(ordersStr || '[]') : [];
      const updated = [orderData, ...ordersArr.filter((o: any) => o?.reference !== orderRef)].slice(0, 50);
      localStorage.setItem('orders', JSON.stringify(updated));
    } catch {
      localStorage.setItem('orders', JSON.stringify([orderData]));
    }
    localStorage.setItem('current-order', JSON.stringify(orderData));
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    return orderRef;
  };

  return {
    state,
    navigate,
    isLoading,
    formData,
    setFormData,
    deliveryFee,
    total,
    timeSlots,
    handleInputChange,
    validatePhone,
    isFormValid,
    submitOrder
  };
};


