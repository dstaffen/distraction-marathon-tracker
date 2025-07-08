
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MediaEntry } from '@/hooks/useMediaEntries';
import { useDebounce } from '@/hooks/useDebounce';

export interface SearchFilters {
  searchQuery: string;
  categories: string[];
  minRating: number;
  maxRating: number;
  dateFrom: string;
  dateTo: string;
  tags: string[];
}

const defaultFilters: SearchFilters = {
  searchQuery: '',
  categories: [],
  minRating: 1,
  maxRating: 5,
  dateFrom: '',
  dateTo: '',
  tags: [],
};

export function useMediaSearch(entries: MediaEntry[]) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<SearchFilters>(() => ({
    searchQuery: searchParams.get('q') || '',
    categories: searchParams.get('categories')?.split(',').filter(Boolean) || [],
    minRating: Number(searchParams.get('minRating')) || 1,
    maxRating: Number(searchParams.get('maxRating')) || 5,
    dateFrom: searchParams.get('dateFrom') || '',
    dateTo: searchParams.get('dateTo') || '',
    tags: searchParams.get('tags')?.split(',').filter(Boolean) || [],
  }));

  const debouncedSearchQuery = useDebounce(filters.searchQuery, 300);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (debouncedSearchQuery) params.set('q', debouncedSearchQuery);
    if (filters.categories.length) params.set('categories', filters.categories.join(','));
    if (filters.minRating !== 1) params.set('minRating', filters.minRating.toString());
    if (filters.maxRating !== 5) params.set('maxRating', filters.maxRating.toString());
    if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.set('dateTo', filters.dateTo);
    if (filters.tags.length) params.set('tags', filters.tags.join(','));

    setSearchParams(params);
  }, [debouncedSearchQuery, filters.categories, filters.minRating, filters.maxRating, filters.dateFrom, filters.dateTo, filters.tags, setSearchParams]);

  // Filter and search entries
  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      // Search query filter
      if (debouncedSearchQuery) {
        const query = debouncedSearchQuery.toLowerCase();
        const matchesTitle = entry.title.toLowerCase().includes(query);
        const matchesDescription = entry.description?.toLowerCase().includes(query);
        const matchesUrl = entry.url?.toLowerCase().includes(query);
        const matchesTags = entry.tags?.some(tag => tag.toLowerCase().includes(query));
        
        if (!matchesTitle && !matchesDescription && !matchesUrl && !matchesTags) {
          return false;
        }
      }

      // Category filter
      if (filters.categories.length && !filters.categories.includes(entry.category_id || '')) {
        return false;
      }

      // Rating filter
      if (entry.rating && (entry.rating < filters.minRating || entry.rating > filters.maxRating)) {
        return false;
      }

      // Date filter
      if (filters.dateFrom && new Date(entry.created_at) < new Date(filters.dateFrom)) {
        return false;
      }
      if (filters.dateTo && new Date(entry.created_at) > new Date(filters.dateTo + 'T23:59:59')) {
        return false;
      }

      // Tag filter
      if (filters.tags.length && !filters.tags.every(tag => entry.tags?.includes(tag))) {
        return false;
      }

      return true;
    });
  }, [entries, debouncedSearchQuery, filters]);

  // Get search suggestions
  const searchSuggestions = useMemo(() => {
    if (!filters.searchQuery || filters.searchQuery.length < 2) return [];
    
    const query = filters.searchQuery.toLowerCase();
    const suggestions = new Set<string>();
    
    entries.forEach(entry => {
      // Title suggestions
      if (entry.title.toLowerCase().includes(query)) {
        suggestions.add(entry.title);
      }
      
      // Tag suggestions
      entry.tags?.forEach(tag => {
        if (tag.toLowerCase().includes(query)) {
          suggestions.add(tag);
        }
      });
    });
    
    return Array.from(suggestions).slice(0, 5);
  }, [entries, filters.searchQuery]);

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
  };

  const hasActiveFilters = useMemo(() => {
    return (
      filters.searchQuery !== '' ||
      filters.categories.length > 0 ||
      filters.minRating !== 1 ||
      filters.maxRating !== 5 ||
      filters.dateFrom !== '' ||
      filters.dateTo !== '' ||
      filters.tags.length > 0
    );
  }, [filters]);

  return {
    filters,
    filteredEntries,
    searchSuggestions,
    updateFilters,
    clearFilters,
    hasActiveFilters,
  };
}
