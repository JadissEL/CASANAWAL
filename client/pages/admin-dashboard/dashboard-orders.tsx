import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit } from "lucide-react";
import { Order } from "./dashboard-types";

interface DashboardOrdersProps {
  orders: Order[];
}

export const DashboardOrders = ({ orders }: DashboardOrdersProps) => (
  <div className="admin-card">
    <div className="admin-card-header">
      <div className="admin-card-title">📋 Gestion des Commandes ({orders.length})</div>
    </div>
    <div className="admin-card-content">
      <div className="space-y-4">
        {orders.slice(0, 10).map((order) => (
          <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex-1">
              <h3 className="font-medium">#{order.reference}</h3>
              <p className="text-sm text-gray-600">
                {order.client_name} - {order.client_phone}
              </p>
              <p className="text-lg font-bold">{order.total_amount} DHS</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge
                variant={
                  order.status === 'delivered' ? "default" :
                  order.status === 'confirmed' ? "secondary" : "outline"
                }
              >
                {order.status}
              </Badge>
              <Button size="sm" variant="outline">
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        {orders.length > 10 && (
          <p className="text-center text-gray-500">
            ... et {orders.length - 10} autres commandes
          </p>
        )}
      </div>
    </div>
  </div>
);
