import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar, Download } from "lucide-react";

interface AnalyticsHeaderProps {
  selectedPeriod: number;
  onPeriodChange: (period: number) => void;
}

export const AnalyticsHeader = ({ selectedPeriod, onPeriodChange }: AnalyticsHeaderProps) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center justify-between"
  >
    <div>
      <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        Analyses avancées
      </h1>
      <p className="text-nuit-600 mt-2 text-lg">
        Insights détaillés sur la performance de votre restaurant
      </p>
    </div>

    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2 bg-white rounded-lg px-4 py-2 shadow-sm border">
        <Calendar className="h-4 w-4 text-nuit-500" />
        <select
          value={selectedPeriod}
          onChange={(e) => onPeriodChange(Number(e.target.value))}
          className="border-none bg-transparent text-sm font-medium text-nuit-700 focus:outline-none"
        >
          <option value={7}>7 derniers jours</option>
          <option value={30}>30 derniers jours</option>
          <option value={90}>3 derniers mois</option>
          <option value={365}>Année complète</option>
        </select>
      </div>

      <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
        <Download className="h-4 w-4 mr-2" />
        Exporter rapport
      </Button>
    </div>
  </motion.div>
);
