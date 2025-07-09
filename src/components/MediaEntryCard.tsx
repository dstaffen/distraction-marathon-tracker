
import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Calendar, Link, Archive } from 'lucide-react';
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
      .replace(/^# (.*$)/gim, '<h1 class="text-lg font-bold mb-3 text-foreground">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-base font-semibold mb-2 text-foreground">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-sm font-medium mb-2 text-foreground">$1</h3>')
      .replace(/\*\*(.*)\*\*/gim, '<strong class="font-semibold text-foreground">$1</strong>')
      .replace(/\*(.*)\*/gim, '<em class="italic">$1</em>')
      .replace(/!\[([^\]]*)\]\(([^\)]*)\)/gim, '<img alt="$1" src="$2" class="max-w-full h-auto rounded-md my-3 shadow-sm" />')
      .replace(/\[([^\]]*)\]\(([^\)]*)\)/gim, '<a href="$2" class="text-primary hover:underline transition-colors duration-200" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/```([^`]+)```/gim, '<pre class="bg-muted/60 p-3 rounded-md text-sm my-3 overflow-x-auto border border-border/30"><code>$1</code></pre>')
      .replace(/`([^`]+)`/gim, '<code class="bg-muted/60 px-1.5 py-0.5 rounded text-sm border border-border/30">$1</code>')
      .replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-muted-foreground/30 pl-4 italic my-3 text-muted-foreground">$1</blockquote>')
      .replace(/\n\n/gim, '</p><p class="mb-3">')
      .replace(/\n/gim, '<br />');
  };

  // Get category-based styling
  const getCategoryStyles = () => {
    if (!entry.categories) return { borderClass: '', starClass: '', tagClass: '' };
    
    const colorMap: Record<string, { border: string; star: string; tag: string }> = {
      '#8FA68E': { border: 'border-sage', star: 'stars-sage', tag: 'tag-sage' },
      '#D4A5A5': { border: 'border-dusty-rose', star: 'stars-dusty-rose', tag: 'tag-dusty-rose' },
      '#E6B88A': { border: 'border-warm-amber', star: 'stars-warm-amber', tag: 'tag-warm-amber' },
      '#7BA3A3': { border: 'border-muted-teal', star: 'stars-muted-teal', tag: 'tag-muted-teal' },
      '#B19CD9': { border: 'border-soft-plum', star: 'stars-soft-plum', tag: 'tag-soft-plum' },
    };
    
    return colorMap[entry.categories.color] || { border: '', star: '', tag: '' };
  };

  const { borderClass, starClass, tagClass } = getCategoryStyles();

  return (
    <Card className={cn(
      "group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-in overflow-hidden",
      isArchive ? 'archive-card' : 'card-warm hover-glow',
      borderClass
    )}>
      {isArchive && (
        <div className="bg-gradient-to-r from-amber-100/80 to-orange-100/60 px-4 py-2.5 border-b border-amber-200/60">
          <div className="flex items-center gap-2 text-amber-800/90 text-sm font-medium">
            <Archive className="h-4 w-4" />
            <span>From the Archives</span>
          </div>
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors duration-300">
              {entry.url ? (
                <a 
                  href={entry.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 flex items-center gap-2 group/link transition-colors duration-200"
                >
                  <Link className="h-4 w-4 opacity-70 flex-shrink-0" />
                  <span className="truncate">
                    <HighlightText text={entry.title} searchTerm={searchTerm} />
                  </span>
                  <ExternalLink className="h-4 w-4 opacity-0 group-hover/link:opacity-100 transition-all duration-200 flex-shrink-0 group-hover/link:translate-x-0.5" />
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
                  "text-xs font-medium transition-all duration-200 hover:scale-105 border",
                  tagClass
                )}
              >
                {entry.categories.name}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {entry.rating && (
          <div className={cn("flex items-center gap-2 animate-fade-in", starClass)}>
            <StarRating value={entry.rating} onChange={() => {}} readonly size="sm" />
            <span className="text-sm text-muted-foreground font-medium">({entry.rating}/5)</span>
          </div>
        )}

        {entry.description && (
          <div className="text-sm text-muted-foreground leading-relaxed animate-fade-in">
            <div 
              dangerouslySetInnerHTML={{ 
                __html: `<div class="prose prose-sm max-w-none">${renderMarkdown(entry.description)}</div>` 
              }} 
            />
          </div>
        )}

        {entry.tags && entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 animate-fade-in">
            {entry.tags.slice(0, 8).map((tag, index) => (
              <Badge 
                key={tag} 
                variant="outline" 
                className={cn(
                  "text-xs font-normal hover:bg-accent transition-all duration-200 hover:scale-105 border",
                  tagClass
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                #<HighlightText text={tag} searchTerm={searchTerm} />
              </Badge>
            ))}
            {entry.tags.length > 8 && (
              <Badge variant="outline" className="text-xs text-muted-foreground animate-fade-in border-border/50">
                +{entry.tags.length - 8} more
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-border/40">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <time className="font-medium">{formatDate(entry.created_at)}</time>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
