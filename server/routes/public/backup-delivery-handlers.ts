// =====================================================
// DELIVERY HANDLERS - REFACTORED FROM BACKUP (≤150 lines)
// =====================================================

import { RequestHandler } from "express";
import { db } from "../../database/connection";

// Get delivery zones and pricing
export const getDeliveryZones: RequestHandler = async (req, res) => {
  try {
    // Get delivery zone analytics for estimated delivery times
    const zoneAnalytics = await db.query(`
      SELECT 
        zone_name,
        AVG(avg_delivery_time) as avg_delivery_time,
        AVG(delivery_success_rate) as success_rate,
        COUNT(*) as order_count
      FROM zone_analytics 
      WHERE analytics_date >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY zone_name
    `);

    const analyticsMap = new Map();
    zoneAnalytics.rows.forEach(row => {
      analyticsMap.set(row.zone_name, {
        avg_delivery_time: Math.round(parseFloat(row.avg_delivery_time)),
        success_rate: parseFloat(row.success_rate),
        order_count: parseInt(row.order_count)
      });
    });

    // Default zones with analytics if available
    const zones = [
      {
        id: "centre-ville",
        name: "Centre-ville",
        fee: 10,
        min_order: 80,
        estimated_time: "25-35 min",
        coverage_areas: ["Maarif", "Gauthier", "Palmier", "Bourgogne"]
      },
      {
        id: "quartier-admin",
        name: "Quartier administratif",
        fee: 15,
        min_order: 100,
        estimated_time: "30-40 min",
        coverage_areas: ["Racine", "Belvedere", "Hay Hassani", "Oulfa"]
      },
      {
        id: "zone-industrielle",
        name: "Zone industrielle",
        fee: 20,
        min_order: 120,
        estimated_time: "35-45 min",
        coverage_areas: ["Ain Sebaa", "Sidi Moumen", "Hay Mohammadi"]
      },
      {
        id: "peripherie",
        name: "Périphérie",
        fee: 25,
        min_order: 150,
        estimated_time: "40-55 min",
        coverage_areas: ["Bouskoura", "Nouaceur", "Mediouna", "Mohammedia"]
      }
    ];

    // Enhance with analytics data
    zones.forEach(zone => {
      const analytics = analyticsMap.get(zone.name);
      if (analytics) {
        zone.estimated_time = `${Math.max(20, analytics.avg_delivery_time - 5)}-${analytics.avg_delivery_time + 10} min`;
        (zone as any).success_rate = analytics.success_rate;
        (zone as any).recent_orders = analytics.order_count;
      }
    });

    res.json({
      success: true,
      data: {
        zones,
        default_fee: 15,
        free_delivery_threshold: 200,
        notes: [
          "Les délais peuvent varier selon la circulation et les conditions météorologiques",
          "Livraison gratuite pour les commandes de plus de 200 MAD",
          "Service disponible de 11h00 à 21h30"
        ]
      }
    });

  } catch (error) {
    console.error('Get delivery zones error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch delivery zones'
    });
  }
};
