import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/StarRating';
import { HighlightText } from '@/components/HighlightText';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { useMediaEntries } from '@/hooks/useMediaEntries';
import { MediaEntryForm } from '@/components/MediaEntryForm';
import { 
  ExternalLink, 
  Calendar, 
  Tag, 
  Archive, 
  Edit, 
  Trash2,
  X,
  Save
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

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
  isArchive?: boolean;
}

export function MediaEntryCard({ entry, searchTerm = '', isArchive = false }: MediaEntryCardProps) {
  const { deleteEntry } = useMediaEntries();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isOld = entry.created_at
    ? formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })
    : null;

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      setIsDeleting(true);
      try {
        await deleteEntry.mutateAsync(entry.id);
      } catch (error) {
        console.error('Failed to delete entry:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleEditSuccess = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Card className="card-warm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Edit Entry</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <MediaEntryForm 
            entry={entry}
            onSuccess={handleEditSuccess}
            mode="edit"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "card-warm group transition-all duration-300 hover:shadow-lg",
      isArchive && "border-warm-amber/30 bg-gradient-to-br from-warm-amber/5 to-background"
    )}>
      {isArchive && (
        <div className="absolute top-2 left-2 z-10">
          <Badge variant="secondary">
            <Archive className="h-3 w-3 mr-1" />
            Archived
          </Badge>
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="line-clamp-1">
              <HighlightText text={entry.title} searchTerm={searchTerm} />
            </CardTitle>
            {entry.categories && (
              <div className="flex items-center gap-2 mt-1">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.categories.color }}
                />
                <div className="text-sm text-muted-foreground">
                  {entry.categories.name}
                </div>
              </div>
            )}
            {entry.url && (
              <a href={entry.url} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:underline flex items-center gap-1">
                <ExternalLink className="h-3 w-3" />
                {new URL(entry.url).hostname}
              </a>
            )}
          </div>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {entry.description && (
          <div className="mt-3">
            <MarkdownRenderer 
              content={entry.description} 
              className="prose-sm max-w-none"
            />
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        {entry.rating && (
          <div className="mb-3">
            <StarRating value={entry.rating} size="sm" />
          </div>
        )}
        {entry.tags && entry.tags.length > 0 && (
          <div className="flex gap-1 items-center mb-2">
            <Tag className="h-3 w-3 text-muted-foreground" />
            <div className="flex gap-1 flex-wrap">
              {entry.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          {isOld ? (
            <span>Added {isOld}</span>
          ) : (
            <span>Added recently</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
