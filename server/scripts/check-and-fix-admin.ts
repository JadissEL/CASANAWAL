import { db } from '../database/connection';

async function checkAndFixAdmin() {
  console.log('🔍 Vérification de la structure admin_users...');

  try {
    // Vérifier la structure de la table admin_users
    const columns = await db.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'admin_users' 
      ORDER BY ordinal_position;
    `);
    
    console.log('\n📋 Structure de admin_users:');
    console.table(columns.rows);

    // Vérifier les utilisateurs existants
    const users = await db.query('SELECT email, role, is_active FROM admin_users');
    console.log('\n👥 Utilisateurs admin existants:');
    console.table(users.rows);

    // Mettre à jour avec le bon nom de colonne
    console.log('\n🔧 Mise à jour des permissions...');
    
    const result = await db.query(`
      UPDATE admin_users 
      SET role = 'super_admin', is_active = true
      WHERE email = 'admin@casanawal.com'
      RETURNING email, role, is_active;
    `);

    if (result.rows.length > 0) {
      console.log('✅ Utilisateur admin mis à jour:');
      console.table(result.rows);
    } else {
      console.log('⚠️ Aucun utilisateur trouvé, création...');
      
      await db.query(`
        INSERT INTO admin_users (email, password, first_name, last_name, role, is_active)
        VALUES (
          'admin@casanawal.com',
          '$2b$10$mVZgPVvUABt9YMQfNn7yHOkKJH5.FOqLGH4EhJP7xk9SkpYTFjzNG',
          'Super',
          'Admin',
          'super_admin',
          true
        )
        ON CONFLICT (email) DO UPDATE SET
          role = 'super_admin',
          is_active = true;
      `);
      
      console.log('✅ Utilisateur admin créé');
    }

    console.log('\n🎯 INSTRUCTIONS POUR ACCÉDER AUX FONCTIONNALITÉS :');
    console.log('=================================================');
    console.log('1. 🌐 Aller sur : http://localhost:8084/admin/login');
    console.log('2. 👤 Se connecter avec : admin@casanawal.com / password123');
    console.log('3. 📦 Cliquer sur "Produits" pour gérer les repas');
    console.log('4. 💳 Cliquer sur "Paiements" pour gérer les reçus');
    console.log('');
    console.log('🎯 FONCTIONNALITÉS DISPONIBLES :');
    console.log('📦 Produits : Éditer prix + Ajouter repas + Catégories');
    console.log('💳 Paiements : Voir reçus + Confirmer + Demander nouveau');

  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

checkAndFixAdmin().then(() => process.exit(0));
