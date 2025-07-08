
-- Create a policy to allow public read access to published media entries
-- First, add a 'published' column to media_entries if it doesn't exist
ALTER TABLE public.media_entries 
ADD COLUMN IF NOT EXISTS published boolean DEFAULT true;

-- Create a policy for public read access to published entries
CREATE POLICY "Anyone can view published entries" 
ON public.media_entries 
FOR SELECT 
TO public
USING (published = true);

-- Also allow public read access to categories for the published entries
CREATE POLICY "Anyone can view categories" 
ON public.categories 
FOR SELECT 
TO public
USING (true);
