import { useState } from "react";
import { Button } from "./button";
import { Badge } from "./badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { useLanguage } from "@/lib/useLanguage";
import { Plus, Star, Clock, Minus, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { MenuItem, PortionOption, calculatePortionPrice } from "@/data/menuData";

interface ProductCardProps extends MenuItem {
  className?: string;
  onAddToCart?: (productId: string, quantity: number, selectedPortion: PortionOption, finalPrice: number) => void;
}

export const ProductCard = ({
  id,
  name,
  nameAr,
  description,
  descriptionAr,
  basePrice,
  imageUrl,
  category,
  categoryAr,
  rating,
  preparationTime,
  preparationTimeAr,
  isVegetarian,
  isSpicy,
  allergens = [],
  allergensAr = [],
  portionOptions,
  className,
  onAddToCart
}: ProductCardProps) => {
  const { isRTL, t } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const [selectedPortion, setSelectedPortion] = useState<PortionOption>(portionOptions[0]);

  const displayName = isRTL ? nameAr : name;
  const displayDescription = isRTL ? descriptionAr : description;
  const displayCategory = isRTL ? categoryAr : category;
  const displayPreparationTime = isRTL ? preparationTimeAr : preparationTime;
  const displayAllergens = isRTL ? allergensAr : allergens;

  // Calculate the current price based on selected portion
  const currentPrice = calculatePortionPrice(basePrice, selectedPortion);

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  const handlePortionChange = (value: string) => {
    const portion = portionOptions.find(p => p.size === value);
    if (portion) {
      setSelectedPortion(portion);
    }
  };

  const handleAddToCart = () => {
    onAddToCart?.(id, quantity, selectedPortion, currentPrice);
  };

  return (
    <div className={cn(
      "group relative overflow-hidden rounded-2xl bg-white shadow-soft hover:shadow-soft-lg transition-all duration-300 border border-sable-200",
      className
    )}>
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={imageUrl}
          alt={displayName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Badges */}
        <div className={cn(
          "absolute top-3 flex flex-col gap-2",
          isRTL ? "right-3" : "left-3"
        )}>
          <Badge variant="secondary" className="bg-sable text-nuit-800 text-xs">
            {displayCategory}
          </Badge>
          {isVegetarian && (
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
              🌱
            </Badge>
          )}
          {isSpicy && (
            <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
              🌶️
            </Badge>
          )}
        </div>
        
        {/* Price Badge */}
        <div className={cn(
          "absolute top-3",
          isRTL ? "left-3" : "right-3"
        )}>
          <Badge className="bg-terracotta text-white font-bold">
            {currentPrice} MAD
          </Badge>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Rating and Time */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-safran text-safran" />
            <span className="text-sm font-medium text-nuit-700">{rating}</span>
          </div>
          <div className="flex items-center gap-1 text-nuit-600">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{displayPreparationTime}</span>
          </div>
        </div>

        {/* Name */}
        <h3 className={cn(
          "font-display text-lg font-semibold text-nuit-900 mb-2 line-clamp-2",
          isRTL ? "text-right font-cairo" : "text-left"
        )}>
          {displayName}
        </h3>

        {/* Description */}
        <p className={cn(
          "text-nuit-600 text-sm mb-4 line-clamp-2",
          isRTL ? "text-right font-cairo" : "text-left"
        )}>
          {displayDescription}
        </p>

        {/* Portion Selection */}
        <div className="mb-4">
          <label className={cn(
            "text-sm font-medium text-nuit-700 mb-2 block",
            isRTL ? "text-right" : "text-left"
          )}>
            <Users className="h-4 w-4 inline mr-1" />
            {isRTL ? "حجم الوجبة:" : "Taille de portion:"}
          </label>
          <Select value={selectedPortion.size} onValueChange={handlePortionChange}>
            <SelectTrigger className={cn(
              "w-full",
              isRTL ? "text-right" : "text-left"
            )}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {portionOptions.map((portion) => (
                <SelectItem 
                  key={portion.size} 
                  value={portion.size}
                  className={cn(isRTL ? "text-right" : "text-left")}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>{isRTL ? portion.sizeAr : portion.sizeFr}</span>
                    <span className="font-semibold text-terracotta ml-2">
                      {calculatePortionPrice(basePrice, portion)} MAD
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedPortion.discount > 0 && (
            <p className="text-xs text-green-600 mt-1">
              {isRTL ? 
                `توفير ${selectedPortion.discount}% للمجموعات` : 
                `Économie de ${selectedPortion.discount}% pour groupes`
              }
            </p>
          )}
        </div>

        {/* Allergens */}
        {displayAllergens.length > 0 && (
          <div className="mb-4">
            <p className={cn(
              "text-xs text-nuit-500 mb-1",
              isRTL ? "text-right" : "text-left"
            )}>
              {isRTL ? "مسببات الحساسية:" : "Allergènes:"}
            </p>
            <div className="flex flex-wrap gap-1">
              {displayAllergens.map((allergen, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs bg-yellow-50 text-yellow-800 border-yellow-200"
                >
                  {allergen}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Quantity and Add to Cart */}
        <div className="flex items-center justify-between">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={decrementQuantity}
              className="h-8 w-8 p-0 rounded-full border-terracotta text-terracotta hover:bg-terracotta hover:text-white"
              disabled={quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="font-medium text-nuit-900 min-w-[2rem] text-center">
              {quantity}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={incrementQuantity}
              className="h-8 w-8 p-0 rounded-full border-terracotta text-terracotta hover:bg-terracotta hover:text-white"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {/* Add to Cart */}
          <Button
            onClick={handleAddToCart}
            size="sm"
            className="bg-terracotta hover:bg-terracotta-600 text-white rounded-lg px-4"
          >
            <Plus className="h-4 w-4 mr-1" />
            {t('common.add')}
          </Button>
        </div>

        {/* Total Price Display */}
        {quantity > 1 && (
          <div className="mt-3 pt-3 border-t border-sable-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-nuit-600">
                {isRTL ? "المجموع:" : "Total:"}
              </span>
              <span className="font-bold text-terracotta">
                {(currentPrice * quantity).toLocaleString()} MAD
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Decorative Element */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-terracotta via-safran to-zellige opacity-20" />
    </div>
  );
};
