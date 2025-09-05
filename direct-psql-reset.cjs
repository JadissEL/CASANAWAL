const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create SQL file
const sqlContent = `ALTER USER postgres PASSWORD 'XCDXCD963j3j+.1';`;
const sqlFile = path.join(process.env.TEMP, 'reset_password.sql');
fs.writeFileSync(sqlFile, sqlContent);

console.log('🔧 Attempting direct PostgreSQL password reset...');

// Try to run psql directly
const psqlCommand = `"${'C:\\Program Files\\PostgreSQL\\17\\bin\\psql.exe'}" -U postgres -d postgres -f "${sqlFile}"`;
const psql = spawn(psqlCommand, [], {
  stdio: 'inherit',
  shell: true
});

psql.on('close', (code) => {
  console.log(`\n🔄 psql process exited with code ${code}`);

  if (code === 0) {
    console.log('✅ Password reset successful!');
    console.log('🔄 Testing connection...');

    // Test the connection
    const testScript = `
      const { Client } = require('pg');
      const client = new Client({
        host: 'localhost',
        port: 5432,
        database: 'casanawal',
        user: 'postgres',
        password: 'XCDXCD963j3j+.1',
        ssl: false
      });

      client.connect()
        .then(() => {
          console.log('✅ Database connection successful!');
          return client.query('SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = \\'public\\'');
        })
        .then(result => {
          console.log(\`📊 Found \${result.rows[0].table_count} tables in your database!\`);
          process.exit(0);
        })
        .catch(err => {
          console.error('❌ Connection test failed:', err.message);
          process.exit(1);
        });
    `;

    const testFile = path.join(process.env.TEMP, 'test_connection.js');
    fs.writeFileSync(testFile, testScript);

    const nodeTest = spawn('node', [testFile], { stdio: 'inherit' });
    nodeTest.on('close', () => {
      fs.unlinkSync(testFile);
    });

  } else {
    console.log('❌ Direct reset failed. Trying alternative method...');

    // Try using pg_ctl to start in single user mode
    const pgCtlCommand = `"${'C:\\Program Files\\PostgreSQL\\17\\bin\\pg_ctl.exe'}" start -D "${'C:\\Program Files\\PostgreSQL\\17\\data'}" -o "-c listen_addresses=''"`;
    const pgCtl = spawn(pgCtlCommand, [], { stdio: 'inherit', shell: true });

    pgCtl.on('close', () => {
      setTimeout(() => {
        const psqlSingleCommand = `"${'C:\\Program Files\\PostgreSQL\\17\\bin\\psql.exe'}" -U postgres -d postgres -f "${sqlFile}"`;
        const psqlSingle = spawn(psqlSingleCommand, [], { stdio: 'inherit', shell: true });

        psqlSingle.on('close', () => {
          // Stop single user mode
          const pgCtlStopCommand = `"${'C:\\Program Files\\PostgreSQL\\17\\bin\\pg_ctl.exe'}" stop -D "${'C:\\Program Files\\PostgreSQL\\17\\data'}"`;
          const pgCtlStop = spawn(pgCtlStopCommand, [], { stdio: 'inherit', shell: true });

          pgCtlStop.on('close', () => {
            console.log('🔄 Testing final connection...');
            require('child_process').execSync('node test-db.js', { stdio: 'inherit' });
          });
        });
      }, 3000);
    });
  }

  // Cleanup
  fs.unlinkSync(sqlFile);
});

psql.on('error', (err) => {
  console.error('❌ Failed to start psql:', err.message);
});
