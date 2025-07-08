
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session ? 'found' : 'none');
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session ? 'session exists' : 'no session');
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const createDefaultData = async (userId: string) => {
    try {
      console.log('Creating default data for user:', userId);
      
      // Create default categories
      const defaultCategories = [
        { name: 'Books', color: '#10B981', user_id: userId },
        { name: 'Movies', color: '#8B5CF6', user_id: userId },
        { name: 'Videos', color: '#EF4444', user_id: userId },
        { name: 'Articles', color: '#F59E0B', user_id: userId },
        { name: 'Podcasts', color: '#06B6D4', user_id: userId }
      ];

      const { error: categoriesError } = await supabase
        .from('categories')
        .insert(defaultCategories);

      if (categoriesError) {
        console.error('Error creating default categories:', categoriesError);
      } else {
        console.log('Default categories created successfully');
      }

      // Create default user settings
      const { error: settingsError } = await supabase
        .from('user_settings')
        .insert({ user_id: userId });

      if (settingsError) {
        console.error('Error creating user settings:', settingsError);
      } else {
        console.log('User settings created successfully');
      }
    } catch (error) {
      console.error('Error in createDefaultData:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('SignIn attempt for:', email);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error('SignIn error:', error);
      throw error;
    }
    console.log('SignIn successful');
  };

  const signUp = async (email: string, password: string) => {
    console.log('SignUp attempt for:', email);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`
      }
    });
    
    if (error) {
      console.error('SignUp error:', error);
      throw error;
    }
    
    console.log('SignUp successful:', data);
    
    // Create default data if user was created
    if (data.user && data.user.id) {
      // Use setTimeout to avoid blocking the signup process
      setTimeout(() => {
        createDefaultData(data.user.id);
      }, 1000);
    }
  };

  const signOut = async () => {
    console.log('SignOut attempt');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('SignOut error:', error);
      throw error;
    }
    console.log('SignOut successful');
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signIn,
      signUp,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
