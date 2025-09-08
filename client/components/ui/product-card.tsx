import { useState } from "react";
import { Button } from "./button";
import { Badge } from "./badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Plus, Star, Clock, Minus, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product, ProductVariant, calculatePortionPrice } from "@/lib/api";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

interface ProductCardProps {
  product: Product;
  className?: string;
  onAddToCart?: (productId: string, quantity: number, selectedPortion: ProductVariant, finalPrice: number) => void;
}

export const ProductCard = ({
  product,
  className,
  onAddToCart
}: ProductCardProps) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedPortion, setSelectedPortion] = useState<ProductVariant>(
    product.portion_pricing[0] || { name: "Standard", price_modifier: 0, final_price: product.base_price }
  );

  // Calculate the current price based on selected portion
  const currentPrice = calculatePortionPrice(product.base_price, selectedPortion);

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  const handlePortionChange = (value: string) => {
    const portion = product.portion_pricing.find(p => p.name === value);
    if (portion) {
      setSelectedPortion(portion);
    }
  };

  const handleAddToCart = () => {
    onAddToCart?.(product.id, quantity, selectedPortion, currentPrice);
  };

  return (
    <div className={cn(
      "group relative rounded-2xl bg-white/95 supports-[backdrop-filter]:backdrop-blur-sm border border-sable-200 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.15)] hover:shadow-[0_18px_40px_-12px_rgba(0,0,0,0.25)] transition-transform duration-300 hover:-translate-y-1 focus-within:ring-2 focus-within:ring-terracotta/40 h-full md:min-h-[520px] lg:min-h-[540px] flex flex-col",
      className
    )}>
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={product.main_image || "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=800&q=80"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Badge variant="secondary" className="bg-sable text-nuit-800 text-xs">
            {product.category_name}
          </Badge>
          {product.is_vegetarian && (
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
              🌱
            </Badge>
          )}
          {product.is_spicy && (
            <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
              🌶️
            </Badge>
          )}
        </div>

        {/* Price Badge */}
        <div className="absolute top-3 right-3">
          <Badge className="bg-gradient-to-r from-terracotta to-safran text-white font-bold shadow-md rounded-full px-3 py-1">
            {currentPrice} MAD
          </Badge>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-5 flex-1 min-h-0 flex flex-col">
        {/* Rating and Time */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-safran text-safran" />
            <span className="text-sm font-medium text-nuit-700">{product.rating}</span>
            {product.rating_count > 0 && (
              <span className="text-xs text-nuit-500">({product.rating_count})</span>
            )}
          </div>
          <div className="flex items-center gap-1 text-nuit-600">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{product.prep_time_minutes} min</span>
          </div>
        </div>

        {/* Title and Description */}
        <div className="mb-4 flex-1 min-h-[120px]">
          <h3 className="font-semibold text-xl text-nuit-900 mb-2 line-clamp-2 tracking-tight">
            {product.name}
          </h3>
          <p className="text-sm text-nuit-600 line-clamp-3 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Allergens (reserved space to normalize layout) */}
        <div className="mb-4 min-h-[44px]">
          {product.allergens && product.allergens.length > 0 ? (
            <>
              <p className="text-xs text-nuit-500 mb-1">Allergènes:</p>
              <div className="flex flex-wrap gap-2">
                {product.allergens.slice(0, 3).map((allergen, index) => (
                  <Badge key={index} variant="outline" className="text-xs border-sable-200 bg-sable-50">
                    {allergen.name}
                  </Badge>
                ))}
                {product.allergens.length > 3 && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <button type="button" className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold border-sable-200 bg-sable-50 hover:bg-sable-100">
                        +{product.allergens.length - 3}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-64">
                      <p className="text-xs text-nuit-500 mb-2">Tous les allergènes</p>
                      <div className="flex flex-wrap gap-2 max-h-48 overflow-auto">
                        {product.allergens.map((a, i) => (
                          <Badge key={`allergen-full-${i}`} variant="outline" className="text-xs border-sable-200 bg-sable-50">
                            {a.name}
                          </Badge>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </>
          ) : null}
        </div>

        {/* Portion Selection (reserved space) */}
        <div className="mb-4 min-h-[72px]">
          {product.portion_pricing && product.portion_pricing.length > 0 ? (
            <>
              <label className="text-sm font-medium text-nuit-700 mb-2 block">
                Portion
              </label>
              <Select value={selectedPortion.name} onValueChange={handlePortionChange}>
                <SelectTrigger aria-label="Choisir une portion" className="select-trigger rounded-xl border-sable-300 bg-white/60 hover:bg-white/80">
                  <div className="flex items-center justify-between w-full">
                    <span className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4" />
                      {selectedPortion.name}
                    </span>
                    <span className="text-sm font-medium">{selectedPortion.final_price} MAD</span>
                  </div>
                </SelectTrigger>
                <SelectContent className="select-content rounded-xl border-sable-200">
                  {product.portion_pricing.map((portion, idx) => (
                    <SelectItem key={`${product.id}-${portion.name}-${portion.final_price}-${idx}`} value={portion.name} className="select-item rounded-md">
                      <div className="flex items-center justify-between w-full">
                        <span className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          {portion.name}
                        </span>
                        <span className="text-sm font-medium">
                          {portion.final_price} MAD
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          ) : null}
        </div>

        {/* Quantity and Add to Cart */}
        <div className="mt-auto flex items-center gap-3">
          <div className="flex items-center border border-sable-300 rounded-lg">
            <Button
              variant="ghost"
              size="sm"
              onClick={decrementQuantity}
              className="h-8 w-8 p-0 hover:bg-sable-100"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={incrementQuantity}
              className="h-8 w-8 p-0 hover:bg-sable-100"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <Button
            onClick={handleAddToCart}
            aria-label={`Ajouter ${product.name} au panier`} className="flex-1 bg-terracotta hover:bg-terracotta-600 text-white rounded-xl shadow-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter ({currentPrice * quantity} MAD)
          </Button>
        </div>
      </div>
    </div>
  );
};
