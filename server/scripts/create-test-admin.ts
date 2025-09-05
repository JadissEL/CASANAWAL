import { db } from '../database/connection';
import bcrypt from 'bcryptjs';

async function createTestAdmin() {
  console.log('🔧 Création d\'un utilisateur admin de test...');

  try {
    // Hash du mot de passe "admin123"
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Créer l'utilisateur admin de test
    await db.query(`
      INSERT INTO admin_users (email, password_hash, full_name, role, is_active)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO UPDATE SET
        password_hash = EXCLUDED.password_hash,
        role = 'super_admin',
        is_active = true
    `, [
      'admin@test.com',
      hashedPassword,
      'Admin Test',
      'super_admin',
      true
    ]);

    console.log('✅ Utilisateur admin de test créé !');
    console.log('');
    console.log('🎯 CONNEXION AU DASHBOARD :');
    console.log('==========================');
    console.log('🌐 URL      : http://localhost:8084/admin/login');
    console.log('👤 Email    : admin@test.com');
    console.log('🔒 Mot de passe : admin123');
    console.log('');
    console.log('📦 Pour gérer les repas : /admin/products');
    console.log('💳 Pour gérer les paiements : /admin/payments');

  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

createTestAdmin().then(() => process.exit(0));
