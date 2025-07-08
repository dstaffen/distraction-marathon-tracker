
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Calendar } from 'lucide-react';
import { StarRating } from '@/components/StarRating';
import { MediaEntry } from '@/hooks/useMediaEntries';

interface MediaEntryCardProps {
  entry: MediaEntry;
  isArchive?: boolean;
}

export function MediaEntryCard({ entry, isArchive = false }: MediaEntryCardProps) {
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
    <Card className={`hover:shadow-md transition-shadow ${isArchive ? 'bg-amber-50 border-amber-200' : ''}`}>
      {isArchive && (
        <div className="bg-amber-100 px-4 py-2 border-b border-amber-200">
          <div className="flex items-center gap-2 text-amber-800 text-sm font-medium">
            <Calendar className="h-4 w-4" />
            From the Archives
          </div>
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg leading-tight">
              {entry.url ? (
                <a 
                  href={entry.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-2 group"
                >
                  <span className="truncate">{entry.title}</span>
                  <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </a>
              ) : (
                <span className="truncate">{entry.title}</span>
              )}
            </CardTitle>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            {entry.categories && (
              <Badge 
                variant="secondary" 
                className="text-xs"
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

      <CardContent className="pt-0">
        <div className="space-y-3">
          {entry.rating && (
            <div className="flex items-center gap-2">
              <StarRating value={entry.rating} onChange={() => {}} readonly size="sm" />
              <span className="text-sm text-muted-foreground">({entry.rating}/5)</span>
            </div>
          )}

          {entry.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {truncateDescription(entry.description)}
            </p>
          )}

          {entry.tags && entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {entry.tags.slice(0, 5).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
              {entry.tags.length > 5 && (
                <Badge variant="outline" className="text-xs text-muted-foreground">
                  +{entry.tags.length - 5} more
                </Badge>
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {formatDate(entry.created_at)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
