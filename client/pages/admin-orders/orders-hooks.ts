import { useState, useEffect } from "react";
import { useOrderManagement } from "@/hooks/useAdminDashboard";
import { useOrderActions } from "@/hooks/useOrderActions";
import toast from "react-hot-toast";
import { Order, OrderFilters, StatusUpdate } from "./orders-types";

export const useOrdersPage = () => {
  const [filters, setFilters] = useState<OrderFilters>({
    status: "all",
    search: "",
    date_range: "all",
    page: 1
  });

  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState("");
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState<StatusUpdate>({
    orderId: "",
    status: "",
    notes: ""
  });

  const { data, isLoading, error, refetch } = useOrderManagement(filters);
  const {
    updateOrderStatus,
    bulkUpdateOrders,
    verifyPayment,
    isUpdatingOrderStatus,
    isBulkUpdating,
    isVerifyingPayment
  } = useOrderActions();

  const orders = data?.data || [];
  const pagination = data?.pagination || { total: 0, page: 1, pages: 1 };
  const stats = data?.stats || {
    total_orders: 0,
    pending_orders: 0,
    completed_orders: 0,
    today_revenue: 0
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 30000);
    return () => clearInterval(interval);
  }, [refetch]);

  const handleStatusUpdate = async () => {
    if (!statusUpdate.orderId || !statusUpdate.status) return;

    await updateOrderStatus.mutateAsync({
      orderId: statusUpdate.orderId,
      status: statusUpdate.status,
      admin_notes: statusUpdate.notes
    });

    setIsStatusDialogOpen(false);
    setStatusUpdate({ orderId: "", status: "", notes: "" });
  };

  const handleBulkAction = async () => {
    if (selectedOrders.length === 0 || !bulkAction) {
      toast.error("Sélectionnez des commandes et une action");
      return;
    }

    if (bulkAction === 'updateStatus') {
      setIsStatusDialogOpen(true);
      return;
    }

    await bulkUpdateOrders.mutateAsync({
      orderIds: selectedOrders,
      action: bulkAction as any
    });

    setSelectedOrders([]);
    setBulkAction("");
  };

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const selectAllOrders = () => {
    if (!orders || orders.length === 0) return;
    setSelectedOrders(orders.length === selectedOrders.length ? [] : orders.map((order: Order) => order.id));
  };

  const openOrderDetails = (order: Order) => {
    setOrderDetails(order);
    setIsDetailsOpen(true);
  };

  const openStatusDialog = (order: Order) => {
    setStatusUpdate({
      orderId: order.id,
      status: "",
      notes: ""
    });
    setIsStatusDialogOpen(true);
  };

  const clearSelection = () => {
    setSelectedOrders([]);
    setBulkAction("");
  };

  return {
    // State
    filters,
    setFilters,
    selectedOrders,
    bulkAction,
    setBulkAction,
    orderDetails,
    isDetailsOpen,
    setIsDetailsOpen,
    isStatusDialogOpen,
    setIsStatusDialogOpen,
    statusUpdate,
    setStatusUpdate,

    // Data
    orders,
    pagination,
    stats,
    isLoading,
    error,

    // Actions
    refetch,
    updateOrderStatus,
    bulkUpdateOrders,
    verifyPayment,
    isUpdatingOrderStatus,
    isBulkUpdating,
    isVerifyingPayment,

    // Handlers
    handleStatusUpdate,
    handleBulkAction,
    toggleOrderSelection,
    selectAllOrders,
    openOrderDetails,
    openStatusDialog,
    clearSelection
  };
};
