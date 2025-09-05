import { motion } from "framer-motion";
import { AdminLayout } from "@/components/ui/admin-layout";
import { containerVariants } from "./admin-analytics/analytics-animations";
import { useAnalyticsPage } from "./admin-analytics/analytics-hooks";
import { AnalyticsHeader } from "./admin-analytics/analytics-header";
import { AnalyticsKPI } from "./admin-analytics/analytics-kpi";
import { AnalyticsRevenueChart } from "./admin-analytics/analytics-revenue-chart";
import { AnalyticsSegmentsChart } from "./admin-analytics/analytics-segments-chart";
import { AnalyticsSalesChart } from "./admin-analytics/analytics-sales-chart";
import { AnalyticsCategoriesChart } from "./admin-analytics/analytics-categories-chart";
import { AnalyticsPaymentsChart } from "./admin-analytics/analytics-payments-chart";
import { AnalyticsZonesChart } from "./admin-analytics/analytics-zones-chart";

const AdminAnalytics = () => {
  const {
    selectedPeriod,
    setSelectedPeriod,
    isLoading
  } = useAnalyticsPage();

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <motion.div 
              className="w-12 h-12 border-4 border-terracotta border-t-transparent rounded-full mx-auto mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-nuit-600 font-medium">Chargement des analyses...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8 pt-6">
        <AnalyticsHeader
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
        />

        <AnalyticsKPI />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AnalyticsRevenueChart />
          <AnalyticsSegmentsChart />
        </div>

        <AnalyticsSalesChart />

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          <AnalyticsCategoriesChart />
          <AnalyticsPaymentsChart />
          <AnalyticsZonesChart />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
