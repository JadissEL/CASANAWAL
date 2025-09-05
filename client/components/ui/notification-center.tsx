import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  X, 
  Check, 
  AlertTriangle, 
  ShoppingCart, 
  CreditCard,
  Settings,
  Eye,
  MoreHorizontal
} from 'lucide-react';
import { Button } from './button';
import { Badge } from './badge';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { useRealTimeNotifications } from '@/hooks/useRealTimeNotifications';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    clearNotifications 
  } = useRealTimeNotifications();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order_update':
        return <ShoppingCart className="h-4 w-4 text-blue-500" />;
      case 'payment_received':
        return <CreditCard className="h-4 w-4 text-green-500" />;
      case 'system_alert':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-orange-500 bg-orange-50';
      case 'low':
        return 'border-l-blue-500 bg-blue-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80 p-0">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notifications</CardTitle>
              {notifications.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={markAllAsRead}>
                      <Check className="h-4 w-4 mr-2" />
                      Marquer tout comme lu
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={clearNotifications}>
                      <X className="h-4 w-4 mr-2" />
                      Effacer toutes
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-600">
                {unreadCount} nouvelle(s) notification(s)
              </p>
            )}
          </CardHeader>
          
          <CardContent className="p-0 max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucune notification</p>
              </div>
            ) : (
              <div className="space-y-1">
                <AnimatePresence>
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className={cn(
                        "p-4 border-l-4 cursor-pointer hover:bg-gray-50 transition-colors",
                        getPriorityColor(notification.priority),
                        notification.read && "opacity-60"
                      )}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className={cn(
                              "text-sm font-medium",
                              notification.read ? "text-gray-600" : "text-gray-900"
                            )}>
                              {notification.title}
                            </h4>
                            
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                            )}
                          </div>
                          
                          <p className={cn(
                            "text-sm mt-1",
                            notification.read ? "text-gray-500" : "text-gray-700"
                          )}>
                            {notification.message}
                          </p>
                          
                          <p className="text-xs text-gray-400 mt-2">
                            {format(new Date(notification.timestamp), 'dd MMM HH:mm', { locale: fr })}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
          
          {notifications.length > 0 && (
            <div className="p-4 border-t border-gray-200">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => setIsOpen(false)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Voir toutes les notifications
              </Button>
            </div>
          )}
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
