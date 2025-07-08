
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Clock, Flame } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { formatDistanceToNow } from "date-fns";

export function AnalyticsDetails() {
  const analytics = useAnalytics();

  const exportData = () => {
    const data = {
      analytics,
      exportedAt: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `media-analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Top Tags */}
      <Card>
        <CardHeader>
          <CardTitle>Top Tags</CardTitle>
          <CardDescription>Most frequently used tags</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {analytics.topTags.length > 0 ? (
            analytics.topTags.map((tag, index) => (
              <div key={index} className="flex items-center justify-between">
                <Badge variant="secondary">{tag.tag}</Badge>
                <span className="text-sm text-muted-foreground">{tag.count}</span>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No tags found</p>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Recent Activity
          </CardTitle>
          <CardDescription>Latest entries added</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {analytics.recentActivity.length > 0 ? (
            analytics.recentActivity.slice(0, 5).map((entry) => (
              <div key={entry.id} className="space-y-1">
                <p className="text-sm font-medium truncate">{entry.title}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
                </p>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No recent activity</p>
          )}
        </CardContent>
      </Card>

      {/* Streak & Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-4 w-4" />
            Activity Streak
          </CardTitle>
          <CardDescription>Your consistency tracking</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold">{analytics.streakDays}</div>
            <p className="text-sm text-muted-foreground">
              {analytics.streakDays === 1 ? 'day' : 'days'} streak
            </p>
          </div>
          <Button onClick={exportData} variant="outline" className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
