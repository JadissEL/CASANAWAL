import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { analyticsData } from "./analytics-data";
import { chartVariants } from "./analytics-animations";

export const AnalyticsCategoriesChart = () => (
  <motion.div
    variants={chartVariants}
    initial="hidden"
    animate="visible"
    transition={{ delay: 0.6 }}
  >
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-nuit-900">
          Performance par catégorie
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {analyticsData.topCategories.map((category, index) => (
            <div key={category.category} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-nuit-700">
                  {category.category}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-nuit-900">
                    {category.revenue.toLocaleString()} MAD
                  </span>
                  <Badge
                    className={cn(
                      "text-xs",
                      category.growth > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    )}
                  >
                    {category.growth > 0 ? '+' : ''}{category.growth}%
                  </Badge>
                </div>
              </div>
              <div className="w-full bg-sable-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(category.revenue / 16000) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-nuit-500">
                <span>{category.orders} commandes</span>
                <span>Moy: {category.avgPrice} MAD</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </motion.div>
);
