
import React, { useState, useEffect, useMemo, memo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { MediaEntryCard } from '@/components/MediaEntryCard';
import { MediaEntryCardSkeleton } from '@/components/MediaEntryCardSkeleton';
import { SearchBar } from '@/components/SearchBar';
import { FilterPanel } from '@/components/FilterPanel';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useMediaEntries } from '@/hooks/useMediaEntries';
import { useCategories } from '@/hooks/useCategories';
import { useUserSettings } from '@/hooks/useUserSettings';
import { useMediaSearch } from '@/hooks/useMediaSearch';
import { Plus, BookOpen, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const ENTRIES_PER_PAGE = 20;

export const MediaFeed = memo(function MediaFeed() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { entries, isLoading } = useMediaEntries();
  const { categories } = useCategories();
  const { archiveFrequency } = useUserSettings();
  const [displayedEntries, setDisplayedEntries] = useState(ENTRIES_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const {
    filters,
    filteredEntries,
    searchSuggestions,
    updateFilters,
    clearFilters,
    hasActiveFilters,
  } = useMediaSearch(entries);

  // Get all available tags for the filter panel (memoized)
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    entries.forEach(entry => {
      entry.tags?.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [entries]);

  // Create a feed with interspersed archive entries (memoized)
  const feedEntries = useMemo(() => {
    if (!filteredEntries || filteredEntries.length === 0) return [];

    const sortedEntries = [...filteredEntries].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    // Get recent entries (last 30 days) and archive entries (older than 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentEntries = sortedEntries.filter(entry => 
      new Date(entry.created_at) > thirtyDaysAgo
    );
    
    const archiveEntries = sortedEntries.filter(entry => 
      new Date(entry.created_at) <= thirtyDaysAgo
    );

    if (archiveEntries.length === 0) {
      return recentEntries;
    }

    // Intersperse archive entries
    const feed = [];
    let archiveIndex = 0;
    
    for (let i = 0; i < recentEntries.length; i++) {
      feed.push(recentEntries[i]);
      
      // Add archive entry every `archiveFrequency` entries
      if ((i + 1) % archiveFrequency === 0 && archiveIndex < archiveEntries.length) {
        const randomArchiveEntry = archiveEntries[Math.floor(Math.random() * archiveEntries.length)];
        feed.push(randomArchiveEntry);
        archiveIndex++;
      }
    }

    return feed;
  }, [filteredEntries, archiveFrequency]);

  const loadMore = useCallback(async () => {
    setIsLoadingMore(true);
    // Simulate loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    setDisplayedEntries(prev => prev + ENTRIES_PER_PAGE);
    setIsLoadingMore(false);
    
    toast({
      title: "Loaded more entries",
      description: `Showing ${Math.min(displayedEntries + ENTRIES_PER_PAGE, feedEntries.length)} of ${feedEntries.length} entries`,
    });
  }, [displayedEntries, feedEntries.length, toast]);

  const visibleEntries = useMemo(() => 
    feedEntries.slice(0, displayedEntries), 
    [feedEntries, displayedEntries]
  );
  
  const hasMore = displayedEntries < feedEntries.length;

  // Reset displayed entries when filters change
  useEffect(() => {
    setDisplayedEntries(ENTRIES_PER_PAGE);
  }, [filters]);

  const handleAddEntry = useCallback(() => {
    navigate('/add-entry');
  }, [navigate]);

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
      {/* Search and Filter Controls */}
      <div className="space-y-4">
        <SearchBar
          value={filters.searchQuery}
          onChange={(value) => updateFilters({ searchQuery: value })}
          suggestions={searchSuggestions}
          placeholder="Search titles, descriptions, tags, or URLs... (⌘K)"
          className="transition-all duration-200 focus-within:shadow-md"
        />
        
        <FilterPanel
          filters={filters}
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
            {filters.searchQuery && (
              <span> for "<span className="font-medium text-foreground">{filters.searchQuery}</span>"</span>
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
            Start building your media library by adding your first entry. Track books, movies, articles, and more!
          </p>
          <Button onClick={handleAddEntry} size="lg" className="gap-2 hover:scale-105 transition-transform">
            <Plus className="h-5 w-5" />
            Add Your First Entry
          </Button>
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
                key={`${entry.id}-${index}`}
                className="animate-fade-in"
                style={{ animationDelay: `${(index % ENTRIES_PER_PAGE) * 50}ms` }}
              >
                <MediaEntryCard 
                  entry={entry}
                  searchTerm={filters.searchQuery}
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
                      {feedEntries.length - displayedEntries} remaining
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
