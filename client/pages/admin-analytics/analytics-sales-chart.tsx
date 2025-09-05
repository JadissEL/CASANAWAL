import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { ResponsiveContainer } from 'recharts';
import { analyticsData } from "./analytics-data";
import { chartVariants } from "./analytics-animations";

export const AnalyticsSalesChart = () => (
  <motion.div
    variants={chartVariants}
    initial="hidden"
    animate="visible"
    transition={{ delay: 0.5 }}
  >
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-bold text-nuit-900">
          <BarChart3 className="h-5 w-5 mr-2 text-indigo-600" />
          Performance hebdomadaire
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={analyticsData.salesByDay}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="day" className="text-sm" />
            <YAxis className="text-sm" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#6366F1"
              strokeWidth={3}
              fill="url(#revenueGradient)"
              name="Revenus (MAD)"
            />
            <Area
              type="monotone"
              dataKey="orders"
              stroke="#F59E0B"
              strokeWidth={3}
              fill="url(#ordersGradient)"
              name="Commandes"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  </motion.div>
);
