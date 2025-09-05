import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Line } from 'recharts';
import { ResponsiveContainer } from 'recharts';
import { analyticsData } from "./analytics-data";
import { chartVariants } from "./analytics-animations";

export const AnalyticsRevenueChart = () => (
  <motion.div
    variants={chartVariants}
    initial="hidden"
    animate="visible"
    transition={{ delay: 0.3 }}
  >
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-bold text-nuit-900">
          <Activity className="h-5 w-5 mr-2 text-purple-600" />
          Revenus par heure
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={analyticsData.revenueByHour}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="hour" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar dataKey="revenue" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            <Line
              type="monotone"
              dataKey="orders"
              stroke="#F59E0B"
              strokeWidth={3}
              dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  </motion.div>
);
