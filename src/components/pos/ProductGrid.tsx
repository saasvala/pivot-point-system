import { motion } from 'framer-motion';
import { Product } from '@/types/pos';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProductGridProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
}

export const ProductGrid = ({ products, onProductSelect }: ProductGridProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: index * 0.02 }}
        >
          <Button
            variant="pos"
            className={cn(
              "w-full glass-card group relative overflow-hidden min-h-[100px]",
              product.stock < 10 && "border-warning/50"
            )}
            onClick={() => onProductSelect(product)}
          >
            {/* Product Emoji/Image */}
            <span className="text-3xl mb-1 group-hover:scale-110 transition-transform duration-200">
              {product.image}
            </span>
            
            {/* Product Name */}
            <span className="text-xs font-medium text-foreground line-clamp-2 text-center leading-tight min-h-[32px] flex items-center justify-center">
              {product.name}
            </span>
            
            {/* Price */}
            <span className="text-base font-bold text-primary">
              ${product.price.toFixed(2)}
            </span>
            
            {/* Stock Indicator */}
            {product.stock < 10 && (
              <span className="absolute top-2 right-2 text-[10px] bg-warning/20 text-warning px-1.5 py-0.5 rounded-full">
                {product.stock} left
              </span>
            )}
            
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent" />
            </div>
          </Button>
        </motion.div>
      ))}
    </div>
  );
};
