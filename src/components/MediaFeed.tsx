
import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { MediaEntryCard } from '@/components/MediaEntryCard';
import { MediaEntryCardSkeleton } from '@/components/MediaEntryCardSkeleton';
import { SearchBar } from '@/components/SearchBar';
import { FilterPanel } from '@/components/FilterPanel';
import { useMediaEntries } from '@/hooks/useMediaEntries';
import { useCategories } from '@/hooks/useCategories';
import { useUserSettings } from '@/hooks/useUserSettings';
import { useMediaSearch } from '@/hooks/useMediaSearch';
import { Plus, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function MediaFeed() {
  const navigate = useNavigate();
  const { entries, isLoading } = useMediaEntries();
  const { categories } = useCategories();
  const { archiveFrequency } = useUserSettings();
  const [displayedEntries, setDisplayedEntries] = useState(20);

  const {
    filters,
    filteredEntries,
    searchSuggestions,
    updateFilters,
    clearFilters,
    hasActiveFilters,
  } = useMediaSearch(entries);

  // Get all available tags for the filter panel
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    entries.forEach(entry => {
      entry.tags?.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [entries]);

  // Create a feed with interspersed archive entries
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
      return recentEntries.map(entry => ({ ...entry, isArchive: false }));
    }

    // Intersperse archive entries
    const feed = [];
    let archiveIndex = 0;
    
    for (let i = 0; i < recentEntries.length; i++) {
      feed.push({ ...recentEntries[i], isArchive: false });
      
      // Add archive entry every `archiveFrequency` entries
      if ((i + 1) % archiveFrequency === 0 && archiveIndex < archiveEntries.length) {
        const randomArchiveEntry = archiveEntries[Math.floor(Math.random() * archiveEntries.length)];
        feed.push({ ...randomArchiveEntry, isArchive: true });
        archiveIndex++;
      }
    }

    return feed;
  }, [filteredEntries, archiveFrequency]);

  const loadMore = () => {
    setDisplayedEntries(prev => prev + 20);
  };

  const visibleEntries = feedEntries.slice(0, displayedEntries);
  const hasMore = displayedEntries < feedEntries.length;

  // Reset displayed entries when filters change
  useEffect(() => {
    setDisplayedEntries(20);
  }, [filters]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <MediaEntryCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="space-y-4">
        <SearchBar
          value={filters.searchQuery}
          onChange={(value) => updateFilters({ searchQuery: value })}
          suggestions={searchSuggestions}
          placeholder="Search titles, descriptions, tags, or URLs..."
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
        <div className="text-sm text-muted-foreground">
          Found {filteredEntries.length} result{filteredEntries.length !== 1 ? 's' : ''}
          {filters.searchQuery && ` for "${filters.searchQuery}"`}
        </div>
      )}

      {/* Empty States */}
      {entries.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <BookOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No media entries yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Start building your media library by adding your first entry. Track books, movies, articles, and more!
          </p>
          <Button onClick={() => navigate('/add-entry')} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Your First Entry
          </Button>
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <BookOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No results found</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Try adjusting your search terms or filters to find what you're looking for.
          </p>
          <Button onClick={clearFilters} variant="outline">
            Clear Filters
          </Button>
        </div>
      ) : (
        <>
          {/* Entry Cards */}
          <div className="grid gap-4 md:gap-6">
            {visibleEntries.map((entry, index) => (
              <MediaEntryCard 
                key={`${entry.id}-${entry.isArchive ? 'archive' : 'recent'}-${index}`}
                entry={entry} 
                isArchive={entry.isArchive}
                searchTerm={filters.searchQuery}
              />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center pt-6">
              <Button 
                variant="outline" 
                onClick={loadMore}
                className="gap-2"
              >
                Load More Entries
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
