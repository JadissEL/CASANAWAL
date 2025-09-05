import { useState } from "react";
import { Button } from "./button";
import { Badge } from "./badge";
import { Zap, Clock, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface OfferCardProps {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  discountPrice: number;
  imageUrl: string;
  discount: number;
  rating: number;
  preparationTime: string;
  className?: string;
  onOneClick?: (offerId: string) => Promise<void>;
}

export const OfferCard = ({
  id,
  title,
  description,
  originalPrice,
  discountPrice,
  imageUrl,
  discount,
  rating,
  preparationTime,
  className,
  onOneClick
}: OfferCardProps) => {
  const [isOrdering, setIsOrdering] = useState(false);

  const handleOneClick = async () => {
    if (!onOneClick) return;
    
    setIsOrdering(true);
    try {
      await onOneClick(id);
    } catch (error) {
      console.error('Order failed:', error);
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <div className={cn(
      "group relative overflow-hidden rounded-2xl bg-white shadow-soft hover:shadow-soft-lg transition-all duration-300",
      className
    )}>
      {/* Discount Badge */}
      <div className="absolute top-4 z-10 flex gap-2">
        <div className="rounded-full px-3 py-1.5 left-4">
          <Badge variant="destructive" className="bg-terracotta text-white font-medium">
            -{discount}%
          </Badge>
        </div>
      </div>

      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Rating and Time */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-safran text-safran" />
            <span className="text-sm font-medium text-nuit-700">{rating}</span>
          </div>
          <div className="flex items-center gap-1 text-nuit-600">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{preparationTime}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-display text-xl font-semibold text-nuit-900 mb-2 line-clamp-2 text-left">
          {title}
        </h3>

        {/* Description */}
        <p className="text-nuit-600 text-sm mb-4 line-clamp-2 text-left">
          {description}
        </p>

        {/* Pricing */}
        <div className="flex items-center gap-3 mb-4">
          <span className="font-bold text-xl text-terracotta">
            {discountPrice} MAD
          </span>
          <span className="text-nuit-500 line-through text-sm">
            {originalPrice} MAD
          </span>
        </div>

        {/* One-Click Button */}
        <Button
          onClick={handleOneClick}
          disabled={isOrdering}
          className="w-full bg-terracotta hover:bg-terracotta-600 text-white font-medium py-3 rounded-xl transition-colors duration-200"
        >
          <Zap className="h-4 w-4 mr-2" />
          {isOrdering ? 'Chargement...' : 'Commander en 1 clic'}
        </Button>
      </div>

      {/* Decorative Zellige Pattern */}
      <div className="absolute top-0 right-0 w-16 h-16 zellige-pattern opacity-10 pointer-events-none" />
    </div>
  );
};
