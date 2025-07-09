
import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Keyboard, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function Header() {
  const { toast } = useToast();

  const showShortcuts = () => {
    toast({
      title: "Keyboard Shortcuts",
      description: "Press ? anywhere to see available shortcuts, or ⌘K to search",
    });
  };

  return (
    <header className="flex h-16 items-center gap-4 border-b border-border/40 bg-gradient-to-r from-background via-background/95 to-card/60 backdrop-blur-sm supports-[backdrop-filter]:bg-background/80 px-4 sm:px-6 lg:px-8 sticky top-0 z-40 shadow-sm">
      <SidebarTrigger className="hover:scale-105 transition-all duration-300 hover:bg-accent/60 rounded-lg p-2" />
      
      <div className="flex-1 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-warm-amber animate-pulse" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
              Media Tracker
            </h1>
          </div>
          <Badge 
            variant="secondary" 
            className="hidden sm:inline-flex text-xs font-semibold bg-gradient-to-r from-secondary to-secondary/80 border border-border/30 shadow-sm"
          >
            Pro
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={showShortcuts}
            className="hidden sm:flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-300 hover:bg-accent/60 rounded-lg font-medium"
          >
            <Keyboard className="h-4 w-4" />
            <span className="text-sm">Shortcuts</span>
          </Button>
          
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gradient-to-r from-muted/30 to-muted/20 border border-border/30">
            <div className="hidden sm:block text-sm font-medium text-foreground/80">
              Welcome back!
            </div>
            <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-green-400 rounded-full animate-pulse shadow-sm" />
          </div>
        </div>
      </div>
    </header>
  );
}
