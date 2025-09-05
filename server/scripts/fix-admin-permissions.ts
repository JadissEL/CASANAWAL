import { db } from '../database/connection';

async function fixAdminPermissions() {
  console.log('🔧 Correction des permissions admin...');

  try {
    // Vérifier et mettre à jour l'utilisateur admin avec tous les rôles
    const result = await db.query(`
      UPDATE admin_users 
      SET roles = '["super_admin", "content_manager", "order_manager"]'
      WHERE email = 'admin@casanawal.com'
      RETURNING email, roles;
    `);

    if (result.rows.length > 0) {
      console.log('✅ Permissions admin mises à jour :');
      console.log(`   Email: ${result.rows[0].email}`);
      console.log(`   Rôles: ${result.rows[0].roles}`);
    } else {
      console.log('⚠️ Utilisateur admin non trouvé, création...');
      
      // Créer l'utilisateur admin s'il n'existe pas
      await db.query(`
        INSERT INTO admin_users (email, password, first_name, last_name, roles, is_active)
        VALUES (
          'admin@casanawal.com',
          '$2b$10$mVZgPVvUABt9YMQfNn7yHOkKJH5.FOqLGH4EhJP7xk9SkpYTFjzNG', -- password123
          'Super',
          'Admin',
          '["super_admin", "content_manager", "order_manager"]',
          true
        )
        ON CONFLICT (email) DO UPDATE SET
          roles = EXCLUDED.roles,
          is_active = true;
      `);
      
      console.log('✅ Utilisateur admin créé avec tous les rôles');
    }

    console.log('\n🎯 ACCÈS MAINTENANT POSSIBLE À :');
    console.log('📦 Gestion des Produits : http://localhost:8084/admin/products');
    console.log('💳 Gestion des Paiements : http://localhost:8084/admin/payments');
    console.log('📋 Gestion des Commandes : http://localhost:8084/admin/orders');
    console.log('📈 Analytics : http://localhost:8084/admin/analytics');

  } catch (error) {
    console.error('❌ Erreur lors de la correction:', error);
  }
}

fixAdminPermissions().then(() => process.exit(0));
