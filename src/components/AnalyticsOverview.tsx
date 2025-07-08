
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Calendar, Star, Tag } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";

export function AnalyticsOverview() {
  const analytics = useAnalytics();

  const stats = [
    {
      title: "Total Entries",
      value: analytics.totalEntries,
      description: "All time entries",
      icon: <TrendingUp className="h-4 w-4" />
    },
    {
      title: "This Month",
      value: analytics.thisMonthEntries,
      description: "Entries added this month",
      icon: <Calendar className="h-4 w-4" />
    },
    {
      title: "Average Rating",
      value: analytics.averageRating.toFixed(1),
      description: "Overall content quality",
      icon: <Star className="h-4 w-4" />
    },
    {
      title: "Top Category",
      value: analytics.mostUsedCategory,
      description: "Most used category",
      icon: <Tag className="h-4 w-4" />
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
