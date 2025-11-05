import { Badge } from "./ui/badge";
import { X } from "lucide-react";

interface CategoryBadgeProps {
  name: string;
  onRemove?: () => void;
}

const CategoryBadge = ({ name, onRemove }: CategoryBadgeProps) => {
  return (
    <Badge variant="secondary" className="gap-1">
      {name}
      {onRemove && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onRemove();
          }}
          className="ml-1 hover:text-destructive"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </Badge>
  );
};

export default CategoryBadge;