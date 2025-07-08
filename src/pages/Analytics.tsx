
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartBar } from "lucide-react";

const Analytics = () => {
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
};

export default Analytics;
