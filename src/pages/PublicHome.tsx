
import React from 'react';
import { Button } from '@/components/ui/button';
import { Book, LogIn } from 'lucide-react';
import { PublicMediaFeed } from '@/components/PublicMediaFeed';
import { useNavigate } from 'react-router-dom';

const PublicHome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <Book className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">Marathon of Distraction</span>
          </div>
          
          <Button onClick={() => navigate('/login')} variant="default" size="sm" className="gap-2">
            <LogIn className="h-4 w-4" />
            Sign In
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <PublicMediaFeed />
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Marathon of Distraction. Discover and organize your media collection.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicHome;
