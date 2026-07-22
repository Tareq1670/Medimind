"use client";

import { useAnalytics } from "@/hooks/useStats";
import { Skeleton } from "@heroui/react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area,
} from "recharts";
import { useChartTheme } from "@/lib/chart-theme";

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card-standard p-5">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</p>
    </div>
  );
}

export default function AnalyticsPage() {
  const { data: stats, isLoading } = useAnalytics();
  const chart = useChartTheme();

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="card-standard p-5 space-y-3">
              <Skeleton className="h-3 w-20 rounded-lg" />
              <Skeleton className="h-8 w-12 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Platform Analytics</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">System-wide metrics and insights</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard label="Total Users" value={stats?.totalUsers ?? 0} />
        <StatCard label="Doctors" value={stats?.totalDoctors ?? 0} />
        <StatCard label="Patients" value={stats?.totalPatients ?? 0} />
        <StatCard label="Medicines" value={stats?.totalMedicines ?? 0} />
        <StatCard label="Reviews" value={stats?.totalReviews ?? 0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {stats?.userGrowth && stats.userGrowth.length > 0 && (
          <div className="card-standard p-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">User Growth</h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={stats.userGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke={chart.gridColor} />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: chart.tickColor }} />
                <YAxis tick={{ fontSize: 12, fill: chart.tickColor }} />
                <Tooltip contentStyle={{ background: chart.tooltipBg, border: `1px solid ${chart.tooltipBorder}`, borderRadius: "8px", color: chart.tooltipText }} />
                <Area type="monotone" dataKey="count" stroke="#2563EB" fill="#2563EB" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {stats?.contentGrowth && stats.contentGrowth.length > 0 && (
          <div className="card-standard p-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Content Growth</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={stats.contentGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke={chart.gridColor} />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: chart.tickColor }} />
                <YAxis tick={{ fontSize: 12, fill: chart.tickColor }} />
                <Tooltip contentStyle={{ background: chart.tooltipBg, border: `1px solid ${chart.tooltipBorder}`, borderRadius: "8px", color: chart.tooltipText }} />
                <Bar dataKey="medicines" fill="#2563EB" radius={[4, 4, 0, 0]} name="Medicines" />
                <Bar dataKey="blogs" fill="#14B8A6" radius={[4, 4, 0, 0]} name="Blogs" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {stats?.aiUsage && stats.aiUsage.length > 0 && (
          <div className="card-standard p-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">AI Usage</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={stats.aiUsage}>
                <CartesianGrid strokeDasharray="3 3" stroke={chart.gridColor} />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: chart.tickColor }} />
                <YAxis tick={{ fontSize: 12, fill: chart.tickColor }} />
                <Tooltip contentStyle={{ background: chart.tooltipBg, border: `1px solid ${chart.tooltipBorder}`, borderRadius: "8px", color: chart.tooltipText }} />
                <Line type="monotone" dataKey="count" stroke="#7C3AED" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {stats?.systemHealth && (
          <div className="card-standard p-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">System Health</h3>
            <div className="space-y-4">
              {Object.entries(stats.systemHealth).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400 capitalize">{key}</span>
                  <span className={`flex items-center gap-1.5 text-sm font-medium ${value ? "text-green-500" : "text-red-500"}`}>
                    <span className={`w-2 h-2 rounded-full ${value ? "bg-green-500" : "bg-red-500"}`} />
                    {value ? "Operational" : "Down"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
