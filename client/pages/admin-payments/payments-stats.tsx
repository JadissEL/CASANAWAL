import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Clock, Check, X } from "lucide-react";
import { PaymentStats } from "./payments-hooks";
import { itemVariants } from "./payments-animations";

interface PaymentsStatsProps {
  stats: PaymentStats;
}

export const PaymentsStats = ({ stats }: PaymentsStatsProps) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
    <motion.div variants={itemVariants}>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Total paiements</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_payments}</p>
            </div>
            <CreditCard className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>
    </motion.div>

    <motion.div variants={itemVariants}>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">En attente</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending_count}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </CardContent>
      </Card>
    </motion.div>

    <motion.div variants={itemVariants}>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Vérifiés</p>
              <p className="text-2xl font-bold text-gray-900">{stats.verified_count}</p>
            </div>
            <Check className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>
    </motion.div>

    <motion.div variants={itemVariants}>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Rejetés</p>
              <p className="text-2xl font-bold text-gray-900">{stats.rejected_count}</p>
            </div>
            <X className="h-8 w-8 text-red-500" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  </div>
);
