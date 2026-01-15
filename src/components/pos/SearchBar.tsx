import { Search, Barcode, Keyboard } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onBarcodeClick?: () => void;
}

export const SearchBar = ({ value, onChange, onBarcodeClick }: SearchBarProps) => {
  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search products by name or SKU..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10 h-12 bg-card border-border/50 focus:border-primary text-base"
        />
        <Keyboard className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
      </div>
      <Button
        variant="outline"
        size="iconLg"
        className="shrink-0"
        onClick={onBarcodeClick}
      >
        <Barcode className="w-5 h-5" />
      </Button>
    </div>
  );
};
