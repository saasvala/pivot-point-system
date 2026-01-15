import { motion } from 'framer-motion';
import { Category } from '@/types/pos';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CategoryBarProps {
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
}

export const CategoryBar = ({ categories, selectedCategory, onCategorySelect }: CategoryBarProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category, index) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: index * 0.05 }}
        >
          <Button
            variant="posCategory"
            className={cn(
              "min-w-[100px] transition-all duration-200",
              selectedCategory === category.id
                ? "border-primary bg-primary/10 neon-glow-cyan"
                : "hover:border-muted-foreground/30"
            )}
            onClick={() => onCategorySelect(category.id)}
          >
            <span className="text-xl">{category.icon}</span>
            <span className="text-xs whitespace-nowrap">{category.name}</span>
            <span className="text-[10px] text-muted-foreground">{category.productCount} items</span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
};
