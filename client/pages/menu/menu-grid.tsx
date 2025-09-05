import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { ProductCard } from "@/components/ui/product-card";
import { itemVariants, containerVariants } from "./menu-animations";
import { Product, ProductVariant } from "@shared/api";

interface MenuGridProps {
  items: Product[];
  onAddToCart: (productId: string, quantity: number, selectedPortion: ProductVariant, finalPrice: number) => void;
}

export const MenuGrid = ({ items, onAddToCart }: MenuGridProps) => (
  <>
    {items.length === 0 ? (
      <motion.div 
        variants={itemVariants}
        className="text-center py-12"
      >
        <div className="text-gray-400 mb-4">
          <Search className="h-16 w-16 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun plat trouvé</h3>
        <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
      </motion.div>
    ) : (
      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((product) => (
          <motion.div key={product.id} variants={itemVariants} className="h-full">
            <ProductCard product={product} onAddToCart={onAddToCart} />
          </motion.div>
        ))}
      </motion.div>
    )}
  </>
);
