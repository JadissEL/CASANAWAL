import { db } from '../connection.ts';

export async function up(): Promise<void> {
  console.log('Running migration to remove translation infrastructure...');
  
  // Drop translation tables
  await db.query('DROP TABLE IF EXISTS content_translations CASCADE');
  await db.query('DROP TABLE IF EXISTS product_translations CASCADE');
  await db.query('DROP TABLE IF EXISTS category_translations CASCADE');
  
  // Remove Arabic fields from product_allergens table
  await db.query(`
    ALTER TABLE product_allergens 
    DROP COLUMN IF EXISTS allergen_name_ar
  `);
  
  // Remove Arabic fields from portion_pricing table
  await db.query(`
    ALTER TABLE portion_pricing 
    DROP COLUMN IF EXISTS size_label_ar
  `);
  
  // Remove Arabic fields from promo_codes table
  await db.query(`
    ALTER TABLE promo_codes 
    DROP COLUMN IF EXISTS name_ar
  `);
  
  // Rename French fields to remove language suffix
  // Rename _fr fields to base names (only if they exist)
  try {
    await db.query(`
      ALTER TABLE product_allergens 
      RENAME COLUMN allergen_name_fr TO allergen_name
    `);
  } catch (error) {
    console.log('Column allergen_name_fr does not exist, skipping rename');
  }
  
  // Rename _fr fields to base names (only if they exist)
  try {
    await db.query(`
      ALTER TABLE portion_pricing 
      RENAME COLUMN size_label_fr TO size_label
    `);
  } catch (error) {
    console.log('Column size_label_fr does not exist, skipping rename');
  }
  
  // Rename _fr fields to base names (only if they exist)
  try {
    await db.query(`
      ALTER TABLE promo_codes 
      RENAME COLUMN name_fr TO name
    `);
  } catch (error) {
    console.log('Column name_fr does not exist, skipping rename');
  }
  
  console.log('Translation infrastructure removal completed successfully');
}

export async function down(): Promise<void> {
  console.log('Rolling back translation infrastructure removal...');
  
  // Recreate translation tables (simplified version)
  await db.query(`
    CREATE TABLE IF NOT EXISTS content_translations (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      content_key VARCHAR(255) NOT NULL,
      language_code VARCHAR(5) NOT NULL,
      content_value TEXT NOT NULL,
      updated_by UUID REFERENCES admin_users(id),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(content_key, language_code)
    )
  `);
  
  await db.query(`
    CREATE TABLE IF NOT EXISTS category_translations (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
      language_code VARCHAR(5) NOT NULL,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      UNIQUE(category_id, language_code)
    )
  `);
  
  await db.query(`
    CREATE TABLE IF NOT EXISTS product_translations (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      language_code VARCHAR(5) NOT NULL,
      name VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      preparation_time_text VARCHAR(100),
      UNIQUE(product_id, language_code)
    )
  `);
  
  // Add back Arabic fields
  await db.query(`
    ALTER TABLE product_allergens 
    ADD COLUMN allergen_name_ar VARCHAR(100)
  `);
  
  await db.query(`
    ALTER TABLE portion_pricing 
    ADD COLUMN size_label_ar VARCHAR(100)
  `);
  
  await db.query(`
    ALTER TABLE promo_codes 
    ADD COLUMN name_ar VARCHAR(255)
  `);
  
  // Rename fields back to French versions
  await db.query(`
    ALTER TABLE product_allergens 
    RENAME COLUMN allergen_name TO allergen_name_fr
  `);
  
  await db.query(`
    ALTER TABLE portion_pricing 
    RENAME COLUMN size_label TO size_label_fr
  `);
  
  await db.query(`
    ALTER TABLE promo_codes 
    RENAME COLUMN name TO name_fr
  `);
  
  console.log('Translation infrastructure rollback completed successfully');
}
