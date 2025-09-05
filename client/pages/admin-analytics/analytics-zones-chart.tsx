import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { analyticsData } from "./analytics-data";
import { chartVariants } from "./analytics-animations";

export const AnalyticsZonesChart = () => (
  <motion.div
    variants={chartVariants}
    initial="hidden"
    animate="visible"
    transition={{ delay: 0.8 }}
  >
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-bold text-nuit-900">
          <MapPin className="h-5 w-5 mr-2 text-red-600" />
          Zones de livraison
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {analyticsData.deliveryZones.map((zone, index) => (
            <div key={zone.zone} className="p-3 bg-gradient-to-r from-sable-50 to-white rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-nuit-900">{zone.zone}</h4>
                <Badge className="bg-blue-100 text-blue-700">
                  {zone.avgTime} min
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-nuit-500">Commandes</p>
                  <p className="font-bold text-nuit-900">{zone.orders}</p>
                </div>
                <div>
                  <p className="text-nuit-500">Revenus</p>
                  <p className="font-bold text-nuit-900">{zone.revenue.toLocaleString()} MAD</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </motion.div>
);
