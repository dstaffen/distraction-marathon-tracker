
-- Make title field nullable in media_entries table
ALTER TABLE public.media_entries 
ALTER COLUMN title DROP NOT NULL;

-- Add a default value for title when it's null
ALTER TABLE public.media_entries 
ALTER COLUMN title SET DEFAULT '';
