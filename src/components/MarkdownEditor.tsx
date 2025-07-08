
import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Edit } from "lucide-react";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = "Write your blog post in markdown..."
}) => {
  const [activeTab, setActiveTab] = useState("edit");

  const renderMarkdown = (markdown: string) => {
    // Simple markdown rendering - replace with a proper library if needed
    return markdown
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/!\[([^\]]*)\]\(([^\)]*)\)/gim, '<img alt="$1" src="$2" class="max-w-full h-auto" />')
      .replace(/\[([^\]]*)\]\(([^\)]*)\)/gim, '<a href="$2" class="text-blue-600 hover:underline">$1</a>')
      .replace(/```([^`]+)```/gim, '<pre class="bg-gray-100 p-4 rounded overflow-x-auto"><code>$1</code></pre>')
      .replace(/`([^`]+)`/gim, '<code class="bg-gray-100 px-1 rounded">$1</code>')
      .replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-gray-300 pl-4 italic">$1</blockquote>')
      .replace(/\n/gim, '<br />');
  };

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
            className="min-h-[400px] font-mono"
          />
        </TabsContent>
        
        <TabsContent value="preview" className="mt-4">
          <div className="min-h-[400px] p-4 border rounded-md prose prose-sm max-w-none">
            {value ? (
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: renderMarkdown(value) 
                }} 
              />
            ) : (
              <p className="text-muted-foreground">Nothing to preview yet...</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
</MarkdownEditor>

<lov-write file_path="src/pages/CreatePost.tsx">
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { useCreateBlogPost, useUpdateBlogPost, useBlogPost } from "@/hooks/useBlogPosts";
import { PenTool, Save, Eye } from "lucide-react";

const CreatePost = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);

  const { data: existingPost, isLoading } = useBlogPost(id || '');
  const createMutation = useCreateBlogPost();
  const updateMutation = useUpdateBlogPost();

  useEffect(() => {
    if (existingPost && isEditing) {
      setTitle(existingPost.title);
      setContent(existingPost.content);
      setPublished(existingPost.published || false);
    }
  }, [existingPost, isEditing]);

  // Auto-save functionality
  useEffect(() => {
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }

    if (isEditing && (title || content)) {
      const timer = setTimeout(() => {
        handleAutoSave();
      }, 2000);
      setAutoSaveTimer(timer);
    }

    return () => {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
    };
  }, [title, content]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  };

  const handleAutoSave = async () => {
    if (!isEditing || !title.trim()) return;

    try {
      await updateMutation.mutateAsync({
        id: id!,
        title: title.trim(),
        content,
        slug: generateSlug(title),
        published
      });
      console.log('Auto-saved');
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  };

  const handleSave = async (shouldPublish = false) => {
    if (!title.trim()) return;

    const postData = {
      title: title.trim(),
      content,
      slug: generateSlug(title),
      published: shouldPublish
    };

    try {
      if (isEditing) {
        await updateMutation.mutateAsync({
          id: id!,
          ...postData
        });
      } else {
        const newPost = await createMutation.mutateAsync(postData);
        navigate(`/blog/post/${newPost.id}`);
      }
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  const handlePublish = () => {
    setPublished(true);
    handleSave(true);
  };

  if (isEditing && isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          {isEditing ? 'Edit Post' : 'Create New Post'}
        </h1>
        <p className="text-muted-foreground">
          {isEditing ? 'Update your blog post' : 'Write and publish your thoughts'}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PenTool className="h-5 w-5" />
            {isEditing ? 'Edit Blog Post' : 'New Blog Post'}
          </CardTitle>
          <CardDescription>
            {isEditing ? 'Make changes to your post' : 'Share your thoughts with markdown support'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter your blog post title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg"
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Content</Label>
            <MarkdownEditor
              value={content}
              onChange={setContent}
              placeholder="Write your blog post in markdown..."
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="published"
                checked={published}
                onCheckedChange={setPublished}
              />
              <Label htmlFor="published">
                {published ? 'Published' : 'Draft'}
              </Label>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleSave(false)}
                disabled={!title.trim() || createMutation.isPending || updateMutation.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button
                onClick={handlePublish}
                disabled={!title.trim() || createMutation.isPending || updateMutation.isPending}
              >
                <Eye className="h-4 w-4 mr-2" />
                {published ? 'Update' : 'Publish'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatePost;
