import { WorkflowTrigger } from './types';

// =====================================================
// DEFAULT WORKFLOW CONFIGURATIONS
// =====================================================

export const defaultWorkflows: Omit<WorkflowTrigger, 'id'>[] = [
  {
    name: 'Confirmation de commande',
    event: 'order.created',
    conditions: {},
    actions: [
      {
        type: 'email',
        config: {
          template: 'order_confirmation',
          to: 'customer'
        }
      },
      {
        type: 'notification',
        config: {
          type: 'admin',
          message: 'Nouvelle commande reçue'
        }
      }
    ],
    isActive: true,
    priority: 100
  },
  {
    name: 'Mise à jour statut commande',
    event: 'order.status_changed',
    conditions: {
      notify_customer: true
    },
    actions: [
      {
        type: 'email',
        config: {
          template: 'order_status_update',
          to: 'customer'
        }
      }
    ],
    isActive: true,
    priority: 90
  },
  {
    name: 'Notification paiement uploadé',
    event: 'payment.proof_uploaded',
    conditions: {},
    actions: [
      {
        type: 'email',
        config: {
          template: 'admin_payment_notification',
          to: 'admins'
        }
      },
      {
        type: 'notification',
        config: {
          type: 'admin',
          message: 'Nouveau justificatif de paiement à vérifier',
          priority: 'high'
        }
      }
    ],
    isActive: true,
    priority: 95
  },
  {
    name: 'Demande d\'avis après livraison',
    event: 'order.delivered',
    conditions: {},
    actions: [
      {
        type: 'email',
        config: {
          template: 'review_request',
          to: 'customer'
        },
        delay: 1440 // 24 heures
      }
    ],
    isActive: true,
    priority: 50
  },
  {
    name: 'Rappel commande non confirmée',
    event: 'order.pending_too_long',
    conditions: {
      hours_since_creation: 2
    },
    actions: [
      {
        type: 'notification',
        config: {
          type: 'admin',
          message: 'Commande en attente depuis plus de 2h',
          priority: 'high'
        }
      }
    ],
    isActive: true,
    priority: 80
  },
  {
    name: 'Alerte stock faible',
    event: 'product.low_stock',
    conditions: {
      stock_level: 5
    },
    actions: [
      {
        type: 'notification',
        config: {
          type: 'admin',
          message: 'Stock faible détecté',
          priority: 'medium'
        }
      },
      {
        type: 'email',
        config: {
          template: 'low_stock_alert',
          to: 'admins'
        }
      }
    ],
    isActive: true,
    priority: 70
  }
];
