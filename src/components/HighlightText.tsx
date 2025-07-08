
import React from 'react';

interface HighlightTextProps {
  text: string;
  searchTerm: string;
  className?: string;
}

export function HighlightText({ text, searchTerm, className = '' }: HighlightTextProps) {
  if (!searchTerm) {
    return <span className={className}>{text}</span>;
  }

  const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
  
  return (
    <span className={className}>
      {parts.map((part, index) => 
        part.toLowerCase() === searchTerm.toLowerCase() ? (
          <mark key={index} className="bg-yellow-200 text-yellow-900 px-0.5 rounded">
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </span>
  );
}
