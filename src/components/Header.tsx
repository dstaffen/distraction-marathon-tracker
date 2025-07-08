
import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Keyboard, Bell } from "lucide-react";
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
    <header className="flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-3 sm:px-4 lg:px-6 sticky top-0 z-40">
      <SidebarTrigger className="hover:scale-105 transition-transform" />
      
      <div className="flex-1 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Media Tracker
          </h1>
          <Badge variant="secondary" className="hidden sm:inline-flex text-xs">
            Pro
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={showShortcuts}
            className="hidden sm:flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Keyboard className="h-4 w-4" />
            <span className="text-xs">Shortcuts</span>
          </Button>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="hidden sm:block">Welcome back!</div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </header>
  );
}
