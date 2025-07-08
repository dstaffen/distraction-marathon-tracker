
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Book, LayoutDashboard, ChartBar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMediaEntries } from "@/hooks/useMediaEntries";
import { useCategories } from "@/hooks/useCategories";
import { MediaFeed } from "@/components/MediaFeed";

const Dashboard = () => {
  const navigate = useNavigate();
  const { entries, isLoading: entriesLoading } = useMediaEntries();
  const { categories, isLoading: categoriesLoading } = useCategories();

  // Calculate stats
  const totalEntries = entries.length;
  const totalCategories = categories.length;
  
  // Entries added this month
  const thisMonth = new Date();
  thisMonth.setDate(1);
  thisMonth.setHours(0, 0, 0, 0);
  
  const thisMonthEntries = entries.filter(entry => 
    new Date(entry.created_at) >= thisMonth
  ).length;

  const stats = [
    { 
      title: "Total Entries", 
      value: entriesLoading ? "..." : totalEntries.toString(), 
      icon: Book, 
      description: "Media items tracked" 
    },
    { 
      title: "Categories", 
      value: categoriesLoading ? "..." : totalCategories.toString(), 
      icon: LayoutDashboard, 
      description: "Different categories" 
    },
    { 
      title: "This Month", 
      value: entriesLoading ? "..." : thisMonthEntries.toString(), 
      icon: ChartBar, 
      description: "Entries added" 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your media tracking hub</p>
        </div>
        <Button onClick={() => navigate("/app/add-entry")} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Entry
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Media Feed</CardTitle>
              <CardDescription>Latest entries with archived gems mixed in</CardDescription>
            </CardHeader>
            <CardContent>
              <MediaFeed />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={() => navigate("/app/add-entry")}
              >
                <Plus className="h-4 w-4" />
                Add New Entry
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={() => navigate("/app/categories")}
              >
                <LayoutDashboard className="h-4 w-4" />
                Manage Categories
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={() => navigate("/app/analytics")}
              >
                <ChartBar className="h-4 w-4" />
                View Analytics
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
