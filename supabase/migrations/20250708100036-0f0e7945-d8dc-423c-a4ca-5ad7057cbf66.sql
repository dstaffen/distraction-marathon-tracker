
-- Ensure all tables exist and are properly configured
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name character varying NOT NULL,
  color character varying DEFAULT '#3B82F6',
  user_id uuid,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid,
  archive_frequency integer DEFAULT 10,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.media_entries (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title character varying NOT NULL,
  description text,
  url text,
  thumbnail_url text,
  rating integer,
  tags text[],
  category_id uuid REFERENCES public.categories(id),
  user_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title character varying NOT NULL,
  content text NOT NULL,
  slug character varying,
  published boolean DEFAULT false,
  user_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can view own categories" ON public.categories;
DROP POLICY IF EXISTS "Users can insert own categories" ON public.categories;
DROP POLICY IF EXISTS "Users can update own categories" ON public.categories;
DROP POLICY IF EXISTS "Users can delete own categories" ON public.categories;

DROP POLICY IF EXISTS "Users can view own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can insert own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can update own settings" ON public.user_settings;

DROP POLICY IF EXISTS "Users can view own entries" ON public.media_entries;
DROP POLICY IF EXISTS "Users can insert own entries" ON public.media_entries;
DROP POLICY IF EXISTS "Users can update own entries" ON public.media_entries;
DROP POLICY IF EXISTS "Users can delete own entries" ON public.media_entries;

DROP POLICY IF EXISTS "Users can view own posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Users can insert own posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Users can update own posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Users can delete own posts" ON public.blog_posts;

-- Create RLS policies for categories
CREATE POLICY "Users can view own categories" ON public.categories
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own categories" ON public.categories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categories" ON public.categories
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own categories" ON public.categories
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for user_settings
CREATE POLICY "Users can view own settings" ON public.user_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON public.user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON public.user_settings
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for media_entries
CREATE POLICY "Users can view own entries" ON public.media_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own entries" ON public.media_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own entries" ON public.media_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own entries" ON public.media_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for blog_posts
CREATE POLICY "Users can view own posts" ON public.blog_posts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own posts" ON public.blog_posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts" ON public.blog_posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts" ON public.blog_posts
  FOR DELETE USING (auth.uid() = user_id);

-- Remove any remaining functions that might be causing issues
DROP FUNCTION IF EXISTS public.create_default_categories();
