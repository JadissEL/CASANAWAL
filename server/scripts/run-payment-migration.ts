import { createPaymentTables } from '../database/migrations/003_payment_system';

async function runPaymentMigration() {
  console.log('🔄 Starting payment system migration...');
  
  try {
    await createPaymentTables();
    console.log('✅ Payment system migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Payment system migration failed:', error);
    process.exit(1);
  }
}

runPaymentMigration();
