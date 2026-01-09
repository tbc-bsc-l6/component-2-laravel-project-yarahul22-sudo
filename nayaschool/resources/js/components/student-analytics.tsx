import React, { useEffect, useState } from 'react';
import { PieChartComponent } from './charts/pie-chart';
import { DataTable } from './charts/data-table';
import { StatCard } from './charts/stat-card';
import { BookOpen, CheckCircle2, TrendingUp, Award } from 'lucide-react';

interface StudentAnalyticsProps {
  onDataLoaded?: (data: any) => void;
}

export function StudentAnalytics({ onDataLoaded }: StudentAnalyticsProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/analytics/student');
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

  const { summary, modules, grade_distribution } = analytics;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Enrolled"
          value={summary.total_enrolled}
          color="blue"
          icon={<BookOpen className="h-6 w-6" />}
        />
        <StatCard
          title="Active Modules"
          value={summary.active_modules}
          color="yellow"
          icon={<TrendingUp className="h-6 w-6" />}
        />
        <StatCard
          title="Completed"
          value={summary.completed_modules}
          color="green"
          icon={<CheckCircle2 className="h-6 w-6" />}
        />
        <StatCard
          title="Pass Rate"
          value={`${summary.pass_rate}%`}
          color="purple"
          icon={<Award className="h-6 w-6" />}
        />
      </div>

      {/* Charts Row */}
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

        {/* Progress Overview */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-6 text-lg font-semibold text-gray-900">Progress Overview</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">Completion Rate</span>
                <span className="text-gray-900 font-semibold">
                  {summary.total_enrolled > 0
                    ? Math.round((summary.completed_modules / summary.total_enrolled) * 100)
                    : 0}
                  %
                </span>
              </div>
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{
                    width: `${summary.total_enrolled > 0 ? (summary.completed_modules / summary.total_enrolled) * 100 : 0}%`,
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">Pass Rate</span>
                <span className="text-gray-900 font-semibold">{summary.pass_rate}%</span>
              </div>
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-gray-200">
                <div
                  className={`h-full transition-all duration-300 ${
                    summary.pass_rate >= 70 ? 'bg-green-500' : summary.pass_rate >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${summary.pass_rate}%` }}
                ></div>
              </div>
            </div>

            <div className="pt-4 text-sm text-gray-600">
              <p>• Completed: {summary.completed_modules} modules</p>
              <p>• Passed: {summary.passed} modules</p>
              <p>• Failed: {summary.failed} modules</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modules Table */}
      <DataTable
        title="Your Modules"
        columns={[
          { key: 'title', label: 'Module' },
          { key: 'code', label: 'Code' },
          {
            key: 'status',
            label: 'Status',
            render: (value) => (
              <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                  value === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                }`}
              >
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </span>
            ),
          },
          { key: 'enrolled_at', label: 'Enrolled Date' },
          { key: 'completed_at', label: 'Completed Date' },
          {
            key: 'result',
            label: 'Result',
            render: (value) => {
              if (value === 'pending') return <span className="text-gray-500">Pending</span>;
              return (
                <span className={value === 'pass' ? 'font-semibold text-green-600' : 'font-semibold text-red-600'}>
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </span>
              );
            },
          },
        ]}
        data={modules}
      />
    </div>
  );
}
