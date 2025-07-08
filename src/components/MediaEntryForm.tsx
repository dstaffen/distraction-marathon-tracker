
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { StarRating } from '@/components/StarRating';
import { TagsInput } from '@/components/TagsInput';
import { useMediaEntries } from '@/hooks/useMediaEntries';
import { useCategories } from '@/hooks/useCategories';
import { Plus, Save, Loader2 } from 'lucide-react';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  category_id: z.string().optional(),
  url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  rating: z.number().min(1).max(5).optional(),
  tags: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface MediaEntryFormProps {
  onSuccess?: () => void;
}

export function MediaEntryForm({ onSuccess }: MediaEntryFormProps) {
  const { createEntry } = useMediaEntries();
  const { categories, isLoading: categoriesLoading } = useCategories();
  const [tags, setTags] = useState<string[]>([]);
  const [rating, setRating] = useState(0);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      category_id: '',
      url: '',
      description: '',
      rating: undefined,
      tags: [],
    },
  });

  // Auto-save draft functionality
  useEffect(() => {
    const subscription = form.watch((value) => {
      const draftData = {
        ...value,
        tags,
        rating: rating || undefined,
      };
      localStorage.setItem('media-entry-draft', JSON.stringify(draftData));
    });
    return () => subscription.unsubscribe();
  }, [form, tags, rating]);

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem('media-entry-draft');
    if (draft) {
      try {
        const draftData = JSON.parse(draft);
        form.reset(draftData);
        setTags(draftData.tags || []);
        setRating(draftData.rating || 0);
      } catch (error) {
        console.error('Failed to load draft:', error);
      }
    }
  }, [form]);

  const onSubmit = async (data: FormData) => {
    try {
      const submitData = {
        title: data.title, // Ensure title is always present
        tags: tags.length > 0 ? tags : undefined,
        rating: rating || undefined,
        url: data.url || undefined,
        description: data.description || undefined,
        category_id: data.category_id || undefined,
      };

      await createEntry.mutateAsync(submitData);
      
      // Clear form and draft
      form.reset();
      setTags([]);
      setRating(0);
      localStorage.removeItem('media-entry-draft');
      
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create entry:', error);
    }
  };

  const suggestedTags = [
    'movie', 'book', 'article', 'video', 'podcast', 'documentary', 
    'tutorial', 'review', 'entertainment', 'educational', 'inspiring',
    'funny', 'action', 'drama', 'comedy', 'horror', 'sci-fi', 'romance'
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto">
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
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter media title..." {...field} />
                  </FormControl>
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
                    Link to the media (optional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description / Thoughts</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="What did you think? Any notes or thoughts..."
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Share your thoughts, notes, or a brief description
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                disabled={createEntry.isPending}
                className="flex-1"
              >
                {createEntry.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Entry
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
