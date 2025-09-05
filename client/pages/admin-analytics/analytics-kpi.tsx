import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Target,
  ShoppingBag,
  Users,
  Clock,
  Eye,
  TrendingDown
} from "lucide-react";
import CountUp from '@/components/ui/count-up';
import { cn } from "@/lib/utils";
import { KPIMetric } from "./analytics-types";
import { analyticsData } from "./analytics-data";

const kpiMetrics: KPIMetric[] = [
  {
    title: "Taux de conversion",
    value: analyticsData.performanceMetrics.conversionRate,
    suffix: "%",
    change: "+2.3%",
    changeType: "increase",
    icon: Target,
    description: "Visiteurs → Commandes"
  },
  {
    title: "Panier moyen",
    value: analyticsData.performanceMetrics.avgOrderValue,
    suffix: " MAD",
    change: "+5.2 MAD",
    changeType: "increase",
    icon: ShoppingBag,
    description: "Par commande"
  },
  {
    title: "Rétention client",
    value: analyticsData.performanceMetrics.customerRetention,
    suffix: "%",
    change: "+1.8%",
    changeType: "increase",
    icon: Users,
    description: "Clients fidèles"
  },
  {
    title: "Temps de préparation",
    value: analyticsData.performanceMetrics.orderFulfillmentTime,
    suffix: " min",
    change: "-3.2 min",
    changeType: "decrease",
    icon: Clock,
    description: "Temps moyen"
  },
  {
    title: "Satisfaction client",
    value: analyticsData.performanceMetrics.customerSatisfaction,
    suffix: "/5",
    change: "+0.2",
    changeType: "increase",
    icon: Eye,
    description: "Note moyenne"
  },
  {
    title: "Taux d'annulation",
    value: analyticsData.performanceMetrics.cancelationRate,
    suffix: "%",
    change: "-0.8%",
    changeType: "decrease",
    icon: TrendingDown,
    description: "Commandes annulées"
  }
];

export const AnalyticsKPI = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
  >
    {kpiMetrics.map((metric, index) => (
      <motion.div
        key={metric.title}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 + index * 0.05 }}
        whileHover={{ y: -2 }}
      >
        <Card className="border-0 shadow-md hover:shadow-lg transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <metric.icon className="h-5 w-5 text-purple-600" />
              <Badge
                variant={metric.changeType === 'increase' ? 'default' : 'secondary'}
                className={cn(
                  "text-xs",
                  metric.changeType === 'increase'
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                )}
              >
                {metric.change}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-nuit-900">
                <CountUp
                  end={metric.value}
                  decimals={metric.title.includes('Satisfaction') ? 1 : 0}
                />
                {metric.suffix}
              </p>
              <p className="text-xs font-medium text-nuit-600">{metric.title}</p>
              <p className="text-xs text-nuit-500">{metric.description}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    ))}
  </motion.div>
);
