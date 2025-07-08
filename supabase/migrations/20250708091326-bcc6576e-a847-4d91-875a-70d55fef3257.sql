
-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name VARCHAR NOT NULL,
  color VARCHAR DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for categories
CREATE POLICY "Users can view own categories" 
  ON public.categories 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own categories" 
  ON public.categories 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categories" 
  ON public.categories 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own categories" 
  ON public.categories 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create media_entries table to track category usage
CREATE TABLE public.media_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title VARCHAR NOT NULL,
  description TEXT,
  url TEXT,
  thumbnail_url TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  tags TEXT[],
  category_id UUID REFERENCES public.categories(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for media_entries
ALTER TABLE public.media_entries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for media_entries
CREATE POLICY "Users can view own entries" 
  ON public.media_entries 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own entries" 
  ON public.media_entries 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own entries" 
  ON public.media_entries 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own entries" 
  ON public.media_entries 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create the trigger function to add default categories for new users
CREATE OR REPLACE FUNCTION public.create_default_categories()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO categories (name, color, user_id) VALUES
        ('Books', '#10B981', NEW.id),
        ('Movies', '#8B5CF6', NEW.id),
        ('Videos', '#EF4444', NEW.id),
        ('Articles', '#F59E0B', NEW.id),
        ('Podcasts', '#06B6D4', NEW.id);
    
    INSERT INTO user_settings (user_id) VALUES (NEW.id);
    
    RETURN NEW;
END;
$$;

-- Create trigger to automatically create default categories when a user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.create_default_categories();
