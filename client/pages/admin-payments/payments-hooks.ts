import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";

export interface PaymentReceipt {
  id: string;
  order_id: string;
  order_code: string;
  customer_name: string;
  customer_email: string;
  amount: number;
  receipt_url: string;
  status: "pending" | "verified" | "rejected";
  submitted_at: string;
  verified_at?: string;
  admin_notes?: string;
}

export interface PaymentStats {
  total_payments: number;
  pending_count: number;
  verified_count: number;
  rejected_count: number;
  total_amount: number;
}

export const useAdminPayments = () => {
  const { token } = useAdminAuth();
  const [payments, setPayments] = useState<PaymentReceipt[]>([]);
  const [stats, setStats] = useState<PaymentStats>({
    total_payments: 0,
    pending_count: 0,
    verified_count: 0,
    rejected_count: 0,
    total_amount: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [processing, setProcessing] = useState(false);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/simple-all/payments', { headers: { 'Authorization': `Bearer ${token}` } });
      if (response.ok) {
        const data = await response.json();
        setPayments(data.data || []);
      }
    } catch {
      toast.error('Erreur lors du chargement des paiements');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/simple-all/payment-stats', { headers: { 'Authorization': `Bearer ${token}` } });
      if (response.ok) {
        const data = await response.json();
        setStats(data.data || {});
      }
    } catch {}
  };

  const handlePaymentAction = async (paymentId: string, action: 'verify'|'reject'|'request_new', notes?: string) => {
    try {
      setProcessing(true);
      let endpoint = '';
      const body: any = {};
      if (action === 'verify') endpoint = `/api/admin/payments/${paymentId}/verify`;
      if (action === 'reject') { endpoint = `/api/admin/payments/${paymentId}/reject`; body.reason = notes; }
      if (action === 'request_new') { endpoint = `/api/admin/payments/${paymentId}/request-new`; body.reason = notes; }
      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(body) });
      if (response.ok) {
        toast.success('Action effectuée avec succès');
        await fetchPayments();
        await fetchStats();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Erreur lors de l\'action');
      }
    } finally {
      setProcessing(false);
    }
  };

  const filteredPayments = useMemo(() => {
    return payments.filter(p => {
      const s = searchQuery.toLowerCase();
      const matchesSearch = p.order_code.toLowerCase().includes(s) || p.customer_name.toLowerCase().includes(s) || p.customer_email.toLowerCase().includes(s);
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [payments, searchQuery, statusFilter]);

  useEffect(() => { if (token) { fetchPayments(); fetchStats(); } }, [token]);

  return {
    payments,
    stats,
    loading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    processing,
    fetchPayments,
    fetchStats,
    handlePaymentAction,
    filteredPayments
  };
};


