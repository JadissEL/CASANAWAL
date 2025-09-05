import { db } from '../database/connection';

async function checkConstraints() {
  try {
    console.log('🔍 Checking order status constraints...');
    
    const constraints = await db.query(`
      SELECT conname, consrc 
      FROM pg_constraint 
      WHERE conname LIKE '%status_check%' OR conname LIKE '%orders%'
    `);
    
    console.log('Available constraints:');
    console.table(constraints.rows);
    
    // Also check what enum values are available
    const enums = await db.query(`
      SELECT t.typname, e.enumlabel 
      FROM pg_type t 
      JOIN pg_enum e ON t.oid = e.enumtypid 
      WHERE t.typname LIKE '%status%'
    `);
    
    console.log('Available enum values:');
    console.table(enums.rows);
    
  } catch (error) {
    console.error('Error checking constraints:', error);
  }
}

checkConstraints().then(() => process.exit(0));
