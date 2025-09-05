// =====================================================
// PUBLIC SETTINGS HANDLERS (≤150 lines)
// =====================================================

import { RequestHandler } from "express";
import { db } from "../../database/connection";

// Default settings configuration
const DEFAULT_SETTINGS = {
  restaurant_name: "CasaNawal",
  restaurant_phone: "+212 5XX-XXXXXX",
  restaurant_email: "contact@casanawal.ma",
  opening_hours: {
    monday: { open: "11:00", close: "22:00", closed: false },
    tuesday: { open: "11:00", close: "22:00", closed: false },
    wednesday: { open: "11:00", close: "22:00", closed: false },
    thursday: { open: "11:00", close: "22:00", closed: false },
    friday: { open: "11:00", close: "22:00", closed: false },
    saturday: { open: "11:00", close: "23:00", closed: false },
    sunday: { open: "12:00", close: "22:00", closed: false }
  },
  delivery_zones: [
    { name: "Centre-ville", fee: 10, min_order: 80 },
    { name: "Quartier administratif", fee: 15, min_order: 100 },
    { name: "Zone industrielle", fee: 20, min_order: 120 },
    { name: "Périphérie", fee: 25, min_order: 150 }
  ],
  minimum_order_amount: 50,
  payment_methods: ["bank_transfer", "cash_deposit", "card"],
  social_media_links: {
    facebook: "",
    instagram: "",
    twitter: ""
  }
};

// Public settings keys that are safe to expose
const PUBLIC_SETTING_KEYS = [
  'restaurant_name',
  'restaurant_phone',
  'restaurant_email',
  'restaurant_address',
  'opening_hours',
  'delivery_zones',
  'minimum_order_amount',
  'delivery_fee_structure',
  'payment_methods',
  'social_media_links',
  'restaurant_description'
];

// Get system settings (public ones)
export const getPublicSettings: RequestHandler = async (req, res) => {
  try {
    const publicSettings = await db.query(`
      SELECT setting_key, setting_value
      FROM system_settings
      WHERE setting_key IN (${PUBLIC_SETTING_KEYS.map((_, i) => `$${i + 1}`).join(', ')})
    `, PUBLIC_SETTING_KEYS);

    const settings: { [key: string]: any } = {};
    publicSettings.rows.forEach(row => {
      settings[row.setting_key] = row.setting_value;
    });

    // Merge with defaults
    Object.keys(DEFAULT_SETTINGS).forEach(key => {
      if (!settings[key]) {
        settings[key] = DEFAULT_SETTINGS[key as keyof typeof DEFAULT_SETTINGS];
      }
    });

    res.json({
      success: true,
      data: settings
    });

  } catch (error) {
    console.error('Get public settings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch settings'
    });
  }
};

// Helper function to get specific setting
export const getSetting = async (settingKey: string): Promise<any> => {
  try {
    const result = await db.query(
      'SELECT setting_value FROM system_settings WHERE setting_key = $1',
      [settingKey]
    );

    if (result.rows.length > 0) {
      return result.rows[0].setting_value;
    }

    // Return default if exists
    return DEFAULT_SETTINGS[settingKey as keyof typeof DEFAULT_SETTINGS] || null;
  } catch (error) {
    console.error(`Error getting setting ${settingKey}:`, error);
    return null;
  }
};

// Helper function to get multiple settings
export const getSettings = async (settingKeys: string[]): Promise<{ [key: string]: any }> => {
  try {
    const result = await db.query(`
      SELECT setting_key, setting_value
      FROM system_settings
      WHERE setting_key IN (${settingKeys.map((_, i) => `$${i + 1}`).join(', ')})
    `, settingKeys);

    const settings: { [key: string]: any } = {};
    result.rows.forEach(row => {
      settings[row.setting_key] = row.setting_value;
    });

    // Add defaults for missing keys
    settingKeys.forEach(key => {
      if (!settings[key] && DEFAULT_SETTINGS[key as keyof typeof DEFAULT_SETTINGS]) {
        settings[key] = DEFAULT_SETTINGS[key as keyof typeof DEFAULT_SETTINGS];
      }
    });

    return settings;
  } catch (error) {
    console.error('Error getting settings:', error);
    return {};
  }
};

// Get business hours for current day
export const getCurrentBusinessHours = () => {
  const now = new Date();
  const currentDay = now.toLocaleDateString('en', { weekday: 'long' }).toLowerCase();
  
  const hours = DEFAULT_SETTINGS.opening_hours[currentDay as keyof typeof DEFAULT_SETTINGS.opening_hours];
  if (!hours) return null;

  const currentTime = now.getHours() * 60 + now.getMinutes();
  const openTime = parseInt(hours.open.split(':')[0]) * 60 + parseInt(hours.open.split(':')[1]);
  const closeTime = parseInt(hours.close.split(':')[0]) * 60 + parseInt(hours.close.split(':')[1]);

  return {
    ...hours,
    isOpen: !hours.closed && currentTime >= openTime && currentTime <= closeTime,
    currentDay
  };
};
