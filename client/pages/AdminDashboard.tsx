import { motion } from "framer-motion";
import { AdminLayout } from "@/components/ui/admin-layout";
import { containerVariants, tabVariants } from "./admin-dashboard/dashboard-animations";
import { useDashboardPage } from "./admin-dashboard/dashboard-hooks";
import { DashboardHeader } from "./admin-dashboard/dashboard-header";
import { DashboardNavigation } from "./admin-dashboard/dashboard-navigation";
import { DashboardStats } from "./admin-dashboard/dashboard-stats";
import { DashboardProducts } from "./admin-dashboard/dashboard-products";
import { DashboardPayments } from "./admin-dashboard/dashboard-payments";
import { DashboardOrders } from "./admin-dashboard/dashboard-orders";
import { DashboardOffers } from "./admin-dashboard/dashboard-offers";
import { DashboardProductModal } from "./admin-dashboard/dashboard-product-modal";

export default function AdminDashboard() {
  const {
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
  } = useDashboardPage();

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Chargement du dashboard...</div>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="admin-main-content">
        <DashboardHeader />

        <DashboardNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {activeTab === 'stats' && (
            <motion.div variants={tabVariants}>
              <DashboardStats stats={stats} />
            </motion.div>
          )}

          {activeTab === 'products' && (
            <motion.div variants={tabVariants}>
              <DashboardProducts
                products={products}
                onToggleProduct={toggleProduct}
                onEditProduct={handleEditProduct}
              />
            </motion.div>
          )}

          {activeTab === 'payments' && (
            <motion.div variants={tabVariants}>
              <DashboardPayments
                payments={payments}
                onVerifyPayment={verifyPayment}
              />
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div variants={tabVariants}>
              <DashboardOrders orders={orders} />
            </motion.div>
          )}

          {activeTab === 'offers' && (
            <motion.div variants={tabVariants}>
              <DashboardOffers onMessage={(message) => {
                // Handle message display - you might want to add this to your hooks
                console.log(message);
              }} />
            </motion.div>
          )}
        </motion.div>
      </div>

      <DashboardProductModal
        editingProduct={editingProduct}
        isEditModalOpen={isEditModalOpen}
        onClose={closeModal}
        onSave={handleUpdateProduct}
        updateMessage={updateMessage}
      />
    </AdminLayout>
  );
}
