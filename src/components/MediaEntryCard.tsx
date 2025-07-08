
import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Calendar, Link } from 'lucide-react';
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

  const renderMarkdown = (text: string) => {
    return text
      .replace(/^# (.*$)/gim, '<h1 class="text-lg font-bold mb-2">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-base font-semibold mb-2">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-sm font-medium mb-1">$1</h3>')
      .replace(/\*\*(.*)\*\*/gim, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*)\*/gim, '<em class="italic">$1</em>')
      .replace(/!\[([^\]]*)\]\(([^\)]*)\)/gim, '<img alt="$1" src="$2" class="max-w-full h-auto rounded my-2" />')
      .replace(/\[([^\]]*)\]\(([^\)]*)\)/gim, '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/```([^`]+)```/gim, '<pre class="bg-muted p-2 rounded text-sm my-2 overflow-x-auto"><code>$1</code></pre>')
      .replace(/`([^`]+)`/gim, '<code class="bg-muted px-1 rounded text-sm">$1</code>')
      .replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-muted pl-3 italic my-2 text-muted-foreground">$1</blockquote>')
      .replace(/\n\n/gim, '</p><p class="mb-2">')
      .replace(/\n/gim, '<br />');
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
                  <Link className="h-4 w-4 opacity-70 flex-shrink-0" />
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
          <div className="text-sm text-muted-foreground leading-relaxed animate-fade-in">
            <div 
              dangerouslySetInnerHTML={{ 
                __html: `<p class="mb-2">${renderMarkdown(entry.description)}</p>` 
              }} 
            />
          </div>
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
