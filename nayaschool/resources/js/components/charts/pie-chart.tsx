import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

interface PieChartComponentProps {
  data: Array<{ name: string; value: number }>;
  colors?: string[];
  title?: string;
  height?: number;
}

const DEFAULT_COLORS = ['#10b981', '#ef4444', '#f59e0b'];

export function PieChartComponent({
  data,
  colors = DEFAULT_COLORS,
  title,
  height = 300,
}: PieChartComponentProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      {title && <h3 className="mb-4 text-lg font-semibold text-gray-900">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
