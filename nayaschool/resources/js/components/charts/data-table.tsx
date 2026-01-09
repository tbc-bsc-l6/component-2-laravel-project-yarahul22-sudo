import React from 'react';

interface DataTableProps {
  columns: Array<{
    key: string;
    label: string;
    render?: (value: any, row: any) => React.ReactNode;
  }>;
  data: any[];
  title?: string;
  maxRows?: number;
}

export function DataTable({ columns, data, title, maxRows = 10 }: DataTableProps) {
  const displayData = data.slice(0, maxRows);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      {title && <h3 className="mb-4 text-lg font-semibold text-gray-900">{title}</h3>}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-700"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-3 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            ) : (
              displayData.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-sm text-gray-700">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {data.length > maxRows && (
        <p className="mt-3 text-xs text-gray-500">
          Showing {maxRows} of {data.length} records
        </p>
      )}
    </div>
  );
}
