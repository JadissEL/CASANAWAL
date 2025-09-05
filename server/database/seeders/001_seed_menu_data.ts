import { db } from '../connection.ts';

export async function seedMenuData(): Promise<void> {
  console.log('🌱 Checking menu data...');

  try {
    // Check if data already exists
    const existingProducts = await db.query('SELECT COUNT(*) as count FROM products');
    const existingCategories = await db.query('SELECT COUNT(*) as count FROM categories');
    
    if (existingProducts.rows[0].count > 0 && existingCategories.rows[0].count > 0) {
      console.log('✅ Menu data already exists in database. Skipping seeding.');
      return;
    }

    console.log('⚠️  No existing menu data found. Manual seeding required.');
    console.log('📝 Please run the database setup manually or restore from backup.');
    
    // Note: The original static menu data was removed during French-only simplification.
    // If you need to seed fresh data, you'll need to create a new data file or
    // manually insert the required categories and products.
    
  } catch (error) {
    console.error('❌ Error checking menu data:', error);
    throw error;
  }
}

export async function seedSystemSettings(): Promise<void> {
  console.log('⚙️ Setting up system configuration...');

  try {
    const settings = [
      {
        key: 'business_info',
        value: {
          name: 'CasaNawal',
          name_ar: 'كازا نوال',
          description: 'Cuisine Marocaine Authentique',
          description_ar: 'المطبخ المغربي الأصيل',
          phone: '+212 6 XX XX XX XX',
          email: 'contact@casanawal.ma',
          address: 'Casablanca, Maroc',
          address_ar: 'الدار البيضاء، المغرب'
        },
        description: 'Basic business information'
      },
      {
        key: 'delivery_settings',
        value: {
          fee: 25,
          free_delivery_minimum: 500,
          time_slots: [
            { value: '10:00-13:00', label_fr: '10:00 - 13:00', label_ar: '10:00 - 13:00' },
            { value: '13:00-16:00', label_fr: '13:00 - 16:00', label_ar: '13:00 - 16:00' },
            { value: '18:00-21:00', label_fr: '18:00 - 21:00', label_ar: '18:00 - 21:00' }
          ]
        },
        description: 'Delivery configuration'
      },
      {
        key: 'payment_settings',
        value: {
          deposit_percentage: 50,
          auto_cancel_hours: 2,
          banks: [
            {
              name: 'Banque Populaire',
              rib: '011 780 0000123456789 38',
              beneficiary: 'CASANAWAL CUISINE SARL'
            },
            {
              name: 'Attijariwafa Bank',
              rib: '007 840 0000987654321 75',
              beneficiary: 'CASANAWAL CUISINE SARL'
            }
          ],
          cash_deposit_beneficiary: 'CASANAWAL CUISINE'
        },
        description: 'Payment and banking configuration'
      },
      {
        key: 'business_hours',
        value: {
          monday: { open: '09:00', close: '22:00', closed: false },
          tuesday: { open: '09:00', close: '22:00', closed: false },
          wednesday: { open: '09:00', close: '22:00', closed: false },
          thursday: { open: '09:00', close: '22:00', closed: false },
          friday: { open: '09:00', close: '22:00', closed: false },
          saturday: { open: '10:00', close: '23:00', closed: false },
          sunday: { open: '10:00', close: '23:00', closed: false }
        },
        description: 'Business operating hours'
      }
    ];

    for (const setting of settings) {
      await db.query(`
        INSERT INTO system_settings (setting_key, setting_value, description)
        VALUES ($1, $2, $3)
        ON CONFLICT (setting_key) DO UPDATE SET
          setting_value = EXCLUDED.setting_value,
          description = EXCLUDED.description,
          updated_at = NOW()
      `, [setting.key, JSON.stringify(setting.value), setting.description]);
    }

    console.log('✅ System settings configured successfully!');
  } catch (error) {
    console.error('❌ Error setting up system configuration:', error);
    throw error;
  }
}

// Main seeder function
export async function runSeeders(): Promise<void> {
  console.log('🚀 Starting database seeding process...');
  
  try {
    await seedMenuData();
    await seedSystemSettings();
    console.log('🎉 All seeders completed successfully!');
  } catch (error) {
    console.error('💥 Seeding process failed:', error);
    throw error;
  }
}

// Note: This file is imported by setup-database.ts, not executed directly
