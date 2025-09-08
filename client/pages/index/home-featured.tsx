import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ui/product-card";
import { DataLoadingState, RefetchIndicator } from "@/components/shared/LoadingSpinner";
import { ArrowRight } from "lucide-react";
import { Product, ProductVariant } from "@/lib/api";

interface HomeFeaturedProps {
  products: Product[];
  loading: boolean;
  onAddToCart: (productId: string, quantity: number, selectedPortion: ProductVariant, finalPrice: number) => void;
}

export const HomeFeatured = ({ products, loading, onAddToCart }: HomeFeaturedProps) => (
  <motion.section className="py-16 bg-sable-50" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
    <div className="container-standard">
      <div className="text-center mb-12">
        <h2 className="font-display text-3xl md:text-4xl font-extrabold text-nuit-900 mb-3 tracking-tight">Nos Spécialités</h2>
        <p className="text-base md:text-lg text-nuit-600 max-w-2xl mx-auto">Découvrez nos plats les plus populaires, préparés avec des ingrédients frais et des recettes traditionnelles</p>
      </div>
      <DataLoadingState loading={loading} error={null} loadingText="Chargement des spécialités...">
        <RefetchIndicator isRefetching={false}>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.slice(0, 6).map((product) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="h-full">
                <ProductCard product={product} onAddToCart={onAddToCart} />
              </motion.div>
            ))}
          </div>
        </RefetchIndicator>
      </DataLoadingState>
      <div className="text-center mt-12">
        <Button asChild size="lg" variant="outline" className="border-terracotta text-terracotta hover:bg-terracotta hover:text-white px-8 py-4 text-base md:text-lg rounded-2xl">
          <Link to="/menu">Voir Tout le Menu<ArrowRight className="ml-2 h-5 w-5" /></Link>
        </Button>
      </div>
    </div>
  </motion.section>
);
