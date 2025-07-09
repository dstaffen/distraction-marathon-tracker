
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Book, LayoutDashboard, ChartBar, Sparkles } from "lucide-react";
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
      description: "Media items tracked",
      gradient: "from-sage-green/20 to-sage-green/5"
    },
    { 
      title: "Categories", 
      value: categoriesLoading ? "..." : totalCategories.toString(), 
      icon: LayoutDashboard, 
      description: "Different categories",
      gradient: "from-dusty-rose/20 to-dusty-rose/5"
    },
    { 
      title: "This Month", 
      value: entriesLoading ? "..." : thisMonthEntries.toString(), 
      icon: ChartBar, 
      description: "Entries added",
      gradient: "from-warm-amber/20 to-warm-amber/5"
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-warm-amber" />
            Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">Welcome to your Marathon of Distraction</p>
        </div>
        <Button 
          onClick={() => navigate("/app/add-entry")} 
          className="gap-2 hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md"
          size="lg"
        >
          <Plus className="h-5 w-5" />
          Add Entry
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={stat.title} className={cn(
            "card-warm hover-lift group",
            "animate-fade-in"
          )} style={{ animationDelay: `${index * 100}ms` }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={cn(
                "p-2 rounded-lg transition-all duration-300 group-hover:scale-110",
                `bg-gradient-to-br ${stat.gradient}`
              )}>
                <stat.icon className="h-4 w-4 text-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground mb-1">
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="card-warm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5" />
                Your Media Feed
              </CardTitle>
              <CardDescription>
                Latest entries with archived gems mixed in for delightful rediscovery
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MediaFeed />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="card-warm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>Common tasks at your fingertips</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start gap-3 hover:bg-accent/50 transition-all duration-200 hover:scale-105"
                onClick={() => navigate("/app/add-entry")}
              >
                <Plus className="h-4 w-4" />
                Add New Entry
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-3 hover:bg-accent/50 transition-all duration-200 hover:scale-105"
                onClick={() => navigate("/app/categories")}
              >
                <LayoutDashboard className="h-4 w-4" />
                Manage Categories
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-3 hover:bg-accent/50 transition-all duration-200 hover:scale-105"
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
