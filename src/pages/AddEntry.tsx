
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

const AddEntry = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add Entry</h1>
        <p className="text-muted-foreground">Add a new media item to your collection</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            New Media Entry
          </CardTitle>
          <CardDescription>
            Fill in the details about your media item
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="Enter title" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input id="category" placeholder="e.g., Movie, Book, Game" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" placeholder="Brief description" />
          </div>
          <Button className="w-full">Add Entry</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddEntry;
