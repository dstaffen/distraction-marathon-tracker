
import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Edit } from "lucide-react";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = "Write your content in markdown..."
}) => {
  const [activeTab, setActiveTab] = useState("edit");

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="edit" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="edit" className="mt-4">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="min-h-[400px] font-mono text-sm leading-relaxed"
          />
          <div className="mt-2 text-xs text-muted-foreground">
            <p>
              <strong>Tip:</strong> Use Markdown formatting: **bold**, *italic*, [links](url), `code`, 
              lists, tables, and more. Full CommonMark and GitHub Flavored Markdown support.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="preview" className="mt-4">
          <div className="min-h-[400px] p-6 border rounded-lg bg-card">
            {value ? (
              <MarkdownRenderer 
                content={value}
                className="max-w-none"
              />
            ) : (
              <p className="text-muted-foreground text-center py-12">
                Nothing to preview yet. Write some markdown content in the edit tab to see it rendered here.
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
