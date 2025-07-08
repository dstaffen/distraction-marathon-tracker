
import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Calendar } from 'lucide-react';
import { StarRating } from '@/components/StarRating';
import { HighlightText } from '@/components/HighlightText';
import { MediaEntry } from '@/hooks/useMediaEntries';
import { cn } from '@/lib/utils';

interface MediaEntryCardProps {
  entry: MediaEntry;
  isArchive?: boolean;
  searchTerm?: string;
}

export const MediaEntryCard = memo(function MediaEntryCard({ 
  entry, 
  isArchive = false, 
  searchTerm = '' 
}: MediaEntryCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateDescription = (text: string | null, maxLength: number = 150) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <Card className={cn(
      "group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in",
      isArchive ? 'bg-amber-50/50 border-amber-200 hover:bg-amber-50' : 'hover:shadow-md'
    )}>
      {isArchive && (
        <div className="bg-gradient-to-r from-amber-100 to-amber-50 px-4 py-2 border-b border-amber-200">
          <div className="flex items-center gap-2 text-amber-800 text-sm font-medium">
            <Calendar className="h-4 w-4 animate-pulse" />
            <span className="animate-fade-in">From the Archives</span>
          </div>
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors duration-200">
              {entry.url ? (
                <a 
                  href={entry.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-2 group/link"
                >
                  <span className="truncate">
                    <HighlightText text={entry.title} searchTerm={searchTerm} />
                  </span>
                  <ExternalLink className="h-4 w-4 opacity-0 group-hover/link:opacity-100 transition-all duration-200 flex-shrink-0 group-hover/link:translate-x-1" />
                </a>
              ) : (
                <span className="truncate">
                  <HighlightText text={entry.title} searchTerm={searchTerm} />
                </span>
              )}
            </CardTitle>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            {entry.categories && (
              <Badge 
                variant="secondary" 
                className={cn(
                  "text-xs transition-all duration-200 hover:scale-105",
                  "animate-fade-in"
                )}
                style={{ 
                  backgroundColor: entry.categories.color + '20',
                  color: entry.categories.color,
                  borderColor: entry.categories.color + '40'
                }}
              >
                {entry.categories.name}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {entry.rating && (
          <div className="flex items-center gap-2 animate-fade-in">
            <StarRating value={entry.rating} onChange={() => {}} readonly size="sm" />
            <span className="text-sm text-muted-foreground">({entry.rating}/5)</span>
          </div>
        )}

        {entry.description && (
          <p className="text-sm text-muted-foreground leading-relaxed animate-fade-in">
            <HighlightText 
              text={truncateDescription(entry.description)} 
              searchTerm={searchTerm} 
            />
          </p>
        )}

        {entry.tags && entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 animate-fade-in">
            {entry.tags.slice(0, 5).map((tag, index) => (
              <Badge 
                key={tag} 
                variant="outline" 
                className={cn(
                  "text-xs hover:bg-accent transition-colors duration-200",
                  "animate-fade-in"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                #<HighlightText text={tag} searchTerm={searchTerm} />
              </Badge>
            ))}
            {entry.tags.length > 5 && (
              <Badge variant="outline" className="text-xs text-muted-foreground animate-fade-in">
                +{entry.tags.length - 5} more
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <time>{formatDate(entry.created_at)}</time>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
