
import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface KeyboardShortcutsProps {
  children: React.ReactNode;
}

export function KeyboardShortcuts({ children }: KeyboardShortcutsProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    // Only trigger shortcuts when not in input fields
    if (event.target instanceof HTMLInputElement || 
        event.target instanceof HTMLTextAreaElement || 
        event.target instanceof HTMLSelectElement) {
      return;
    }

    // Cmd/Ctrl + K for search
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
      }
    }

    // Alt + N for new entry
    if (event.altKey && event.key === 'n') {
      event.preventDefault();
      navigate('/add-entry');
      toast({
        title: "Navigation",
        description: "Opened new entry form",
      });
    }

    // Alt + D for dashboard
    if (event.altKey && event.key === 'd') {
      event.preventDefault();
      navigate('/dashboard');
    }

    // Alt + B for blog
    if (event.altKey && event.key === 'b') {
      event.preventDefault();
      navigate('/blog');
    }

    // Alt + C for categories
    if (event.altKey && event.key === 'c') {
      event.preventDefault();
      navigate('/categories');
    }

    // Show shortcuts help with ?
    if (event.key === '?' && !event.shiftKey) {
      event.preventDefault();
      toast({
        title: "Keyboard Shortcuts",
        description: "⌘K: Search, Alt+N: New Entry, Alt+D: Dashboard, Alt+B: Blog, Alt+C: Categories",
      });
    }
  }, [navigate, toast]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  return <>{children}</>;
}
