import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { ResponsiveContainer } from 'recharts';
import { analyticsData } from "./analytics-data";
import { chartVariants } from "./analytics-animations";

export const AnalyticsSegmentsChart = () => (
  <motion.div
    variants={chartVariants}
    initial="hidden"
    animate="visible"
    transition={{ delay: 0.4 }}
  >
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-bold text-nuit-900">
          <Users className="h-5 w-5 mr-2 text-blue-600" />
          Segments de clientèle
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={analyticsData.customerSegments}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              dataKey="value"
              stroke="none"
            >
              {analyticsData.customerSegments.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-1 gap-3 mt-4">
          {analyticsData.customerSegments.map((segment) => (
            <div key={segment.name} className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-3"
                  style={{ backgroundColor: segment.color }}
                />
                <span className="text-sm font-medium text-nuit-700">{segment.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-nuit-900">{segment.value}%</span>
                <Badge className="bg-green-100 text-green-700 text-xs">
                  +{segment.growth}%
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </motion.div>
);
