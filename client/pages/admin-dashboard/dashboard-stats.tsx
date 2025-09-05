import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, DollarSign, Package, AlertTriangle } from "lucide-react";
import { Stats } from "./dashboard-types";
import { itemVariants } from "./dashboard-animations";

interface DashboardStatsProps {
  stats: Stats;
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => (
  <div className="space-y-6">
    <div className="admin-stats-grid">
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commandes</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_orders}</div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Number(stats.total_revenue || 0).toFixed(2)} DHS</div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produits</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_products}</div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paiements en attente</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pending_payments}</div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  </div>
);
