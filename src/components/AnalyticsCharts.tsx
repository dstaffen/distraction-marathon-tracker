
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useAnalytics } from "@/hooks/useAnalytics";

export function AnalyticsCharts() {
  const analytics = useAnalytics();

  const categoryChartConfig = analytics.entriesByCategory.reduce((acc, item, index) => {
    acc[item.name.toLowerCase()] = {
      label: item.name,
      color: item.color,
    };
    return acc;
  }, {} as any);

  const monthlyChartConfig = {
    entries: {
      label: "Entries",
      color: "hsl(var(--primary))",
    },
  };

  const ratingChartConfig = {
    count: {
      label: "Count",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Entries by Category */}
      <Card>
        <CardHeader>
          <CardTitle>Entries by Category</CardTitle>
          <CardDescription>Distribution of your media entries</CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.entriesByCategory.length > 0 ? (
            <ChartContainer config={categoryChartConfig} className="h-[300px]">
              <PieChart>
                <Pie
                  data={analytics.entriesByCategory}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {analytics.entriesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Monthly Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Activity</CardTitle>
          <CardDescription>Entries added over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={monthlyChartConfig} className="h-[300px]">
            <BarChart data={analytics.monthlyActivity}>
              <XAxis dataKey="month" />
              <YAxis />
              <Bar dataKey="entries" fill="var(--color-entries)" />
              <ChartTooltip content={<ChartTooltipContent />} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Rating Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Rating Distribution</CardTitle>
          <CardDescription>How you rate your content</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={ratingChartConfig} className="h-[300px]">
            <BarChart data={analytics.ratingDistribution}>
              <XAxis dataKey="rating" />
              <YAxis />
              <Bar dataKey="count" fill="var(--color-count)" />
              <ChartTooltip content={<ChartTooltipContent />} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
