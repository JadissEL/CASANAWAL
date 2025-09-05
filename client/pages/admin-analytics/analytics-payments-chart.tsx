import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { ResponsiveContainer } from 'recharts';
import { analyticsData } from "./analytics-data";
import { chartVariants } from "./analytics-animations";

export const AnalyticsPaymentsChart = () => (
  <motion.div
    variants={chartVariants}
    initial="hidden"
    animate="visible"
    transition={{ delay: 0.7 }}
  >
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-nuit-900">
          Méthodes de paiement
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={analyticsData.paymentMethods}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              stroke="none"
            >
              {analyticsData.paymentMethods.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="space-y-3 mt-4">
          {analyticsData.paymentMethods.map((method) => (
            <div key={method.method} className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-3"
                  style={{ backgroundColor: method.color }}
                />
                <span className="text-sm text-nuit-700">{method.method}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-nuit-900">{method.value}%</p>
                <p className="text-xs text-nuit-500">{method.amount.toLocaleString()} MAD</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </motion.div>
);
