import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { itemVariants } from "./menu-animations";

interface CategoryOption {
  id: string;
  slug: string;
  name: string;
  icon?: string;
  product_count?: number;
}

interface MenuFiltersProps {
  categories: CategoryOption[];
  selectedCategory: string;
  onChangeCategory: (value: string) => void;
  priceRange: { min: number; max: number };
  onChangePriceRange: (range: { min: number; max: number }) => void;
  showFilters: boolean;
  setShowFilters: (value: boolean) => void;
}

export const MenuFilters = ({
  categories,
  selectedCategory,
  onChangeCategory,
  priceRange,
  onChangePriceRange,
  showFilters,
  setShowFilters
}: MenuFiltersProps) => (
  <motion.aside 
    className="lg:w-80 space-y-6"
    initial="hidden"
    animate="visible"
    variants={itemVariants}
  >
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Filtres</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden"
        >
          {showFilters ? <X className="h-4 w-4" /> : <SlidersHorizontal className="h-4 w-4" />}
        </Button>
      </div>

      <div className={cn("space-y-4", !showFilters && "hidden lg:block")}>        
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Catégorie</label>
          <Select value={selectedCategory} onValueChange={onChangeCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Toutes les catégories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.slug}>
                  <div className="flex items-center gap-2">
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                    <Badge variant="secondary" className="ml-auto">
                      {category.product_count}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Fourchette de prix</label>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) => onChangePriceRange({ ...priceRange, min: Number(e.target.value) })}
                className="w-full"
              />
              <Input
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) => onChangePriceRange({ ...priceRange, max: Number(e.target.value) })}
                className="w-full"
              />
            </div>
            <div className="text-xs text-gray-500">{priceRange.min} - {priceRange.max} DH</div>
          </div>
        </div>
      </div>
    </div>
  </motion.aside>
);


