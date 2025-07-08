
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Book } from "lucide-react";

const Blog = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Blog</h1>
        <p className="text-muted-foreground">Your thoughts and reviews</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="h-5 w-5" />
            Blog Posts
          </CardTitle>
          <CardDescription>
            Write about your media experiences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Book className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No blog posts yet</p>
            <p className="text-sm">Start writing about your media journey</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Blog;
