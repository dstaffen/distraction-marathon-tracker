import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { StarRating } from '@/components/StarRating';
import { TagsInput } from '@/components/TagsInput';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { Button } from '@/components/ui/button';
import { Loader2, Edit, Save } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  color: string;
}

interface FormData {
  title?: string;
  category_id?: string;
  url?: string;
  description?: string;
  rating?: number;
  tags?: string[];
}

interface MediaEntryFormFieldsProps {
  form: UseFormReturn<FormData>;
  categories: Category[];
  categoriesLoading: boolean;
  tags: string[];
  setTags: (tags: string[]) => void;
  rating: number;
  setRating: (rating: number) => void;
  description: string;
  setDescription: (description: string) => void;
  isScrapingUrl: boolean;
  isSubmitting: boolean;
  mode: 'create' | 'edit';
}

export function MediaEntryFormFields({
  form,
  categories,
  categoriesLoading,
  tags,
  setTags,
  rating,
  setRating,
  description,
  setDescription,
  isScrapingUrl,
  isSubmitting,
  mode
}: MediaEntryFormFieldsProps) {
  const suggestedTags = [
    'movie', 'book', 'article', 'video', 'podcast', 'documentary', 
    'tutorial', 'review', 'entertainment', 'educational', 'inspiring',
    'funny', 'action', 'drama', 'comedy', 'horror', 'sci-fi', 'romance'
  ];

  return (
    <>
      <FormField
        control={form.control}
        name="url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>URL</FormLabel>
            <FormControl>
              <Input 
                type="url" 
                placeholder="https://example.com" 
                {...field} 
              />
            </FormControl>
            <FormDescription>
              Link to the media - we'll try to fetch the title automatically
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title {isScrapingUrl && <span className="text-sm text-muted-foreground">(fetching...)</span>}</FormLabel>
            <FormControl>
              <Input placeholder="Enter media title (optional)..." {...field} />
            </FormControl>
            <FormDescription>
              Leave empty to use the scraped title from the URL
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="category_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {categoriesLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading categories...
                  </SelectItem>
                ) : (
                  categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-2">
        <Label>Description / Thoughts</Label>
        <MarkdownEditor
          value={description}
          onChange={setDescription}
          placeholder="What did you think? Any notes or thoughts... (supports markdown formatting)"
        />
        <p className="text-sm text-muted-foreground">
          Share your thoughts, notes, or a brief description. Supports markdown formatting for rich text.
        </p>
      </div>

      <div className="space-y-2">
        <Label>Rating</Label>
        <StarRating
          value={rating}
          onChange={setRating}
          size="lg"
        />
        <p className="text-sm text-muted-foreground">
          {rating > 0 
            ? `Rate this media from 1 to 5 stars (currently ${rating} star${rating === 1 ? '' : 's'}). Click on the current rating or the X to clear.`
            : 'Rate this media from 1 to 5 stars (no rating set)'
          }
        </p>
      </div>

      <div className="space-y-2">
        <Label>Tags</Label>
        <TagsInput
          value={tags}
          onChange={setTags}
          placeholder="Add tags..."
          suggestions={suggestedTags}
        />
        <p className="text-sm text-muted-foreground">
          Add tags to help organize and search your media
        </p>
      </div>

      <div className="flex gap-3 pt-4">
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {mode === 'edit' ? 'Updating...' : 'Saving...'}
            </>
          ) : (
            <>
              {mode === 'edit' ? <Edit className="mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
              {mode === 'edit' ? 'Update Entry' : 'Save Entry'}
            </>
          )}
        </Button>
      </div>
    </>
  );
}
