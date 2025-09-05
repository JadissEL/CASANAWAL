import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus } from "lucide-react";
import { Product, UpdateMessage } from "./dashboard-types";

interface DashboardProductsProps {
  products: Product[];
  onToggleProduct: (productId: string, isActive: boolean) => void;
  onEditProduct: (product: Product) => void;
}

export const DashboardProducts = ({ products, onToggleProduct, onEditProduct }: DashboardProductsProps) => (
  <div className="admin-card">
    <div className="admin-card-header">
      <div className="admin-card-title flex items-center justify-between">
        📦 Gestion des Produits ({products.length})
        <Button size="sm" className="admin-btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter Produit
        </Button>
      </div>
    </div>
    <div className="admin-card-content">
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {products.map((product) => (
          <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-medium">{product.product_name || product.sku}</h3>
              </div>
              <p className="text-sm text-gray-600">{product.category_name}</p>
              <div className="flex items-center space-x-4 mt-1">
                <p className="text-lg font-bold">{product.base_price} DHS</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={product.is_active ? "default" : "secondary"}>
                {product.is_active ? "Actif" : "Inactif"}
              </Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onToggleProduct(product.id, product.is_active)}
              >
                {product.is_active ? "Désactiver" : "Activer"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEditProduct(product)}
                title="Modifier le produit"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            Aucun produit trouvé dans la base de données
          </p>
        )}
      </div>
    </div>
  </div>
);
