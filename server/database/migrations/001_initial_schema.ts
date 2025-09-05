import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from '../connection.ts';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function up(): Promise<void> {
  console.log('Running initial schema migration...');
  
  const schemaSQL = fs.readFileSync(
    path.join(__dirname, '../schema.sql'),
    'utf8'
  );

  await db.query(schemaSQL);
  console.log('Initial schema migration completed successfully');
}

export async function down(): Promise<void> {
  console.log('Rolling back initial schema migration...');
  
  const tables = [
    'system_settings',
    'content_translations',
    'notifications',
    'reviews',
    'promo_codes',
    'receipts',
    'payments',
    'order_status_history',
    'order_items',
    'orders',
    'clients',
    'portion_pricing',
    'product_allergens',
    'product_images',
    'product_translations',
    'products',
    'category_translations',
    'categories',
    'admin_users'
  ];

  for (const table of tables) {
    await db.query(`DROP TABLE IF EXISTS ${table} CASCADE`);
  }

  // Drop functions
  await db.query('DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE');
  await db.query('DROP FUNCTION IF EXISTS generate_order_reference() CASCADE');
  await db.query('DROP FUNCTION IF EXISTS set_order_reference() CASCADE');

  console.log('Initial schema migration rolled back successfully');
}
