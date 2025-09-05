import { db } from '../connection.ts';

export async function up(): Promise<void> {
  console.log('Running offers system migration...');

  // Create offers table
  await db.query(`
    CREATE TABLE offers (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      title VARCHAR(255) NOT NULL,
      description TEXT,
      image_url VARCHAR(500),
      discount_percentage DECIMAL(5,2) DEFAULT 0 CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
      discount_amount DECIMAL(10,2) DEFAULT 0 CHECK (discount_amount >= 0),
      original_price DECIMAL(10,2),
      final_price DECIMAL(10,2),
      items JSONB DEFAULT '[]',
      is_featured BOOLEAN DEFAULT false,
      is_active BOOLEAN DEFAULT true,
      sort_order INTEGER DEFAULT 0,
      valid_from TIMESTAMP WITH TIME ZONE,
      valid_until TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      created_by UUID REFERENCES admin_users(id)
    );

    -- Create index for better performance
    CREATE INDEX idx_offers_featured ON offers(is_featured) WHERE is_featured = true;
    CREATE INDEX idx_offers_active ON offers(is_active) WHERE is_active = true;
    CREATE INDEX idx_offers_valid ON offers(valid_from, valid_until) WHERE is_active = true;

    -- Auto-update trigger for offers
    CREATE TRIGGER update_offers_updated_at
      BEFORE UPDATE ON offers
      FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
  `);

  console.log('Offers system migration completed successfully');
}

export async function down(): Promise<void> {
  console.log('Rolling back offers system migration...');

  await db.query(`
    DROP TRIGGER IF EXISTS update_offers_updated_at ON offers;
    DROP TABLE IF EXISTS offers CASCADE;
  `);

  console.log('Offers system migration rollback completed');
}
