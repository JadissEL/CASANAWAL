import { db } from "../connection.ts";
import bcrypt from "bcryptjs";

interface AdminUserSeed {
  email: string;
  password: string;
  full_name: string;
  role: 'super_admin' | 'content_manager' | 'order_manager';
  permissions: any;
}

const adminUsers: AdminUserSeed[] = [
  {
    email: 'elantaki.dijadiss@gmail.com',
    password: 'XCDXCD963j3j+.1',
    full_name: 'Dijadiss Elantaki (Super Admin)',
    role: 'super_admin',
    permissions: {
      manage_orders: true,
      manage_products: true,
      manage_users: true,
      manage_settings: true,
      view_analytics: true,
      export_data: true
    }
  },
  {
    email: 'content@casanawal.ma',
    password: 'XCDXCD963j3j+.1',
    full_name: 'Gestionnaire de Contenu',
    role: 'content_manager',
    permissions: {
      manage_products: true,
      manage_categories: true,
      view_analytics: false,
      export_data: false
    }
  },
  {
    email: 'orders@casanawal.ma',
    password: 'XCDXCD963j3j+.1',
    full_name: 'Gestionnaire de Commandes',
    role: 'order_manager',
    permissions: {
      manage_orders: true,
      view_analytics: true,
      export_orders: true,
      manage_payments: true
    }
  }
];

export async function seedAdminUsers() {
  try {
    console.log('🔐 Seeding admin users...');

    // Check if admin users already exist and update them
    const existingUsers = await db.query(
      'SELECT email FROM admin_users'
    );

    if (existingUsers.rows.length > 0) {
      console.log('ℹ️  Admin users exist, updating them...');
      
      // Update existing admin users
      for (const user of adminUsers) {
        const hashedPassword = await bcrypt.hash(user.password, 12);
        
        await db.query(`
          UPDATE admin_users SET 
            password_hash = $1,
            full_name = $2,
            role = $3,
            permissions = $4,
            updated_at = NOW()
          WHERE email = $5
        `, [hashedPassword, user.full_name, user.role, JSON.stringify(user.permissions), user.email]);
        
        // If user doesn't exist, insert it
        const userExists = await db.query('SELECT id FROM admin_users WHERE email = $1', [user.email]);
        if (userExists.rows.length === 0) {
          await db.query(`
            INSERT INTO admin_users (
              email,
              password_hash,
              full_name,
              role,
              permissions,
              is_active
            ) VALUES ($1, $2, $3, $4, $5, $6)
          `, [
            user.email,
            hashedPassword,
            user.full_name,
            user.role,
            JSON.stringify(user.permissions),
            true
          ]);
        }
        
        console.log(`✅ Updated admin user: ${user.email} (${user.role})`);
      }
      return;
    }

    for (const user of adminUsers) {
      const hashedPassword = await bcrypt.hash(user.password, 12);
      
      await db.query(`
        INSERT INTO admin_users (
          email,
          password_hash,
          full_name,
          role,
          permissions,
          is_active
        ) VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        user.email,
        hashedPassword,
        user.full_name,
        user.role,
        JSON.stringify(user.permissions),
        true
      ]);

      console.log(`✅ Created admin user: ${user.email} (${user.role})`);
    }

    console.log('🎉 Admin users seeded successfully!');
    console.log('\n📋 Your admin credentials:');
    console.log('   Email: elantaki.dijadiss@gmail.com');
    console.log('   Password: XCDXCD963j3j+.1');
    console.log('\n✅ Your personal admin account is ready to use!');

  } catch (error) {
    console.error('❌ Error seeding admin users:', error);
    throw error;
  }
}

export async function down() {
  try {
    await db.query('DELETE FROM admin_users');
    console.log('✅ Admin users cleared');
  } catch (error) {
    console.error('❌ Error clearing admin users:', error);
    throw error;
  }
}

// Note: This file is imported by setup-database.ts, not executed directly
