import { db } from '../database/connection';

async function finalTest() {
  console.log('🔧 TEST FINAL - Vérification complète...');

  try {
    // Test simple de connectivité
    console.log('1. 🔗 Test connexion base de données...');
    const connectionTest = await db.query('SELECT NOW() as current_time');
    console.log(`   ✅ Connexion OK: ${connectionTest.rows[0].current_time}`);

    // Test produits
    console.log('2. 📦 Test table produits...');
    const products = await db.query('SELECT COUNT(*) as count FROM products');
    console.log(`   ✅ ${products.rows[0].count} produits en base`);

    // Test commandes  
    console.log('3. 📋 Test table commandes...');
    const orders = await db.query('SELECT COUNT(*) as count FROM orders');
    console.log(`   ✅ ${orders.rows[0].count} commandes en base`);

    // Test paiements
    console.log('4. 💳 Test table paiements...');
    const payments = await db.query('SELECT COUNT(*) as count FROM payments');
    console.log(`   ✅ ${payments.rows[0].count} paiements en base`);

    // Test admin users
    console.log('5. 👤 Test utilisateurs admin...');
    const admins = await db.query('SELECT COUNT(*) as count FROM admin_users');
    console.log(`   ✅ ${admins.rows[0].count} admins en base`);

    console.log('\n🎉 TOUS LES TESTS PASSENT !');
    console.log('🚀 Le serveur peut maintenant démarrer...');

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
    process.exit(1);
  }
}

finalTest().then(() => {
  console.log('\n✅ Base de données prête !');
  process.exit(0);
});
