
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Book, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { formatDistanceToNow } from 'date-fns';

const Blog = () => {
  const { data: posts, isLoading } = useBlogPosts();
  const recentPosts = posts?.slice(0, 3) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Blog</h1>
          <p className="text-muted-foreground">Your thoughts and reviews</p>
        </div>
        <Button asChild>
          <Link to="/blog/create">
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="h-5 w-5" />
              Recent Posts
            </CardTitle>
            <CardDescription>
              Your latest blog posts
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : recentPosts.length > 0 ? (
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <div key={post.id} className="border-b last:border-b-0 pb-3 last:pb-0">
                    <Link 
                      to={`/blog/post/${post.id}`}
                      className="font-medium hover:text-primary line-clamp-2"
                    >
                      {post.title}
                    </Link>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(post.created_at!), { addSuffix: true })}
                    </p>
                  </div>
                ))}
                <Button variant="outline" size="sm" asChild className="w-full mt-4">
                  <Link to="/blog/posts">View All Posts</Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Book className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No blog posts yet</p>
                <p className="text-sm">Start writing about your media journey</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Manage your blog content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full">
              <Link to="/blog/create">
                <Plus className="h-4 w-4 mr-2" />
                Create New Post
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link to="/blog/posts">
                <Book className="h-4 w-4 mr-2" />
                Manage Posts
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Blog;
