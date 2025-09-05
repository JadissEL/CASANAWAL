import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Clock, CheckCircle, DollarSign } from "lucide-react";
import CountUp from '@/components/ui/count-up';
import { OrderStats } from "./orders-types";
import { itemVariants } from "./orders-animations";

interface OrdersStatsProps {
  stats: OrderStats;
}

export const OrdersStats = ({ stats }: OrdersStatsProps) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
    <motion.div variants={itemVariants}>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total commandes</p>
              <p className="text-2xl font-bold">
                <CountUp end={stats.total_orders || 0} />
              </p>
            </div>
            <ShoppingCart className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>
    </motion.div>

    <motion.div variants={itemVariants}>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En attente</p>
              <p className="text-2xl font-bold text-orange-600">
                <CountUp end={stats.pending_orders || 0} />
              </p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
        </CardContent>
      </Card>
    </motion.div>

    <motion.div variants={itemVariants}>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Terminées</p>
              <p className="text-2xl font-bold text-green-600">
                <CountUp end={stats.completed_orders || 0} />
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>
    </motion.div>

    <motion.div variants={itemVariants}>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenus du jour</p>
              <p className="text-2xl font-bold text-green-600">
                <CountUp end={stats.today_revenue || 0} suffix=" DH" />
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  </div>
);
