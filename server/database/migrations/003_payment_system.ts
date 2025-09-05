import { db } from '../connection.ts';

async function createPaymentTables() {
  console.log('🔄 Creating payment system tables...');

  try {
    // Create payments table
    await db.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        amount DECIMAL(10,2) NOT NULL,
        payment_method VARCHAR(50) NOT NULL,
        receipt_url TEXT NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
        submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        verified_at TIMESTAMP WITH TIME ZONE,
        verified_by UUID REFERENCES admin_users(id),
        admin_notes TEXT,
        rejection_reason TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Create email_logs table
    await db.query(`
      CREATE TABLE IF NOT EXISTS email_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        recipient VARCHAR(255) NOT NULL,
        subject VARCHAR(500) NOT NULL,
        type VARCHAR(50) NOT NULL CHECK (type IN ('ORDER_CONFIRMATION', 'ORDER_VALIDATED', 'RECEIPT_REQUEST', 'ORDER_CANCELLED')),
        order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
        sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        status VARCHAR(20) NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'failed')),
        error_message TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Add missing columns to orders table if they don't exist
    await db.query(`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS client_email VARCHAR(255),
      ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'paid')),
      ADD COLUMN IF NOT EXISTS deposit_amount DECIMAL(10,2),
      ADD COLUMN IF NOT EXISTS remaining_amount DECIMAL(10,2);
    `);

    // Create indexes for better performance
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
    `);
    
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
    `);
    
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_payments_submitted_at ON payments(submitted_at);
    `);
    
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_email_logs_order_id ON email_logs(order_id);
    `);
    
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_email_logs_type ON email_logs(type);
    `);
    
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON email_logs(sent_at);
    `);

    // Create triggers for updated_at
    await db.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ language 'plpgsql';

      DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
      CREATE TRIGGER update_payments_updated_at
          BEFORE UPDATE ON payments
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
    `);

    console.log('✅ Payment system tables created successfully!');
  } catch (error) {
    console.error('❌ Error creating payment system tables:', error);
    throw error;
  }
}

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createPaymentTables()
    .then(() => {
      console.log('✅ Payment system migration completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Payment system migration failed:', error);
      process.exit(1);
    });
}

export { createPaymentTables };
