import { useState } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";

export const useAnalyticsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState(30);
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [viewType, setViewType] = useState('overview');

  const { data: analyticsData, isLoading, refetch } = useAnalytics(selectedPeriod);

  return {
    // State
    selectedPeriod,
    setSelectedPeriod,
    selectedMetric,
    setSelectedMetric,
    viewType,
    setViewType,

    // Data
    analyticsData,
    isLoading,

    // Actions
    refetch
  };
};
