
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useMediaEntries, MediaEntry } from '@/hooks/useMediaEntries';
import { useCategories } from '@/hooks/useCategories';
import { Plus } from 'lucide-react';
import { MediaEntryFormFields } from '@/components/MediaEntryFormFields';

const formSchema = z.object({
  title: z.string().max(200, 'Title must be less than 200 characters').optional(),
  category_id: z.string().optional(),
  url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  description: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  tags: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof formSchema>;
type FormMode = 'create' | 'edit';

interface MediaEntryFormProps {
  entry?: MediaEntry;
  onSuccess?: () => void;
  mode?: FormMode;
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

  const isSubmitting = mode === 'edit' ? updateEntry.isPending : createEntry.isPending;

  return (
    <div className={mode === 'edit' ? '' : 'w-full max-w-2xl mx-auto'}>
      {mode === 'create' ? (
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
                <MediaEntryFormFields
                  form={form}
                  categories={categories}
                  categoriesLoading={categoriesLoading}
                  tags={tags}
                  setTags={setTags}
                  rating={rating}
                  setRating={setRating}
                  description={description}
                  setDescription={setDescription}
                  isScrapingUrl={isScrapingUrl}
                  isSubmitting={isSubmitting}
                  mode={mode}
                />
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <MediaEntryFormFields
              form={form}
              categories={categories}
              categoriesLoading={categoriesLoading}
              tags={tags}
              setTags={setTags}
              rating={rating}
              setRating={setRating}
              description={description}
              setDescription={setDescription}
              isScrapingUrl={isScrapingUrl}
              isSubmitting={isSubmitting}
              mode={mode}
            />
          </form>
        </Form>
      )}
    </div>
  );
}
