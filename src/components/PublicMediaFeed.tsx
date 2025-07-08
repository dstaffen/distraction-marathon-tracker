
import React, { useState, useEffect, useMemo, memo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { MediaEntryCard } from '@/components/MediaEntryCard';
import { MediaEntryCardSkeleton } from '@/components/MediaEntryCardSkeleton';
import { SearchBar } from '@/components/SearchBar';
import { FilterPanel } from '@/components/FilterPanel';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plus, BookOpen, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ENTRIES_PER_PAGE = 20;

interface PublicMediaEntry {
  id: string;
  title: string;
  description: string | null;
  url: string | null;
  thumbnail_url: string | null;
  rating: number | null;
  tags: string[] | null;
  category_id: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
  categories?: {
    name: string;
    color: string;
  };
}

export const PublicMediaFeed = memo(function PublicMediaFeed() {
  const { toast } = useToast();
  const [displayedEntries, setDisplayedEntries] = useState(ENTRIES_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Fetch public media entries
  const { data: entries = [], isLoading } = useQuery({
    queryKey: ['public-media-entries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('media_entries')
        .select(`
          *,
          categories(name, color)
        `)
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as PublicMediaEntry[];
    },
  });

  // Fetch public categories
  const { data: categories = [] } = useQuery({
    queryKey: ['public-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Get all available tags for filtering
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    entries.forEach(entry => {
      entry.tags?.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [entries]);

  // Filter entries based on search and filters
  const filteredEntries = useMemo(() => {
    let filtered = entries;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(entry => 
        entry.title.toLowerCase().includes(query) ||
        entry.description?.toLowerCase().includes(query) ||
        entry.tags?.some(tag => tag.toLowerCase().includes(query)) ||
        entry.url?.toLowerCase().includes(query)
      );
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(entry => 
        entry.category_id && selectedCategories.includes(entry.category_id)
      );
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter(entry => 
        entry.tags?.some(tag => selectedTags.includes(tag))
      );
    }

    return filtered;
  }, [entries, searchQuery, selectedCategories, selectedTags]);

  const visibleEntries = useMemo(() => 
    filteredEntries.slice(0, displayedEntries), 
    [filteredEntries, displayedEntries]
  );

  const hasMore = displayedEntries < filteredEntries.length;
  const hasActiveFilters = searchQuery || selectedCategories.length > 0 || selectedTags.length > 0;

  const loadMore = useCallback(async () => {
    setIsLoadingMore(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setDisplayedEntries(prev => prev + ENTRIES_PER_PAGE);
    setIsLoadingMore(false);
    
    toast({
      title: "Loaded more entries",
      description: `Showing ${Math.min(displayedEntries + ENTRIES_PER_PAGE, filteredEntries.length)} of ${filteredEntries.length} entries`,
    });
  }, [displayedEntries, filteredEntries.length, toast]);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedTags([]);
  }, []);

  const updateFilters = useCallback((filters: any) => {
    if (filters.searchQuery !== undefined) setSearchQuery(filters.searchQuery);
    if (filters.categories !== undefined) setSelectedCategories(filters.categories);
    if (filters.tags !== undefined) setSelectedTags(filters.tags);
  }, []);

  // Reset displayed entries when filters change
  useEffect(() => {
    setDisplayedEntries(ENTRIES_PER_PAGE);
  }, [searchQuery, selectedCategories, selectedTags]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="h-10 bg-muted rounded animate-pulse" />
          <div className="h-20 bg-muted rounded animate-pulse" />
        </div>
        <div className="grid gap-4 md:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <MediaEntryCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold mb-4">Public Media Library</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover and explore curated media content from our community
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="space-y-4">
        <SearchBar
          value={searchQuery}
          onChange={(value) => setSearchQuery(value)}
          suggestions={[]}
          placeholder="Search titles, descriptions, tags, or URLs..."
          className="transition-all duration-200 focus-within:shadow-md"
        />
        
        <FilterPanel
          filters={{
            searchQuery,
            categories: selectedCategories,
            tags: selectedTags,
            minRating: 1,
            maxRating: 5,
            dateFrom: '',
            dateTo: '',
          }}
          onFiltersChange={updateFilters}
          onClearFilters={clearFilters}
          categories={categories}
          availableTags={availableTags}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      {/* Results Summary */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between animate-fade-in">
          <div className="text-sm text-muted-foreground">
            Found <span className="font-medium text-foreground">{filteredEntries.length}</span> result{filteredEntries.length !== 1 ? 's' : ''}
            {searchQuery && (
              <span> for "<span className="font-medium text-foreground">{searchQuery}</span>"</span>
            )}
          </div>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear filters
            </Button>
          )}
        </div>
      )}

      {/* Empty States */}
      {entries.length === 0 ? (
        <div className="text-center py-16 animate-fade-in">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
            <BookOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-3">No media entries yet</h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
            This library is currently empty. Check back later for new content!
          </p>
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="text-center py-16 animate-fade-in">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
            <BookOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-3">No results found</h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
            Try adjusting your search terms or filters to find what you're looking for.
          </p>
          <Button onClick={clearFilters} variant="outline" size="lg">
            Clear Filters
          </Button>
        </div>
      ) : (
        <>
          {/* Entry Cards */}
          <div className="grid gap-4 md:gap-6">
            {visibleEntries.map((entry, index) => (
              <div
                key={entry.id}
                className="animate-fade-in"
                style={{ animationDelay: `${(index % ENTRIES_PER_PAGE) * 50}ms` }}
              >
                <MediaEntryCard 
                  entry={entry} 
                  searchTerm={searchQuery}
                />
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center pt-8 animate-fade-in">
              <Button 
                variant="outline" 
                onClick={loadMore}
                disabled={isLoadingMore}
                size="lg"
                className="gap-2 hover:scale-105 transition-all duration-200"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    Load More Entries
                    <span className="text-xs bg-muted px-2 py-1 rounded-full ml-2">
                      {filteredEntries.length - displayedEntries} remaining
                    </span>
                  </>
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
});
