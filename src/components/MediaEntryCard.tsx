
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/StarRating';
import { HighlightText } from '@/components/HighlightText';
import { ExternalLink, Calendar, User, Tag } from 'lucide-react';
import { format } from 'date-fns';

interface MediaEntry {
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

interface MediaEntryCardProps {
  entry: MediaEntry;
  searchTerm?: string;
}

export function MediaEntryCard({ entry, searchTerm = '' }: MediaEntryCardProps) {
  const hasTitle = entry.title && entry.title.trim() !== '';
  const hasUrl = entry.url && entry.url.trim() !== '';

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border/60 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-6 space-y-4">
        {/* Header with title/URL and category */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {hasUrl ? (
              <a
                href={entry.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link flex items-start gap-2 hover:text-primary transition-colors"
              >
                {hasTitle ? (
                  <h3 className="text-lg font-semibold text-foreground group-hover/link:text-primary transition-colors line-clamp-2">
                    <HighlightText text={entry.title} searchTerm={searchTerm} />
                  </h3>
                ) : (
                  <h3 className="text-lg font-semibold text-foreground group-hover/link:text-primary transition-colors line-clamp-2">
                    <HighlightText text={entry.url} searchTerm={searchTerm} />
                  </h3>
                )}
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover/link:text-primary transition-colors flex-shrink-0 mt-1" />
              </a>
            ) : hasTitle ? (
              <h3 className="text-lg font-semibold text-foreground line-clamp-2">
                <HighlightText text={entry.title} searchTerm={searchTerm} />
              </h3>
            ) : (
              <h3 className="text-lg font-semibold text-muted-foreground italic">
                Untitled Entry
              </h3>
            )}
          </div>
          
          {entry.categories && (
            <Badge 
              variant="secondary" 
              className="flex-shrink-0"
              style={{ 
                backgroundColor: `${entry.categories.color}20`,
                borderColor: entry.categories.color,
                color: entry.categories.color
              }}
            >
              {entry.categories.name}
            </Badge>
          )}
        </div>

        {/* Rating */}
        {entry.rating && (
          <div className="flex items-center gap-2">
            <StarRating value={entry.rating} readOnly size="sm" />
            <span className="text-sm text-muted-foreground">({entry.rating}/5)</span>
          </div>
        )}

        {/* Description */}
        {entry.description && (
          <div className="prose prose-sm max-w-none text-muted-foreground">
            <p className="line-clamp-3">
              <HighlightText text={entry.description} searchTerm={searchTerm} />
            </p>
          </div>
        )}

        {/* Tags */}
        {entry.tags && entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Tag className="h-3 w-3 text-muted-foreground mt-1" />
            <div className="flex flex-wrap gap-1">
              {entry.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs px-2 py-0.5">
                  <HighlightText text={tag} searchTerm={searchTerm} />
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Footer with metadata */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/40">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{format(new Date(entry.created_at), 'MMM d, yyyy')}</span>
            </div>
          </div>
          
          {hasUrl && !hasTitle && (
            <div className="text-xs text-muted-foreground">
              <ExternalLink className="h-3 w-3 inline mr-1" />
              External Link
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
