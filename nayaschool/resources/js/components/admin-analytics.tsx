import React, { useEffect, useState } from 'react';
import { BarChartComponent } from './charts/bar-chart';
import { PieChartComponent } from './charts/pie-chart';
import { DataTable } from './charts/data-table';
import { StatCard } from './charts/stat-card';
import { Users, BookOpen, GraduationCap, TrendingUp } from 'lucide-react';

interface AdminAnalyticsProps {
  onDataLoaded?: (data: any) => void;
}

export function AdminAnalytics({ onDataLoaded }: AdminAnalyticsProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/analytics/admin');
      const data = await response.json();
      setAnalytics(data);
      onDataLoaded?.(data);
    } catch (err) {
      setError('Failed to load analytics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (!analytics) return null;

  const { summary, module_stats, teacher_stats, enrollment_trends, grade_distribution } = analytics;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Modules"
          value={summary.total_modules}
          color="blue"
          icon={<BookOpen className="h-6 w-6" />}
        />
        <StatCard
          title="Total Students"
          value={summary.total_students}
          color="green"
          icon={<GraduationCap className="h-6 w-6" />}
        />
        <StatCard
          title="Total Teachers"
          value={summary.total_teachers}
          color="purple"
          icon={<Users className="h-6 w-6" />}
        />
        <StatCard
          title="Total Enrollments"
          value={summary.total_enrollments}
          color="yellow"
          icon={<TrendingUp className="h-6 w-6" />}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Grade Distribution */}
        <PieChartComponent
          title="Grade Distribution"
          data={[
            { name: 'Passed', value: grade_distribution.passed },
            { name: 'Failed', value: grade_distribution.failed },
            { name: 'Pending', value: grade_distribution.pending },
          ]}
          colors={['#10b981', '#ef4444', '#f59e0b']}
          height={350}
        />

        {/* Enrollment Trends */}
        {enrollment_trends && enrollment_trends.length > 0 && (
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Enrollment Trends (Last 7 Days)</h3>
            <div className="space-y-3">
              {enrollment_trends.map((trend: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{trend.date}</span>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2 rounded-full bg-blue-500"
                      style={{ width: Math.max(20, (trend.enrollments / Math.max(...enrollment_trends.map((t: any) => t.enrollments))) * 200) + 'px' }}
                    ></div>
                    <span className="text-sm font-semibold text-gray-900">{trend.enrollments}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Module Statistics Table */}
      <DataTable
        title="Module Performance"
        columns={[
          { key: 'title', label: 'Module' },
          { key: 'teacher', label: 'Teacher' },
          { key: 'active_students', label: 'Active Students' },
          { key: 'completed', label: 'Completed' },
          {
            key: 'pass_rate',
            label: 'Pass Rate',
            render: (value) => (
              <span className={value >= 70 ? 'text-green-600 font-semibold' : value >= 50 ? 'text-yellow-600 font-semibold' : 'text-red-600 font-semibold'}>
                {value}%
              </span>
            ),
          },
        ]}
        data={module_stats}
      />

      {/* Teacher Performance Table */}
      <DataTable
        title="Teacher Performance"
        columns={[
          { key: 'name', label: 'Teacher' },
          { key: 'modules_count', label: 'Modules' },
          { key: 'total_enrollments', label: 'Total Enrollments' },
          { key: 'completed_enrollments', label: 'Completed' },
          {
            key: 'pass_rate',
            label: 'Pass Rate',
            render: (value) => (
              <span className={value >= 70 ? 'text-green-600 font-semibold' : value >= 50 ? 'text-yellow-600 font-semibold' : 'text-red-600 font-semibold'}>
                {value}%
              </span>
            ),
          },
        ]}
        data={teacher_stats}
      />
    </div>
  );
}
