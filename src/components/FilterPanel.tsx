
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { X, Filter } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SearchFilters } from '@/hooks/useMediaSearch';
import { Category } from '@/hooks/useCategories';

interface FilterPanelProps {
  filters: SearchFilters;
  onFiltersChange: (filters: Partial<SearchFilters>) => void;
  onClearFilters: () => void;
  categories: Category[];
  availableTags: string[];
  hasActiveFilters: boolean;
}

export function FilterPanel({
  filters,
  onFiltersChange,
  onClearFilters,
  categories,
  availableTags,
  hasActiveFilters,
}: FilterPanelProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, categoryId]
      : filters.categories.filter(id => id !== categoryId);
    onFiltersChange({ categories: newCategories });
  };

  const handleTagChange = (tag: string, checked: boolean) => {
    const newTags = checked
      ? [...filters.tags, tag]
      : filters.tags.filter(t => t !== tag);
    onFiltersChange({ tags: newTags });
  };

  const removeTag = (tag: string) => {
    onFiltersChange({ tags: filters.tags.filter(t => t !== tag) });
  };

  const removeCategory = (categoryId: string) => {
    onFiltersChange({ categories: filters.categories.filter(id => id !== categoryId) });
  };

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-2">
                    Active
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onClearFilters();
                }}
                disabled={!hasActiveFilters}
              >
                Clear All
              </Button>
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-6">
            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Active Filters:</Label>
                <div className="flex flex-wrap gap-2">
                  {filters.categories.map(categoryId => {
                    const category = categories.find(c => c.id === categoryId);
                    return category ? (
                      <Badge key={categoryId} variant="secondary" className="gap-1">
                        {category.name}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-3 w-3 p-0"
                          onClick={() => removeCategory(categoryId)}
                        >
                          <X className="h-2 w-2" />
                        </Button>
                      </Badge>
                    ) : null;
                  })}
                  {filters.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      #{tag}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-3 w-3 p-0"
                        onClick={() => removeTag(tag)}
                      >
                        <X className="h-2 w-2" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Categories Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Categories</Label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map(category => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={filters.categories.includes(category.id)}
                      onCheckedChange={(checked) => 
                        handleCategoryChange(category.id, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={`category-${category.id}`}
                      className="text-sm cursor-pointer flex items-center gap-2"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Rating Range</Label>
              <div className="px-3">
                <Slider
                  value={[filters.minRating, filters.maxRating]}
                  onValueChange={([min, max]) => 
                    onFiltersChange({ minRating: min, maxRating: max })
                  }
                  max={5}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{filters.minRating} star{filters.minRating !== 1 ? 's' : ''}</span>
                  <span>{filters.maxRating} star{filters.maxRating !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>

            {/* Date Range Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Date Range</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="date-from" className="text-xs text-muted-foreground">From</Label>
                  <Input
                    id="date-from"
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => onFiltersChange({ dateFrom: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="date-to" className="text-xs text-muted-foreground">To</Label>
                  <Input
                    id="date-to"
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => onFiltersChange({ dateTo: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Tags Filter */}
            {availableTags.length > 0 && (
              <div className="space-y-3">
                <Label className="text-sm font-medium">Tags</Label>
                <div className="max-h-32 overflow-y-auto space-y-2">
                  {availableTags.slice(0, 20).map(tag => (
                    <div key={tag} className="flex items-center space-x-2">
                      <Checkbox
                        id={`tag-${tag}`}
                        checked={filters.tags.includes(tag)}
                        onCheckedChange={(checked) => 
                          handleTagChange(tag, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={`tag-${tag}`}
                        className="text-sm cursor-pointer"
                      >
                        #{tag}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
