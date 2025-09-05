import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CheckSquare, Square, Eye, MoreVertical, Edit, Phone, Printer, XCircle, User, Package, RefreshCw } from "lucide-react";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from "@/lib/utils";
import { Order, OrderPagination } from "./orders-types";
import { OrdersStatusBadge } from "./orders-status-badge";

interface OrdersTableProps {
  orders: Order[];
  pagination: OrderPagination;
  selectedOrders: string[];
  isLoading: boolean;
  onToggleOrderSelection: (orderId: string) => void;
  onSelectAllOrders: () => void;
  onOpenOrderDetails: (order: Order) => void;
  onOpenStatusDialog: (order: Order) => void;
}

export const OrdersTable = ({
  orders,
  pagination,
  selectedOrders,
  isLoading,
  onToggleOrderSelection,
  onSelectAllOrders,
  onOpenOrderDetails,
  onOpenStatusDialog
}: OrdersTableProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Commandes ({pagination.total || 0})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Commandes ({pagination.total || 0})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucune commande trouvée</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Commandes ({pagination.total || 0})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onSelectAllOrders}
                    className="h-8 w-8 p-0"
                  >
                    {selectedOrders.length === orders.length ?
                      <CheckSquare className="h-4 w-4" /> :
                      <Square className="h-4 w-4" />
                    }
                  </Button>
                </TableHead>
                <TableHead>Référence</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className={cn(
                  selectedOrders.includes(order.id) && "bg-blue-50"
                )}>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleOrderSelection(order.id)}
                      className="h-8 w-8 p-0"
                    >
                      {selectedOrders.includes(order.id) ?
                        <CheckSquare className="h-4 w-4" /> :
                        <Square className="h-4 w-4" />
                      }
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium">
                    #{order.reference}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>{order.client_phone || 'Client'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <OrdersStatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="font-semibold">
                    {order.total_amount} DH
                  </TableCell>
                  <TableCell>
                    {format(new Date(order.created_at), 'dd/MM/yyyy HH:mm', { locale: fr })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onOpenOrderDetails(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onOpenStatusDialog(order)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Changer le statut
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Phone className="h-4 w-4 mr-2" />
                            Contacter le client
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Printer className="h-4 w-4 mr-2" />
                            Imprimer
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <XCircle className="h-4 w-4 mr-2" />
                            Annuler la commande
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
