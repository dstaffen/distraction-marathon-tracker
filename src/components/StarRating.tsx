
import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  value: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StarRating({ value, onChange, readonly = false, size = 'md', className }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState(0);

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const handleClick = (rating: number) => {
    if (!readonly && onChange) {
      // If clicking on the same rating, clear it
      if (rating === value) {
        onChange(0);
      } else {
        onChange(rating);
      }
    }
  };

  const handleMouseEnter = (rating: number) => {
    if (!readonly) {
      setHoverValue(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverValue(0);
    }
  };

  const handleClearRating = () => {
    if (!readonly && onChange) {
      onChange(0);
    }
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((rating) => {
          const isActive = (hoverValue || value) >= rating;
          return (
            <button
              key={rating}
              type="button"
              onClick={() => handleClick(rating)}
              onMouseEnter={() => handleMouseEnter(rating)}
              onMouseLeave={handleMouseLeave}
              disabled={readonly}
              className={cn(
                "transition-all duration-200",
                !readonly && "hover:scale-110 cursor-pointer",
                readonly && "cursor-default"
              )}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  isActive ? "fill-current opacity-100" : "opacity-30",
                  "transition-all duration-200"
                )}
              />
            </button>
          );
        })}
      </div>
      
      {!readonly && value > 0 && (
        <button
          type="button"
          onClick={handleClearRating}
          className="ml-1 p-1 rounded-full hover:bg-muted transition-colors"
          title="Clear rating"
        >
          <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
        </button>
      )}
    </div>
  );
}
