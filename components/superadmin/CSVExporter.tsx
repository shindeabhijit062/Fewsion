'use client';

import React from 'react';
import { Download } from 'lucide-react';

interface CSVExporterProps {
  data: Record<string, any>[];
  filename?: string;
  buttonText?: string;
  className?: string;
}

export default function CSVExporter({
  data,
  filename = 'export-report.csv',
  buttonText = 'Export CSV',
  className = '',
}: CSVExporterProps) {
  const exportToCSV = () => {
    if (!data || data.length === 0) {
      alert('No data available to export.');
      return;
    }

    // Extract headers
    const headers = Object.keys(data[0]);
    const csvRows = [];

    // Header row
    csvRows.push(headers.join(','));

    // Data rows
    for (const row of data) {
      const values = headers.map((header) => {
        const val = row[header];
        if (val === null || val === undefined) return '""';
        if (typeof val === 'object') return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
        return `"${String(val).replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(','));
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={exportToCSV}
      disabled={!data || data.length === 0}
      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[var(--card)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--amber)] hover:bg-[var(--card2)] disabled:opacity-50 disabled:cursor-not-allowed transition-all ${className}`}
    >
      <Download className="w-3.5 h-3.5" />
      <span>{buttonText}</span>
    </button>
  );
}
