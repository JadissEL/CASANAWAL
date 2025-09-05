import { Client } from 'pg';

async function checkPostgresAccess() {
  console.log('🔍 Checking PostgreSQL access...');

  // Try connecting without password first
  const clientNoPass = new Client({
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    ssl: false
  });

  try {
    console.log('1. Trying connection without password...');
    await clientNoPass.connect();
    console.log('✅ Connected without password!');

    // Reset the password
    await clientNoPass.query("ALTER USER postgres PASSWORD 'XCDXCD963j3j+.1';");
    console.log('✅ Password reset successfully!');

    await clientNoPass.end();

    // Now test with password
    console.log('2. Testing connection with new password...');
    const clientWithPass = new Client({
      host: 'localhost',
      port: 5432,
      database: 'postgres',
      user: 'postgres',
      password: 'XCDXCD963j3j+.1',
      ssl: false
    });

    await clientWithPass.connect();
    console.log('✅ Password authentication working!');

    // Check if casanawal database exists
    const result = await clientWithPass.query(`
      SELECT datname FROM pg_database
      WHERE datname = 'casanawal';
    `);

    if (result.rows.length > 0) {
      console.log('✅ Database "casanawal" exists!');
    } else {
      console.log('⚠️ Database "casanawal" not found, creating it...');
      await clientWithPass.query('CREATE DATABASE casanawal;');
      console.log('✅ Database "casanawal" created!');
    }

    await clientWithPass.end();

  } catch (error) {
    console.error('❌ Connection failed:', error.message);

    if (error.message.includes('password authentication failed')) {
      console.log('\n🔧 Solutions:');
      console.log('1. Reset PostgreSQL password manually in pgAdmin');
      console.log('2. Or use a different database user');
      console.log('3. Or reinstall PostgreSQL with known password');
    }
  }
}

checkPostgresAccess();
