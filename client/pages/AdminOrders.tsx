import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { AdminLayout } from "@/components/ui/admin-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { containerVariants } from "./admin-orders/orders-animations";
import { useOrdersPage } from "./admin-orders/orders-hooks";
import { OrdersHeader } from "./admin-orders/orders-header";
import { OrdersStats } from "./admin-orders/orders-stats";
import { OrdersFilters } from "./admin-orders/orders-filters";
import { OrdersTable } from "./admin-orders/orders-table";
import { OrdersDialogs } from "./admin-orders/orders-dialogs";

const AdminOrders = () => {
  const {
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
    isUpdatingOrderStatus,
    isBulkUpdating,

    // Handlers
    handleStatusUpdate,
    handleBulkAction,
    toggleOrderSelection,
    selectAllOrders,
    openOrderDetails,
    openStatusDialog,
    clearSelection
  } = useOrdersPage();

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Erreur de chargement</h2>
            <p className="text-gray-600 mb-4">Impossible de charger les commandes</p>
            <Button onClick={() => refetch()}>
              <AlertTriangle className="h-4 w-4 mr-2" />
              Réessayer
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="pt-6">
        <OrdersHeader isLoading={isLoading} onRefresh={refetch} />

        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <OrdersStats stats={stats} />
        </motion.div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <OrdersFilters
              filters={filters}
              setFilters={setFilters}
              selectedOrders={selectedOrders}
              bulkAction={bulkAction}
              setBulkAction={setBulkAction}
              onBulkAction={handleBulkAction}
              onClearSelection={clearSelection}
              isBulkUpdating={isBulkUpdating}
            />
          </CardContent>
        </Card>

        <OrdersTable
          orders={orders}
          pagination={pagination}
          selectedOrders={selectedOrders}
          isLoading={isLoading}
          onToggleOrderSelection={toggleOrderSelection}
          onSelectAllOrders={selectAllOrders}
          onOpenOrderDetails={openOrderDetails}
          onOpenStatusDialog={openStatusDialog}
        />

        <OrdersDialogs
          isStatusDialogOpen={isStatusDialogOpen}
          setIsStatusDialogOpen={setIsStatusDialogOpen}
          isDetailsOpen={isDetailsOpen}
          setIsDetailsOpen={setIsDetailsOpen}
          orderDetails={orderDetails}
          statusUpdate={statusUpdate}
          setStatusUpdate={setStatusUpdate}
          isUpdatingOrderStatus={isUpdatingOrderStatus}
          onHandleStatusUpdate={handleStatusUpdate}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
