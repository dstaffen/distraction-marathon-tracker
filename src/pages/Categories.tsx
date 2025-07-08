
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { List } from "lucide-react";

const Categories = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Categories</h1>
        <p className="text-muted-foreground">Organize your media by categories</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <List className="h-5 w-5" />
            Media Categories
          </CardTitle>
          <CardDescription>
            Manage your media categories and organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <List className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No categories yet</p>
            <p className="text-sm">Categories will appear here once you add entries</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Categories;
