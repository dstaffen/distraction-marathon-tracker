
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { Category } from "@/hooks/useCategories";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  // Map category colors to gradient classes
  const getColorStyles = (color: string) => {
    const colorMap: Record<string, { 
      gradient: string; 
      border: string;
      shadow: string;
    }> = {
      '#8FA68E': { 
        gradient: 'bg-gradient-to-br from-sage-green/20 to-sage-green/5',
        border: 'border-sage-green/30',
        shadow: 'hover:shadow-sage-green/20'
      },
      '#D4A5A5': { 
        gradient: 'bg-gradient-to-br from-dusty-rose/20 to-dusty-rose/5',
        border: 'border-dusty-rose/30',
        shadow: 'hover:shadow-dusty-rose/20'
      },
      '#E6B88A': { 
        gradient: 'bg-gradient-to-br from-warm-amber/20 to-warm-amber/5',
        border: 'border-warm-amber/30',
        shadow: 'hover:shadow-warm-amber/20'
      },
      '#7BA3A3': { 
        gradient: 'bg-gradient-to-br from-muted-teal/20 to-muted-teal/5',
        border: 'border-muted-teal/30',
        shadow: 'hover:shadow-muted-teal/20'
      },
      '#B19CD9': { 
        gradient: 'bg-gradient-to-br from-soft-plum/20 to-soft-plum/5',
        border: 'border-soft-plum/30',
        shadow: 'hover:shadow-soft-plum/20'
      },
    };
    
    return colorMap[color] || { 
      gradient: 'bg-gradient-to-br from-muted/20 to-muted/5',
      border: 'border-border',
      shadow: 'hover:shadow-md'
    };
  };

  const { gradient, border, shadow } = getColorStyles(category.color);

  return (
    <Card className={cn(
      "transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden",
      gradient,
      border,
      shadow
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-5 h-5 rounded-full border-2 border-white shadow-md flex-shrink-0"
              style={{ backgroundColor: category.color }}
            />
            <CardTitle className="text-lg font-semibold">{category.name}</CardTitle>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(category)}
              className="h-8 w-8 p-0 hover:bg-white/60 transition-colors duration-200"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(category)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-white/60 transition-colors duration-200"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <Badge 
            variant="secondary" 
            className="bg-white/60 text-foreground font-medium shadow-sm"
          >
            {category.entry_count || 0} entries
          </Badge>
          <div className="text-xs text-muted-foreground font-medium">
            {new Date(category.created_at).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
