import { Button } from "@/components/ui/button";
import { Package, CreditCard, ShoppingCart, TrendingUp, Gift } from "lucide-react";
import { DashboardTab } from "./dashboard-types";

interface DashboardNavigationProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
}

export const DashboardNavigation = ({ activeTab, onTabChange }: DashboardNavigationProps) => (
  <div className="flex space-x-2 border-b">
    {[
      { key: 'stats' as DashboardTab, label: '📊 Analytics', icon: TrendingUp },
      { key: 'products' as DashboardTab, label: '📦 Produits', icon: Package },
      { key: 'payments' as DashboardTab, label: '💳 Paiements', icon: CreditCard },
      { key: 'orders' as DashboardTab, label: '📋 Commandes', icon: ShoppingCart },
      { key: 'offers' as DashboardTab, label: '🎁 Offres', icon: Gift }
    ].map(tab => (
      <Button
        key={tab.key}
        variant={activeTab === tab.key ? "default" : "ghost"}
        onClick={() => onTabChange(tab.key)}
        className="flex items-center space-x-2"
      >
        <tab.icon className="h-4 w-4" />
        <span>{tab.label}</span>
      </Button>
    ))}
  </div>
);
