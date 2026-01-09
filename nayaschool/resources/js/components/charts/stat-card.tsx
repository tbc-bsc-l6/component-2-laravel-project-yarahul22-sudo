import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'red' | 'purple' | 'yellow';
}

const colorStyles = {
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  green: 'bg-green-50 text-green-700 border-green-200',
  red: 'bg-red-50 text-red-700 border-red-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
  yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
};

const iconBgStyles = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  red: 'bg-red-100 text-red-600',
  purple: 'bg-purple-100 text-purple-600',
  yellow: 'bg-yellow-100 text-yellow-600',
};

export function StatCard({
  title,
  value,
  description,
  icon,
  color = 'blue',
}: StatCardProps) {
  return (
    <div className={`rounded-lg border p-6 ${colorStyles[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
          {description && <p className="mt-1 text-xs opacity-75">{description}</p>}
        </div>
        {icon && <div className={`rounded-lg p-3 ${iconBgStyles[color]}`}>{icon}</div>}
      </div>
    </div>
  );
}
