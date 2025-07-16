import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import hljs from 'highlight.js';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  allowDangerousHtml?: boolean;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className,
  allowDangerousHtml = false,
}) => {
  const remarkPlugins = [remarkGfm];
  const rehypePlugins = allowDangerousHtml ? [rehypeRaw] : [];

  useEffect(() => {
    // Apply syntax highlighting to code blocks after render
    hljs.highlightAll();
  });

  return (
    <div className={cn('markdown-content', className)}>
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
        components={{
          // Custom component overrides for better styling
          h1: ({ children, ...props }) => (
            <h1 
              className="text-3xl font-bold mb-6 text-foreground border-b border-border pb-2"
              {...props}
            >
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2 
              className="text-2xl font-semibold mb-4 mt-8 text-foreground"
              {...props}
            >
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 
              className="text-xl font-semibold mb-3 mt-6 text-foreground"
              {...props}
            >
              {children}
            </h3>
          ),
          h4: ({ children, ...props }) => (
            <h4 
              className="text-lg font-semibold mb-2 mt-4 text-foreground"
              {...props}
            >
              {children}
            </h4>
          ),
          h5: ({ children, ...props }) => (
            <h5 
              className="text-base font-semibold mb-2 mt-3 text-foreground"
              {...props}
            >
              {children}
            </h5>
          ),
          h6: ({ children, ...props }) => (
            <h6 
              className="text-sm font-semibold mb-2 mt-3 text-muted-foreground"
              {...props}
            >
              {children}
            </h6>
          ),
          p: ({ children, ...props }) => (
            <p 
              className="mb-4 text-foreground leading-7 [&:not(:first-child)]:mt-6"
              {...props}
            >
              {children}
            </p>
          ),
          ul: ({ children, ...props }) => (
            <ul 
              className="ml-6 mb-4 list-disc space-y-2 text-foreground [&>li]:mt-2"
              {...props}
            >
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol 
              className="ml-6 mb-4 list-decimal space-y-2 text-foreground [&>li]:mt-2"
              {...props}
            >
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li className="text-foreground leading-7" {...props}>
              {children}
            </li>
          ),
          blockquote: ({ children, ...props }) => (
            <blockquote 
              className="mt-6 border-l-4 border-primary pl-6 italic text-muted-foreground bg-muted/30 py-2 rounded-r-lg"
              {...props}
            >
              {children}
            </blockquote>
          ),
          code: ({ inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            
            if (inline) {
              return (
                <code
                  className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-foreground"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code
                className={cn('font-mono text-sm hljs', className)}
                data-language={language}
                {...props}
              >
                {children}
              </code>
            );
          },
          pre: ({ children, ...props }) => (
            <pre 
              className="mb-4 mt-6 overflow-x-auto rounded-lg bg-card border border-border p-4 text-sm font-mono"
              {...props}
            >
              {children}
            </pre>
          ),
          a: ({ children, href, ...props }) => (
            <a
              href={href}
              className="font-medium text-primary underline underline-offset-4 hover:no-underline transition-all duration-200"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            >
              {children}
            </a>
          ),
          img: ({ src, alt, ...props }) => (
            <img
              src={src}
              alt={alt}
              className="rounded-lg border border-border max-w-full h-auto my-4 shadow-sm"
              loading="lazy"
              {...props}
            />
          ),
          table: ({ children, ...props }) => (
            <div className="my-6 w-full overflow-x-auto">
              <table 
                className="w-full border-collapse border border-border rounded-lg overflow-hidden"
                {...props}
              >
                {children}
              </table>
            </div>
          ),
          thead: ({ children, ...props }) => (
            <thead className="bg-muted" {...props}>
              {children}
            </thead>
          ),
          tbody: ({ children, ...props }) => (
            <tbody {...props}>
              {children}
            </tbody>
          ),
          tr: ({ children, ...props }) => (
            <tr className="border-b border-border hover:bg-muted/50 transition-colors" {...props}>
              {children}
            </tr>
          ),
          th: ({ children, ...props }) => (
            <th 
              className="px-4 py-3 text-left font-semibold text-foreground border-r border-border last:border-r-0"
              {...props}
            >
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td 
              className="px-4 py-3 text-foreground border-r border-border last:border-r-0"
              {...props}
            >
              {children}
            </td>
          ),
          hr: ({ ...props }) => (
            <hr className="my-8 border-t border-border" {...props} />
          ),
          strong: ({ children, ...props }) => (
            <strong className="font-semibold text-foreground" {...props}>
              {children}
            </strong>
          ),
          em: ({ children, ...props }) => (
            <em className="italic text-foreground" {...props}>
              {children}
            </em>
          ),
          del: ({ children, ...props }) => (
            <del className="line-through text-muted-foreground" {...props}>
              {children}
            </del>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};