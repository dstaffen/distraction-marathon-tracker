import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface MediaEntry {
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

export interface CreateMediaEntryData {
  title?: string;
  description?: string;
  url?: string;
  rating?: number | null;
  tags?: string[];
  category_id?: string;
}

export function useMediaEntries() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: entries = [], isLoading, error } = useQuery({
    queryKey: ['media-entries'],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('media_entries')
        .select(`
          *,
          categories(name, color)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const createEntry = useMutation({
    mutationFn: async (entryData: CreateMediaEntryData) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('media_entries')
        .insert({
          ...entryData,
          title: entryData.title || '',
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media-entries'] });
      toast({
        title: "Success",
        description: "Media entry created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateEntry = useMutation({
    mutationFn: async ({ id, ...entryData }: { id: string } & CreateMediaEntryData) => {
      if (!user) throw new Error('User not authenticated');
      
      const updateData: any = {
        ...entryData,
        updated_at: new Date().toISOString(),
      };

      console.log('Updating entry with data:', updateData);
      console.log('Entry ID:', id);

      const { data, error } = await supabase
        .from('media_entries')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .maybeSingle();

      if (error) {
        console.error('Update error:', error);
        throw error;
      }
      
      if (!data) {
        throw new Error('Entry not found or you do not have permission to update it');
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media-entries'] });
      toast({
        title: "Success",
        description: "Media entry updated successfully",
      });
    },
    onError: (error: any) => {
      console.error('Update mutation error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteEntry = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('media_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media-entries'] });
      toast({
        title: "Success",
        description: "Media entry deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    entries,
    isLoading,
    error,
    createEntry,
    updateEntry,
    deleteEntry,
  };
}
