
import React from 'react';
import { Book } from 'lucide-react';
import { PublicMediaFeed } from '@/components/PublicMediaFeed';

const PublicHome = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/40 sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-sage-green to-dusty-rose rounded-xl flex items-center justify-center shadow-sm border border-white/20">
              <Book className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Marathon of Distraction
              </span>
              <p className="text-sm text-muted-foreground font-medium">Curated Media Collection</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <PublicMediaFeed />
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/20 mt-16">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-8 w-8 bg-gradient-to-br from-sage-green to-dusty-rose rounded-lg flex items-center justify-center">
                <Book className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-semibold">Marathon of Distraction</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              Discover and explore curated media content. A thoughtfully organized collection of books, articles, videos, and more.
            </p>
            <div className="text-xs text-muted-foreground/70">
              &copy; 2024 Marathon of Distraction. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicHome;
