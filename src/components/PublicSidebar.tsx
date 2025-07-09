
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Search, Filter, X, ChevronDown, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  color: string;
}

interface PublicSidebarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategories: string[];
  onCategoryChange: (categoryId: string, checked: boolean) => void;
  selectedTags: string[];
  onTagChange: (tag: string, checked: boolean) => void;
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (date: string) => void;
  onDateToChange: (date: string) => void;
  categories: Category[];
  availableTags: string[];
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function PublicSidebar({
  searchQuery,
  onSearchChange,
  selectedCategories,
  onCategoryChange,
  selectedTags,
  onTagChange,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  categories,
  availableTags,
  onClearFilters,
  hasActiveFilters,
}: PublicSidebarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(true);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);
  const [isTagsOpen, setIsTagsOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);

  const getCategoryColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      '#8FA68E': 'tag-sage',
      '#D4A5A5': 'tag-dusty-rose',
      '#E6B88A': 'tag-warm-amber',
      '#7BA3A3': 'tag-muted-teal',
      '#B19CD9': 'tag-soft-plum',
    };
    return colorMap[color] || 'bg-muted';
  };

  const removeTag = (tag: string) => {
    onTagChange(tag, false);
  };

  const removeCategory = (categoryId: string) => {
    onCategoryChange(categoryId, false);
  };

  return (
    <div className="w-80 h-full bg-sidebar border-r border-sidebar-border overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-sidebar-foreground">Explore Content</h2>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-xs hover:bg-sidebar-accent"
            >
              Clear All
            </Button>
          )}
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-sidebar-foreground">Active Filters:</Label>
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map(categoryId => {
                const category = categories.find(c => c.id === categoryId);
                return category ? (
                  <Badge
                    key={categoryId}
                    variant="secondary"
                    className={cn("gap-1 text-xs", getCategoryColorClass(category.color))}
                  >
                    {category.name}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-3 w-3 p-0 hover:bg-white/20"
                      onClick={() => removeCategory(categoryId)}
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  </Badge>
                ) : null;
              })}
              {selectedTags.map(tag => (
                <Badge key={tag} variant="secondary" className="gap-1 text-xs bg-muted/60">
                  #{tag}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-3 w-3 p-0 hover:bg-white/20"
                    onClick={() => removeTag(tag)}
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Search */}
        <Card className="border-sidebar-border/40 shadow-sm">
          <Collapsible open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-sidebar-accent/50 transition-colors pb-3">
                <CardTitle className="flex items-center justify-between text-base">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-sage-green" />
                    Search
                  </div>
                  <ChevronDown className={cn("h-4 w-4 transition-transform", isSearchOpen && "rotate-180")} />
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search titles, descriptions, or URLs..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10 bg-background/50 border-border/60 focus:border-sage-green/60 transition-colors"
                  />
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Categories */}
        <Card className="border-sidebar-border/40 shadow-sm">
          <Collapsible open={isCategoriesOpen} onOpenChange={setIsCategoriesOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-sidebar-accent/50 transition-colors pb-3">
                <CardTitle className="flex items-center justify-between text-base">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-dusty-rose" />
                    Categories
                    {selectedCategories.length > 0 && (
                      <Badge variant="secondary" className="ml-1 text-xs">
                        {selectedCategories.length}
                      </Badge>
                    )}
                  </div>
                  <ChevronDown className={cn("h-4 w-4 transition-transform", isCategoriesOpen && "rotate-180")} />
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-3">
                {categories.map(category => (
                  <div key={category.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={(checked) => 
                        onCategoryChange(category.id, checked as boolean)
                      }
                      className="data-[state=checked]:bg-sage-green data-[state=checked]:border-sage-green"
                    />
                    <Label
                      htmlFor={`category-${category.id}`}
                      className="text-sm cursor-pointer flex items-center gap-2 flex-1"
                    >
                      <div
                        className="w-3 h-3 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                    </Label>
                  </div>
                ))}
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Tags */}
        {availableTags.length > 0 && (
          <Card className="border-sidebar-border/40 shadow-sm">
            <Collapsible open={isTagsOpen} onOpenChange={setIsTagsOpen}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-sidebar-accent/50 transition-colors pb-3">
                  <CardTitle className="flex items-center justify-between text-base">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-warm-amber/60 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">#</span>
                      </div>
                      Tags
                      {selectedTags.length > 0 && (
                        <Badge variant="secondary" className="ml-1 text-xs">
                          {selectedTags.length}
                        </Badge>
                      )}
                    </div>
                    <ChevronDown className={cn("h-4 w-4 transition-transform", isTagsOpen && "rotate-180")} />
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {availableTags.slice(0, 20).map(tag => (
                      <div key={tag} className="flex items-center space-x-3">
                        <Checkbox
                          id={`tag-${tag}`}
                          checked={selectedTags.includes(tag)}
                          onCheckedChange={(checked) => 
                            onTagChange(tag, checked as boolean)
                          }
                          className="data-[state=checked]:bg-warm-amber data-[state=checked]:border-warm-amber"
                        />
                        <Label
                          htmlFor={`tag-${tag}`}
                          className="text-sm cursor-pointer flex-1"
                        >
                          #{tag}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        )}

        {/* Date Range */}
        <Card className="border-sidebar-border/40 shadow-sm">
          <Collapsible open={isDateOpen} onOpenChange={setIsDateOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-sidebar-accent/50 transition-colors pb-3">
                <CardTitle className="flex items-center justify-between text-base">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-teal" />
                    Date Range
                    {(dateFrom || dateTo) && (
                      <Badge variant="secondary" className="ml-1 text-xs">
                        Active
                      </Badge>
                    )}
                  </div>
                  <ChevronDown className={cn("h-4 w-4 transition-transform", isDateOpen && "rotate-180")} />
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-4">
                <div>
                  <Label htmlFor="date-from" className="text-xs text-muted-foreground mb-2 block">
                    From
                  </Label>
                  <Input
                    id="date-from"
                    type="date"
                    value={dateFrom}
                    onChange={(e) => onDateFromChange(e.target.value)}
                    className="bg-background/50 border-border/60 focus:border-muted-teal/60"
                  />
                </div>
                <div>
                  <Label htmlFor="date-to" className="text-xs text-muted-foreground mb-2 block">
                    To
                  </Label>
                  <Input
                    id="date-to"
                    type="date"
                    value={dateTo}
                    onChange={(e) => onDateToChange(e.target.value)}
                    className="bg-background/50 border-border/60 focus:border-muted-teal/60"
                  />
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      </div>
    </div>
  );
}
