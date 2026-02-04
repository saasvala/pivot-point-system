import { memo } from 'react';
import { motion } from 'framer-motion';
import { Product } from '@/types/pos';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AlertCircle, Check } from 'lucide-react';

interface EnhancedProductGridProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
  cartProductIds?: string[];
}

const ProductCard = memo(({ 
  product, 
  onSelect, 
  isInCart,
  index 
}: { 
  product: Product; 
  onSelect: () => void;
  isInCart: boolean;
  index: number;
}) => {
  const isLowStock = product.stock < 10;
  const isOutOfStock = product.stock === 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.15, delay: Math.min(index * 0.02, 0.2) }}
      className="relative"
    >
      <Button
        variant="ghost"
        className={cn(
          "w-full h-auto min-h-[120px] flex-col gap-1 p-4 rounded-xl",
          "bg-card border-2 border-border/50 shadow-sm",
          "hover:border-primary/50 hover:shadow-lg hover:bg-muted/30",
          "active:scale-[0.97] transition-all duration-150",
          "relative overflow-hidden group",
          isInCart && "border-primary/50 bg-primary/5",
          isLowStock && !isOutOfStock && "border-warning/40",
          isOutOfStock && "opacity-50 cursor-not-allowed"
        )}
        onClick={onSelect}
        disabled={isOutOfStock}
      >
        {/* In Cart Indicator */}
        {isInCart && (
          <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
            <Check className="w-3 h-3 text-primary-foreground" />
          </div>
        )}

        {/* Stock Badge */}
        {isLowStock && !isOutOfStock && (
          <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] bg-warning/20 text-warning px-1.5 py-0.5 rounded-full">
            <AlertCircle className="w-2.5 h-2.5" />
            {product.stock} left
          </div>
        )}

        {isOutOfStock && (
          <div className="absolute top-2 right-2 text-[10px] bg-destructive/20 text-destructive px-1.5 py-0.5 rounded-full">
            Out of stock
          </div>
        )}

        {/* Product Image/Emoji */}
        <div className="text-4xl mb-1 group-hover:scale-110 transition-transform duration-200">
          {product.image}
        </div>
        
        {/* Product Name */}
        <span className="text-xs font-medium text-foreground line-clamp-2 text-center leading-tight min-h-[32px] flex items-center justify-center">
          {product.name}
        </span>
        
        {/* Price */}
        <span className="text-lg font-bold text-primary">
          ${product.price.toFixed(2)}
        </span>

        {/* SKU (subtle) */}
        <span className="text-[10px] text-muted-foreground/60 font-mono">
          {product.sku}
        </span>
        
        {/* Hover Glow Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent" />
        </div>
      </Button>
    </motion.div>
  );
});

ProductCard.displayName = 'ProductCard';

export const EnhancedProductGrid = memo(({ 
  products, 
  onProductSelect,
  cartProductIds = []
}: EnhancedProductGridProps) => {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <div className="text-6xl mb-4 opacity-30">🔍</div>
        <p className="text-lg font-medium">No products found</p>
        <p className="text-sm">Try a different search or category</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          onSelect={() => onProductSelect(product)}
          isInCart={cartProductIds.includes(product.id)}
          index={index}
        />
      ))}
    </div>
  );
});

EnhancedProductGrid.displayName = 'EnhancedProductGrid';
