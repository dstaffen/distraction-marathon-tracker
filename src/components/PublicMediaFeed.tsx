
import React, { useState, useEffect, useMemo, memo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { MediaEntryCard } from '@/components/MediaEntryCard';
import { MediaEntryCardSkeleton } from '@/components/MediaEntryCardSkeleton';
import { PublicSidebar } from '@/components/PublicSidebar';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BookOpen, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ENTRIES_PER_PAGE = 20;

interface PublicMediaEntry {
  id: string;
  title: string | null;
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
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

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
        (entry.title && entry.title.toLowerCase().includes(query)) ||
        (entry.description && entry.description.toLowerCase().includes(query)) ||
        (entry.tags && entry.tags.some(tag => tag.toLowerCase().includes(query))) ||
        (entry.url && entry.url.toLowerCase().includes(query))
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

    if (dateFrom) {
      filtered = filtered.filter(entry => 
        new Date(entry.created_at) >= new Date(dateFrom)
      );
    }

    if (dateTo) {
      filtered = filtered.filter(entry => 
        new Date(entry.created_at) <= new Date(dateTo + 'T23:59:59')
      );
    }

    return filtered;
  }, [entries, searchQuery, selectedCategories, selectedTags, dateFrom, dateTo]);

  const visibleEntries = useMemo(() => 
    filteredEntries.slice(0, displayedEntries), 
    [filteredEntries, displayedEntries]
  );

  const hasMore = displayedEntries < filteredEntries.length;
  const hasActiveFilters = Boolean(searchQuery) || selectedCategories.length > 0 || selectedTags.length > 0 || dateFrom || dateTo;

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
    setDateFrom('');
    setDateTo('');
  }, []);

  const handleCategoryChange = useCallback((categoryId: string, checked: string | boolean) => {
    const isChecked = checked === true || checked === 'true';
    setSelectedCategories(prev => 
      isChecked 
        ? [...prev, categoryId]
        : prev.filter(id => id !== categoryId)
    );
  }, []);

  const handleTagChange = useCallback((tag: string, checked: string | boolean) => {
    const isChecked = checked === true || checked === 'true';
    setSelectedTags(prev => 
      isChecked 
        ? [...prev, tag]
        : prev.filter(t => t !== tag)
    );
  }, []);

  // Reset displayed entries when filters change
  useEffect(() => {
    setDisplayedEntries(ENTRIES_PER_PAGE);
  }, [searchQuery, selectedCategories, selectedTags, dateFrom, dateTo]);

  if (isLoading) {
    return (
      <div className="flex">
        <PublicSidebar
          searchQuery=""
          onSearchChange={() => {}}
          selectedCategories={[]}
          onCategoryChange={() => {}}
          selectedTags={[]}
          onTagChange={() => {}}
          dateFrom=""
          dateTo=""
          onDateFromChange={() => {}}
          onDateToChange={() => {}}
          categories={[]}
          availableTags={[]}
          onClearFilters={() => {}}
          hasActiveFilters={false}
        />
        <div className="flex-1 p-8 space-y-6">
          <div className="space-y-4">
            <div className="h-12 bg-muted/40 rounded-xl animate-pulse" />
            <div className="h-6 bg-muted/40 rounded animate-pulse max-w-md" />
          </div>
          <div className="grid gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <MediaEntryCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <PublicSidebar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategories={selectedCategories}
        onCategoryChange={handleCategoryChange}
        selectedTags={selectedTags}
        onTagChange={handleTagChange}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        categories={categories}
        availableTags={availableTags}
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-4xl mx-auto space-y-8 animate-fade-in">
          {/* Header */}
          <div className="text-center py-8 space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-sage-green via-dusty-rose to-warm-amber bg-clip-text text-transparent">
              Public Media Library
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Discover and explore curated media content from Marathon of Distraction. 
              Use the sidebar to search and filter through our collection.
            </p>
          </div>

          {/* Results Summary */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between p-4 bg-card/60 rounded-xl border border-border/40 animate-fade-in">
              <div className="text-sm text-muted-foreground">
                Found <span className="font-semibold text-foreground">{filteredEntries.length}</span> result{filteredEntries.length !== 1 ? 's' : ''}
                {searchQuery && (
                  <span> for "<span className="font-semibold text-foreground">{searchQuery}</span>"</span>
                )}
              </div>
            </div>
          )}

          {/* Empty States */}
          {entries.length === 0 ? (
            <div className="text-center py-20 animate-fade-in">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-sage-green/20 to-dusty-rose/20 rounded-full flex items-center justify-center mb-6 border border-border/40">
                <BookOpen className="h-10 w-10 text-sage-green" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-foreground">No media entries yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                This library is currently empty. Check back later for new curated content!
              </p>
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="text-center py-20 animate-fade-in">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-warm-amber/20 to-muted-teal/20 rounded-full flex items-center justify-center mb-6 border border-border/40">
                <BookOpen className="h-10 w-10 text-warm-amber" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-foreground">No results found</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <Button 
                onClick={clearFilters} 
                variant="outline" 
                size="lg"
                className="hover:bg-warm-amber/10 hover:border-warm-amber/40 transition-colors"
              >
                Clear All Filters
              </Button>
            </div>
          ) : (
            <>
              {/* Entry Cards */}
              <div className="space-y-6">
                {visibleEntries.map((entry, index) => (
                  <div
                    key={entry.id}
                    className="animate-fade-in card-warm hover-lift"
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
                <div className="text-center pt-12 animate-fade-in">
                  <Button 
                    variant="outline" 
                    onClick={loadMore}
                    disabled={isLoadingMore}
                    size="lg"
                    className="gap-3 hover:bg-sage-green/10 hover:border-sage-green/40 hover:scale-105 transition-all duration-300 px-8 py-6 text-base"
                  >
                    {isLoadingMore ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        Load More Entries
                        <span className="text-sm bg-muted/60 px-3 py-1 rounded-full ml-2 font-medium">
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
      </div>
    </div>
  );
});
