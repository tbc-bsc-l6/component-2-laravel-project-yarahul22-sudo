import React, { useEffect, useState } from 'react';
import { BarChartComponent } from './charts/bar-chart';
import { PieChartComponent } from './charts/pie-chart';
import { DataTable } from './charts/data-table';
import { StatCard } from './charts/stat-card';
import { BookOpen, Users, TrendingUp, CheckCircle2 } from 'lucide-react';

interface TeacherAnalyticsProps {
  onDataLoaded?: (data: any) => void;
}

export function TeacherAnalytics({ onDataLoaded }: TeacherAnalyticsProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/analytics/teacher');
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

  const { summary, module_stats, student_performance, grade_distribution } = analytics;

  // Prepare bar chart data for modules
  const moduleChartData = module_stats.map((m: any) => ({
    name: m.code,
    active: m.active_students,
    completed: m.completed,
  }));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Modules Teaching"
          value={summary.total_modules}
          color="blue"
          icon={<BookOpen className="h-6 w-6" />}
        />
        <StatCard
          title="Total Enrollments"
          value={summary.total_enrollments}
          color="green"
          icon={<Users className="h-6 w-6" />}
        />
        <StatCard
          title="Completed"
          value={summary.completed_enrollments}
          color="purple"
          icon={<CheckCircle2 className="h-6 w-6" />}
        />
        <StatCard
          title="Overall Pass Rate"
          value={`${summary.overall_pass_rate}%`}
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

        {/* Module Enrollment Status */}
        {moduleChartData.length > 0 && (
          <BarChartComponent
            title="Module Enrollment Status"
            data={moduleChartData}
            xAxisKey="name"
            bars={[
              { key: 'active', fill: '#3b82f6', name: 'Active Students' },
              { key: 'completed', fill: '#10b981', name: 'Completed' },
            ]}
            height={350}
          />
        )}
      </div>

      {/* Module Performance Table */}
      <DataTable
        title="Module Details"
        columns={[
          { key: 'title', label: 'Module' },
          { key: 'code', label: 'Code' },
          { key: 'total_students', label: 'Total Students' },
          { key: 'active_students', label: 'Active' },
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

      {/* Student Performance Table */}
      <DataTable
        title="Student Performance"
        columns={[
          { key: 'name', label: 'Student' },
          { key: 'enrolled_modules', label: 'Enrolled' },
          { key: 'completed', label: 'Completed' },
          { key: 'passed', label: 'Passed' },
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
        data={student_performance}
      />
    </div>
  );
}
