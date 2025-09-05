import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAdminAuth } from './useAdminAuth';
import toast from 'react-hot-toast';

interface Notification {
  id: string;
  type: 'order_update' | 'payment_received' | 'system_alert';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

export function useRealTimeNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { token } = useAdminAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Ne démarrer l'intervalle que si le token est disponible
    if (!token) return;

    // TEMPORAIREMENT DÉSACTIVÉ - Route realtime non implémentée
    // TODO: Implémenter /api/admin/dashboard/realtime
    return; // Sortir immédiatement pour éviter l'erreur

    // Simulation des notifications en temps réel
    const interval = setInterval(async () => {
      try {
        // Dans un vrai système, ceci serait une connexion WebSocket
        const response = await fetch('/api/admin/dashboard/realtime', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          
          // Invalider les caches pour forcer le rafraîchissement
          queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
          queryClient.invalidateQueries({ queryKey: ['orderManagement'] });
          
          // Simuler une nouvelle notification
          if (Math.random() > 0.9) { // 10% de chance
            const newNotification: Notification = {
              id: Date.now().toString(),
              type: Math.random() > 0.5 ? 'order_update' : 'payment_received',
              title: Math.random() > 0.5 ? 'Nouvelle commande' : 'Paiement reçu',
              message: Math.random() > 0.5 
                ? 'Une nouvelle commande a été reçue et nécessite votre attention'
                : 'Un paiement a été vérifié automatiquement',
              timestamp: new Date().toISOString(),
              read: false,
              priority: 'medium'
            };
            
            setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
            setUnreadCount(prev => prev + 1);
            
            // Afficher toast notification
            if (newNotification.type === 'order_update') {
              toast.success(newNotification.message, {
                duration: 4000,
                position: 'top-right'
              });
            } else if (newNotification.type === 'payment_received') {
              toast.success(newNotification.message, {
                duration: 4000,
                position: 'top-right'
              });
            }
          }
        }
      } catch (error) {
        console.error('Error fetching real-time updates:', error);
      }
    }, 10000); // Vérifier toutes les 10 secondes

    return () => clearInterval(interval);
  }, [queryClient, token]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications
  };
}
