
import { useMemo } from 'react';
import { useMediaEntries } from './useMediaEntries';
import { useCategories } from './useCategories';
import { MediaEntry } from './useMediaEntries';

interface AnalyticsData {
  totalEntries: number;
  thisMonthEntries: number;
  averageRating: number;
  mostUsedCategory: string;
  entriesByCategory: { name: string; value: number; color: string }[];
  monthlyActivity: { month: string; entries: number }[];
  ratingDistribution: { rating: string; count: number }[];
  topTags: { tag: string; count: number }[];
  recentActivity: MediaEntry[];
  streakDays: number;
}

export function useAnalytics(): AnalyticsData {
  const { entries } = useMediaEntries();
  const { categories } = useCategories();

  return useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Basic stats
    const totalEntries = entries.length;
    const thisMonthEntries = entries.filter(entry => 
      new Date(entry.created_at) >= startOfMonth
    ).length;
    
    const ratingsSum = entries.reduce((sum, entry) => sum + (entry.rating || 0), 0);
    const entriesWithRating = entries.filter(entry => entry.rating).length;
    const averageRating = entriesWithRating > 0 ? ratingsSum / entriesWithRating : 0;

    // Most used category
    const categoryCount = entries.reduce((acc, entry) => {
      if (entry.category_id) {
        acc[entry.category_id] = (acc[entry.category_id] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    const mostUsedCategoryId = Object.entries(categoryCount).reduce((a, b) => 
      categoryCount[a[0]] > categoryCount[b[0]] ? a : b
    )?.[0];
    
    const mostUsedCategory = categories.find(cat => cat.id === mostUsedCategoryId)?.name || 'None';

    // Entries by category for pie chart
    const entriesByCategory = categories.map(category => ({
      name: category.name,
      value: categoryCount[category.id] || 0,
      color: category.color || '#3B82F6'
    })).filter(item => item.value > 0);

    // Monthly activity for the last 6 months
    const monthlyActivity = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const monthEntries = entries.filter(entry => {
        const entryDate = new Date(entry.created_at);
        return entryDate >= date && entryDate < nextMonth;
      }).length;
      
      monthlyActivity.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        entries: monthEntries
      });
    }

    // Rating distribution
    const ratingCounts = [1, 2, 3, 4, 5].map(rating => ({
      rating: `${rating} ⭐`,
      count: entries.filter(entry => entry.rating === rating).length
    }));

    // Top tags
    const tagCounts: Record<string, number> = {};
    entries.forEach(entry => {
      entry.tags?.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    
    const topTags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Recent activity (last 10 entries)
    const recentActivity = entries.slice(0, 10);

    // Streak calculation
    const sortedDates = entries
      .map(entry => new Date(entry.created_at).toDateString())
      .filter((date, index, array) => array.indexOf(date) === index)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    let streakDays = 0;
    const today = new Date().toDateString();
    
    if (sortedDates.length > 0) {
      const todayIndex = sortedDates.indexOf(today);
      const yesterdayIndex = sortedDates.indexOf(new Date(Date.now() - 86400000).toDateString());
      
      if (todayIndex === 0 || yesterdayIndex === 0) {
        streakDays = 1;
        for (let i = 1; i < sortedDates.length; i++) {
          const currentDate = new Date(sortedDates[i]);
          const prevDate = new Date(sortedDates[i - 1]);
          const diffDays = (prevDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24);
          
          if (diffDays === 1) {
            streakDays++;
          } else {
            break;
          }
        }
      }
    }

    return {
      totalEntries,
      thisMonthEntries,
      averageRating,
      mostUsedCategory,
      entriesByCategory,
      monthlyActivity,
      ratingDistribution: ratingCounts,
      topTags,
      recentActivity,
      streakDays
    };
  }, [entries, categories]);
}
