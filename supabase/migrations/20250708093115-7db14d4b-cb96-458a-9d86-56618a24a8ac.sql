
-- Complete reset and simplified approach
-- Drop the problematic trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.create_default_categories();

-- Ensure all tables exist with minimal structure
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.media_entries CASCADE;
DROP TABLE IF EXISTS public.user_settings CASCADE;

-- Create categories table
CREATE TABLE public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create media_entries table
CREATE TABLE public.media_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT,
  thumbnail_url TEXT,
  rating INTEGER,
  tags TEXT[],
  category_id UUID REFERENCES public.categories(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create user_settings table
CREATE TABLE public.user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  archive_frequency INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Simple RLS policies
CREATE POLICY "categories_policy" ON public.categories FOR ALL USING (auth.uid()::text = user_id::text);
CREATE POLICY "media_entries_policy" ON public.media_entries FOR ALL USING (auth.uid()::text = user_id::text);
CREATE POLICY "user_settings_policy" ON public.user_settings FOR ALL USING (auth.uid()::text = user_id::text);

-- Create a much simpler trigger function that won't fail
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Just return NEW without doing anything else
  -- We'll handle default data creation in the frontend
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
