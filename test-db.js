import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
  });

  try {
    console.log('🔄 Testing database connection...');
    console.log(`📍 Connection String: ${process.env.DATABASE_URL}`);
    console.log(`📍 SSL: ${process.env.DB_SSL}`);

    await client.connect();
    console.log('✅ Connection successful!');

    // Test if tables exist
    const result = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log('\n📋 Tables found in database:');
    result.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });

    await client.end();
    console.log('\n🎉 Database test completed successfully!');

  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('Error:', error.message);

    if (error.code === '28P01') {
      console.log('\n🔧 Password authentication failed. Possible solutions:');
      console.log('1. Check if the password in .env is correct');
      console.log('2. Try updating the postgres user password');
      console.log('3. Verify PostgreSQL service is running');
    }

    if (error.code === 'ECONNREFUSED') {
      console.log('\n🔧 Connection refused. Possible solutions:');
      console.log('1. Ensure PostgreSQL service is running');
      console.log('2. Check if port 5432 is available');
    }

    process.exit(1);
  }
}

testConnection();
