import { useState } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/ui/admin-layout";
import { Card, CardContent } from "@/components/ui/card";
import { containerVariants } from "./admin-payments/payments-animations";
import { useAdminPayments } from "./admin-payments/payments-hooks";
import { PaymentsHeader } from "./admin-payments/payments-header";
import { PaymentsStats } from "./admin-payments/payments-stats";
import { PaymentsFilters } from "./admin-payments/payments-filters";
import { PaymentsTable } from "./admin-payments/payments-table";
import { PaymentsDialogs } from "./admin-payments/payments-dialogs";

export default function AdminPayments() {
  const {
    stats,
    loading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    processing,
    fetchPayments,
    handlePaymentAction,
    filteredPayments
  } = useAdminPayments();

  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [isReceiptDialogOpen, setIsReceiptDialogOpen] = useState(false);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"verify" | "reject" | "request_new">("verify");
  const [actionNotes, setActionNotes] = useState("");

  const openActionDialog = (payment: any, action: "verify" | "reject" | "request_new") => {
    setSelectedPayment(payment);
    setActionType(action);
    setIsActionDialogOpen(true);
    setActionNotes("");
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Chargement des paiements...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="pt-6">
        <PaymentsHeader loading={loading} onRefresh={fetchPayments} />

        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <PaymentsStats stats={stats} />
        </motion.div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <PaymentsFilters
              search={searchQuery}
              setSearch={setSearchQuery}
              status={statusFilter}
              setStatus={setStatusFilter}
              count={filteredPayments.length}
            />
          </CardContent>
        </Card>

        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <PaymentsTable
            payments={filteredPayments}
            onOpenReceipt={(p) => { setSelectedPayment(p); setIsReceiptDialogOpen(true); }}
            onOpenAction={openActionDialog}
          />
        </motion.div>

        <PaymentsDialogs
          selectedPayment={selectedPayment}
          isReceiptDialogOpen={isReceiptDialogOpen}
          setIsReceiptDialogOpen={setIsReceiptDialogOpen}
          isActionDialogOpen={isActionDialogOpen}
          setIsActionDialogOpen={setIsActionDialogOpen}
          actionType={actionType}
          actionNotes={actionNotes}
          setActionNotes={setActionNotes}
          processing={processing}
          onHandlePaymentAction={handlePaymentAction}
        />
      </div>
    </AdminLayout>
  );
}