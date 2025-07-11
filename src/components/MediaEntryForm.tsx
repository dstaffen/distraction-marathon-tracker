
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { StarRating } from '@/components/StarRating';
import { TagsInput } from '@/components/TagsInput';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { useMediaEntries, MediaEntry } from '@/hooks/useMediaEntries';
import { useCategories } from '@/hooks/useCategories';
import { Plus, Save, Loader2, Edit } from 'lucide-react';

const formSchema = z.object({
  title: z.string().max(200, 'Title must be less than 200 characters').optional(),
  category_id: z.string().optional(),
  url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  description: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  tags: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface MediaEntryFormProps {
  entry?: MediaEntry;
  onSuccess?: () => void;
  mode?: 'create' | 'edit';
}

export function MediaEntryForm({ entry, onSuccess, mode = 'create' }: MediaEntryFormProps) {
  const { createEntry, updateEntry } = useMediaEntries();
  const { categories, isLoading: categoriesLoading } = useCategories();
  const [tags, setTags] = useState<string[]>(entry?.tags || []);
  const [rating, setRating] = useState(entry?.rating || 0);
  const [isScrapingUrl, setIsScrapingUrl] = useState(false);
  const [description, setDescription] = useState(entry?.description || '');

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: entry?.title || '',
      category_id: entry?.category_id || '',
      url: entry?.url || '',
      description: entry?.description || '',
      rating: entry?.rating || undefined,
      tags: entry?.tags || [],
    },
  });

  // Auto-save draft functionality (only for create mode)
  useEffect(() => {
    if (mode === 'create') {
      const subscription = form.watch((value) => {
        const draftData = {
          ...value,
          description,
          tags,
          rating: rating || undefined,
        };
        localStorage.setItem('media-entry-draft', JSON.stringify(draftData));
      });
      return () => subscription.unsubscribe();
    }
  }, [form, tags, rating, description, mode]);

  // Load draft on mount (only for create mode)
  useEffect(() => {
    if (mode === 'create') {
      const draft = localStorage.getItem('media-entry-draft');
      if (draft) {
        try {
          const draftData = JSON.parse(draft);
          form.reset(draftData);
          setTags(draftData.tags || []);
          setRating(draftData.rating || 0);
          setDescription(draftData.description || '');
        } catch (error) {
          console.error('Failed to load draft:', error);
        }
      }
    }
  }, [form, mode]);

  // Function to scrape page title from URL
  const scrapePageTitle = async (url: string) => {
    try {
      setIsScrapingUrl(true);
      // For now, we'll use a simple approach. In a real app, you'd want to use a backend service
      // to avoid CORS issues. This is a basic implementation that might not work for all sites.
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      
      if (data.contents) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.contents, 'text/html');
        const title = doc.querySelector('title')?.textContent;
        
        if (title) {
          form.setValue('title', title.trim());
        }
      }
    } catch (error) {
      console.error('Failed to scrape page title:', error);
    } finally {
      setIsScrapingUrl(false);
    }
  };

  // Watch for URL changes to auto-scrape title
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'url' && value.url && value.url.startsWith('http') && !value.title) {
        scrapePageTitle(value.url);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = async (data: FormData) => {
    try {
      const submitData = {
        title: data.title || '',
        tags: tags.length > 0 ? tags : undefined,
        rating: rating || undefined,
        url: data.url || undefined,
        description: description || undefined,
        category_id: data.category_id || undefined,
      };

      if (mode === 'edit' && entry) {
        await updateEntry.mutateAsync({ id: entry.id, ...submitData });
      } else {
        await createEntry.mutateAsync(submitData);
      }
      
      // Clear form and draft (only for create mode)
      if (mode === 'create') {
        form.reset();
        setTags([]);
        setRating(0);
        setDescription('');
        localStorage.removeItem('media-entry-draft');
      }
      
      onSuccess?.();
    } catch (error) {
      console.error(`Failed to ${mode} entry:`, error);
    }
  };

  const suggestedTags = [
    'movie', 'book', 'article', 'video', 'podcast', 'documentary', 
    'tutorial', 'review', 'entertainment', 'educational', 'inspiring',
    'funny', 'action', 'drama', 'comedy', 'horror', 'sci-fi', 'romance'
  ];

  const isSubmitting = mode === 'edit' ? updateEntry.isPending : createEntry.isPending;

  return (
    <div className={mode === 'edit' ? '' : 'w-full max-w-2xl mx-auto'}>
      {mode === 'create' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Media Entry
            </CardTitle>
            <CardDescription>
              Save and organize your media discoveries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    Rate this media from 1 to 5 stars
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
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
      
      {mode === 'edit' && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                Rate this media from 1 to 5 stars
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
          </form>
        </Form>
      )}
    </div>
  );
}
