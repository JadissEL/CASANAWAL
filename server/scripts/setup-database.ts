#!/usr/bin/env tsx

import 'dotenv/config';
import { db } from '../database/connection';
import { up as runMigration } from '../database/migrations/001_initial_schema';
import { runSeeders } from '../database/seeders/001_seed_menu_data';
import { seedAdminUsers } from '../database/seeders/002_seed_admin_users';

// Type-safe access to Node.js globals
const nodeProcess = (globalThis as any).process;

async function setupDatabase() {
  console.log('🚀 Setting up CasaNawal database...\n');

  try {
    // Test database connection
    console.log('🔗 Testing database connection...');
    const connected = await db.testConnection();
    if (!connected) {
      throw new Error('Could not connect to database. Please check your configuration.');
    }
    console.log('✅ Database connection successful\n');

    // Run migrations
    console.log('📊 Running database migrations...');
    await runMigration();
    console.log('✅ Migrations completed\n');

    // Run seeders
    console.log('🌱 Seeding initial data...');
    await runSeeders();
    console.log('✅ Menu data seeding completed');
    
    console.log('👤 Seeding admin users...');
    await seedAdminUsers();
    console.log('✅ Admin users seeding completed\n');

    console.log('🎉 Database setup completed successfully!');
    console.log('📋 Summary:');
    console.log('   - Database schema created');
    console.log('   - Menu data migrated from code to database');
    console.log('   - System settings configured');
    console.log('   - Admin user created (email: elantaki.dijadiss@gmail.com)');
    console.log('\n⚠️  IMPORTANT: Change the default admin password in production!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    nodeProcess.exit(1);
  } finally {
    await db.close();
  }
}

// Run setup - this script is executed directly with tsx
setupDatabase();
