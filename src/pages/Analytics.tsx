
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartBar } from "lucide-react";
import { AnalyticsOverview } from "@/components/AnalyticsOverview";
import { AnalyticsCharts } from "@/components/AnalyticsCharts";
import { AnalyticsDetails } from "@/components/AnalyticsDetails";
import { useMediaEntries } from "@/hooks/useMediaEntries";

const Analytics = () => {
  const { entries, isLoading } = useMediaEntries();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Insights into your media consumption</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="animate-pulse">
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent className="animate-pulse">
                <div className="h-8 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Insights into your media consumption</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChartBar className="h-5 w-5" />
              Media Analytics
            </CardTitle>
            <CardDescription>
              Track your progress and patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <ChartBar className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No data to analyze yet</p>
              <p className="text-sm">Analytics will appear once you have entries</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Insights into your media consumption</p>
      </div>

      {/* Overview Stats */}
      <AnalyticsOverview />

      {/* Charts */}
      <AnalyticsCharts />

      {/* Details */}
      <AnalyticsDetails />
    </div>
  );
};

export default Analytics;
