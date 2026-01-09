import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface BarChartComponentProps {
  data: any[];
  xAxisKey: string;
  bars: Array<{ key: string; fill: string; name: string }>;
  title?: string;
  height?: number;
}

export function BarChartComponent({
  data,
  xAxisKey,
  bars,
  title,
  height = 300,
}: BarChartComponentProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      {title && <h3 className="mb-4 text-lg font-semibold text-gray-900">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey={xAxisKey} />
          <YAxis />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          <Legend />
          {bars.map((bar) => (
            <Bar key={bar.key} dataKey={bar.key} fill={bar.fill} name={bar.name} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
