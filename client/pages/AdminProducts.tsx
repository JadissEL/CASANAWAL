import React from 'react';
import { AdminLayout } from "@/components/ui/admin-layout";

const AdminProducts: React.FC = () => {
  return (
    <AdminLayout>
      <div className="admin-main-content">
        <div className="admin-page-header">
          <h1 className="admin-page-title">Gestion des produits</h1>
          <p className="admin-page-subtitle">Gérez votre menu et vos prix</p>
        </div>
        
        <div className="p-6">
          <p>Page en cours de développement...</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
