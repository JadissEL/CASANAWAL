import { useState, useEffect } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Product, Payment, Order, Stats, UpdateMessage, DashboardTab } from "./dashboard-types";

export const useDashboardPage = () => {
  const { token, isAuthenticated } = useAdminAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats>({
    total_orders: 0,
    total_revenue: 0.0,
    total_products: 0,
    pending_payments: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<DashboardTab>('stats');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<UpdateMessage | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = '/admin/login';
      return;
    }
  }, [isAuthenticated]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/simple-all/products', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data.data || []);
      }
    } catch (error) {
      console.error('Erreur produits:', error);
      setProducts([]);
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await fetch('/api/admin/simple-all/payments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setPayments(data.data || []);
      }
    } catch (error) {
      console.error('Erreur paiements:', error);
      setPayments([]);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/simple-all/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data.data || []);
      }
    } catch (error) {
      console.error('Erreur commandes:', error);
      setOrders([]);
    }
  };

  const calculateStats = () => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
    const totalProducts = products.length;
    const pendingPayments = payments.filter(p => p.status === 'pending').length;

    setStats({
      total_orders: totalOrders,
      total_revenue: totalRevenue,
      total_products: totalProducts,
      pending_payments: pendingPayments
    });
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/simple-all/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data.data || {
          total_orders: 0,
          total_revenue: 0.0,
          total_products: 0,
          pending_payments: 0
        });
      }
    } catch (error) {
      console.error('Erreur stats:', error);
      setStats({
        total_orders: 0,
        total_revenue: 0.0,
        total_products: 0,
        pending_payments: 0
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (!isAuthenticated || !token) {
        return;
      }
      setLoading(true);
      await Promise.all([
        fetchProducts(),
        fetchPayments(),
        fetchOrders(),
        fetchStats()
      ]);
      setLoading(false);
    };
    loadData();
  }, [isAuthenticated, token]);

  useEffect(() => {
    calculateStats();
  }, [products, payments, orders]);

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
    setUpdateMessage(null);
  };

  const handleUpdateProduct = async (productData: Partial<Product>) => {
    if (!editingProduct) return;

    try {
      const response = await fetch(`/api/admin/simple-all/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });

      const result = await response.json();

      if (result.success) {
        setUpdateMessage({ type: 'success', text: result.message || 'Produit modifié avec succès' });
        await fetchProducts(); // Recharger la liste
        setTimeout(() => {
          setIsEditModalOpen(false);
          setEditingProduct(null);
          setUpdateMessage(null);
        }, 1500);
      } else {
        setUpdateMessage({
          type: 'error',
          text: result.message || result.errors?.join(', ') || 'Erreur lors de la modification'
        });
      }
    } catch (error) {
      setUpdateMessage({ type: 'error', text: 'Erreur de connexion' });
    }
  };

  const toggleProduct = async (productId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}/toggle`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ is_active: !isActive })
      });
      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Erreur toggle produit:', error);
    }
  };

  const verifyPayment = async (paymentId: string) => {
    try {
      const response = await fetch(`/api/admin/payments/${paymentId}/verify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ admin_notes: 'Paiement vérifié' })
      });
      if (response.ok) {
        fetchPayments();
        fetchOrders();
      }
    } catch (error) {
      console.error('Erreur vérification paiement:', error);
    }
  };

  const closeModal = () => {
    setIsEditModalOpen(false);
    setEditingProduct(null);
    setUpdateMessage(null);
  };

  return {
    // State
    products,
    payments,
    orders,
    stats,
    loading,
    activeTab,
    setActiveTab,
    editingProduct,
    isEditModalOpen,
    updateMessage,

    // Actions
    handleEditProduct,
    handleUpdateProduct,
    toggleProduct,
    verifyPayment,
    closeModal
  };
};
