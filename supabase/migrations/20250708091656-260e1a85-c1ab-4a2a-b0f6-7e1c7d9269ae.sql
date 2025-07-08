
-- First, let's make sure the trigger function exists and is correct
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

-- Drop the trigger if it exists and recreate it
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger to automatically create default categories when a user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.create_default_categories();
