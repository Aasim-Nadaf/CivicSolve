"use client";
import * as React from "react";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const mockData = [
  { name: "SDG 11 (Cities)", unresolved: 400, resolved: 240 },
  { name: "SDG 16 (Peace)", unresolved: 300, resolved: 139 },
  { name: "SDG 9 (Infra)", unresolved: 200, resolved: 980 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-canvas border border-hairline rounded-sm px-4 py-3 shadow-[var(--shadow-level-3)]">
        <p className="text-body-sm-strong mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-body-sm">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-mute capitalize">{entry.dataKey}:</span>
            <span className="text-ink font-medium">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminDashboard({ stats }: { stats: any }) {
  const resolutionRate =
    stats.totalReports > 0
      ? ((stats.resolvedReports / stats.totalReports) * 100).toFixed(1)
      : "0";

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <p className="text-eyebrow mb-2">National Overview</p>
        <h1 className="text-display-lg mb-4">Analytics Dashboard</h1>
        <p className="text-body-lg">
          Overview of civic issues and SDG progress across all jurisdictions.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        <StatCard
          icon={
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          }
          value={stats.totalReports}
          label="Total Reports"
        />
        <StatCard
          icon={
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          }
          value={stats.resolvedReports}
          label="Issues Resolved"
          trend={{
            value: `${resolutionRate}% rate`,
            positive: parseFloat(resolutionRate) > 50,
          }}
        />
        <StatCard
          icon={
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M12 20V10" />
              <path d="M18 20V4" />
              <path d="M6 20v-4" />
            </svg>
          }
          value={`${resolutionRate}%`}
          label="Resolution Rate"
        />
      </div>

      {/* Chart */}
      <Card variant="feature" elevation={2}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-display-sm mb-1">SDG Progress</h3>
            <p className="text-body-sm text-mute">
              Resolved vs unresolved issues by Sustainable Development Goal
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-accent-blue" />
              <span className="text-body-sm text-mute">Resolved</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-accent-purple" />
              <span className="text-body-sm text-mute">Unresolved</span>
            </div>
          </div>
        </div>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockData} barCategoryGap="25%">
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--color-hairline)"
              />
              <XAxis
                dataKey="name"
                tick={{
                  fill: "var(--color-mute)",
                  fontSize: 12,
                  fontFamily: "var(--font-inter)",
                }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{
                  fill: "var(--color-mute)",
                  fontSize: 12,
                  fontFamily: "var(--font-inter)",
                }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(0,0,0,0.02)" }}
              />
              <Bar
                dataKey="resolved"
                stackId="a"
                fill="var(--color-accent-blue)"
                radius={[0, 0, 4, 4]}
              />
              <Bar
                dataKey="unresolved"
                stackId="a"
                fill="var(--color-accent-purple)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
