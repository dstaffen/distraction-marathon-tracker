
-- Recreate the function with SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.create_default_categories()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER -- This runs with the function creator's privileges
AS $$
BEGIN
    INSERT INTO public.categories (name, color, user_id) VALUES
        ('Books', '#10B981', NEW.id),
        ('Movies', '#8B5CF6', NEW.id),
        ('Videos', '#EF4444', NEW.id),
        ('Articles', '#F59E0B', NEW.id),
        ('Podcasts', '#06B6D4', NEW.id);
    
    INSERT INTO public.user_settings (user_id) VALUES (NEW.id);
    
    RETURN NEW;
EXCEPTION
    WHEN others THEN
        -- Log the error but don't block user creation
        RAISE WARNING 'Error creating default data for user %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$;

-- Create the trigger to automatically create default categories when a user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.create_default_categories();
