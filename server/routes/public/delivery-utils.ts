// =====================================================
// DELIVERY UTILITIES (≤150 lines)
// =====================================================

const DEFAULT_DELIVERY_ZONES = [
  { name: "Centre-ville", fee: 10, min_order: 80 },
  { name: "Quartier administratif", fee: 15, min_order: 100 },
  { name: "Zone industrielle", fee: 20, min_order: 120 },
  { name: "Périphérie", fee: 25, min_order: 150 }
];

export const isDeliveryAvailable = (zoneName: string): boolean => {
  return DEFAULT_DELIVERY_ZONES.some(zone => zone.name === zoneName);
};

export const getDeliveryFee = (zoneName: string): number => {
  const zone = DEFAULT_DELIVERY_ZONES.find(z => z.name === zoneName);
  return zone ? zone.fee : 0;
};

export const getMinimumOrder = (zoneName: string): number => {
  const zone = DEFAULT_DELIVERY_ZONES.find(z => z.name === zoneName);
  return zone ? zone.min_order : 50;
};
