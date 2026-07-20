"use client";

import { useAuthSession } from "@/hooks/useAuthSession";
import { useStats } from "@/hooks/useStats";
import { useHealthInsights } from "@/hooks/useAI";
import { useState } from "react";
import Link from "next/link";
import { Skeleton } from "@heroui/react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area,
} from "recharts";
import toast from "react-hot-toast";

const actions = {
  user: [
    { label: "Log Health Record", href: "/health-records", icon: "📋" },
    { label: "Chat with AI", href: "/ai-assistant", icon: "🤖" },
    { label: "Analyze Report", href: "/report-analysis", icon: "📄" },
    { label: "AI Recommendations", href: "/recommendations", icon: "💡" },
  ],
  doctor: [
    { label: "My Patients", href: "/patients", icon: "👥" },
    { label: "Manage Schedule", href: "/schedule", icon: "📅" },
    { label: "AI Assistant", href: "/ai-assistant", icon: "🤖" },
    { label: "Add Medicine", href: "/medicines/add", icon: "💊" },
  ],
  admin: [
    { label: "Manage Users", href: "/users", icon: "👥" },
    { label: "Moderate Reviews", href: "/reviews", icon: "⭐" },
    { label: "View Analytics", href: "/analytics", icon: "📊" },
    { label: "Settings", href: "/admin/settings", icon: "⚙️" },
  ],
};

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="card-standard p-5">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</p>
      {sub && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{sub}</p>}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="card-standard p-5 space-y-3">
      <Skeleton className="h-3 w-24 rounded-lg" />
      <Skeleton className="h-8 w-16 rounded-lg" />
    </div>
  );
}

function HealthInsightsCard() {
  const { user } = useAuthSession();
  const getInsights = useHealthInsights();
  const [insights, setInsights] = useState<Awaited<ReturnType<typeof getInsights.mutateAsync>> | null>(null);

  const handleGenerate = async () => {
    try {
      const result = await getInsights.mutateAsync();
      setInsights(result);
    } catch {
      toast.error("Failed to generate insights");
    }
  };

  if (!user || user.role !== "user") return null;

  return (
    <div className="card-standard p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <span className="text-lg">🧠</span> AI Health Insights
        </h3>
        <button
          onClick={handleGenerate}
          disabled={getInsights.isPending}
          className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 disabled:opacity-50 transition-colors"
        >
          {getInsights.isPending ? "Analyzing..." : insights ? "Refresh Insights" : "Get Insights"}
        </button>
      </div>

      {!insights && !getInsights.isPending && (
        <p className="text-sm text-slate-400 dark:text-slate-500">
          Click &quot;Get Insights&quot; to analyze your health records and receive personalized AI-powered recommendations.
        </p>
      )}

      {getInsights.isPending && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-4 w-full rounded-lg" />)}
        </div>
      )}

      {insights && (
        <div className="space-y-4">
          {insights.overallAssessment && (
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{insights.overallAssessment}</p>
          )}

          {insights.keyTrends?.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Key Trends</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {insights.keyTrends.slice(0, 4).map((trend, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className={trend.direction === "improving" ? "text-green-500" : trend.direction === "declining" ? "text-red-500" : "text-slate-400"}>
                      {trend.direction === "improving" ? "↑" : trend.direction === "declining" ? "↓" : "→"}
                    </span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{trend.metric}</span>
                    <span className="text-slate-400 text-xs">{trend.insight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {insights.personalizedRecommendations?.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Recommendations</h4>
              <ul className="space-y-1">
                {insights.personalizedRecommendations.slice(0, 3).map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <span className="text-primary mt-0.5">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {insights.areasNeedingAttention?.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-amber-500 uppercase tracking-wider mb-2">Needs Attention</h4>
              <ul className="space-y-1">
                {insights.areasNeedingAttention.slice(0, 3).map((area, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <span className="text-amber-500 mt-0.5">⚠</span>
                    {area}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function UserDashboard() {
  const { data, isLoading } = useStats("user");

  if (isLoading) return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
    </div>
  );

  const stats = data?.user;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Health Score" value={stats?.healthScore ?? "—"} />
        <StatCard label="Health Records" value={stats?.recordCount ?? 0} />
        <StatCard label="Active Sessions" value={stats?.recentActivity?.length ?? 0} sub="This month" />
      </div>

      <HealthInsightsCard />

      {stats?.vitalsTrend && stats.vitalsTrend.length > 0 && (
        <div className="card-standard p-5">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Vitals Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={stats.vitalsTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#2563EB" fill="#2563EB" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {stats?.recentActivity && stats.recentActivity.length > 0 && (
        <div className="card-standard p-5">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {stats.recentActivity.map((a, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{a.label}</p>
                  <p className="text-xs text-slate-400">{a.date}</p>
                </div>
                <span className="text-sm text-slate-500">{a.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DoctorDashboard() {
  const { data, isLoading } = useStats("doctor");

  if (isLoading) return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
    </div>
  );

  const stats = data?.doctor;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total Patients" value={stats?.patientCount ?? 0} />
        <StatCard label="Appointments" value={stats?.appointmentCount ?? 0} sub="This month" />
        <StatCard label="Reviews" value={stats?.reviewCount ?? 0} />
        <StatCard label="Earnings" value={stats?.earnings ? `$${stats.earnings}` : "$0"} sub="This month" />
      </div>
    </div>
  );
}

function AdminDashboard() {
  const { data, isLoading } = useStats("admin");

  if (isLoading) return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {[1, 2, 3, 4, 5].map((i) => <SkeletonCard key={i} />)}
    </div>
  );

  const stats = data?.admin;

  return (
    <div className="space-y-6">
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
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={stats.userGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#2563EB" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        {stats?.aiUsage && stats.aiUsage.length > 0 && (
          <div className="card-standard p-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">AI Usage</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={stats.aiUsage}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#14B8A6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {stats?.systemHealth && (
        <div className="card-standard p-5">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">System Health</h3>
          <div className="flex gap-6">
            {Object.entries(stats.systemHealth).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${value ? "bg-green-500" : "bg-red-500"}`} />
                <span className="text-sm text-slate-600 dark:text-slate-400 capitalize">{key}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuthSession();
  const role = user?.role || "user";
  const quickActions = actions[role as keyof typeof actions] || actions.user;

  const titles: Record<string, string> = {
    user: "Your Health Overview",
    doctor: "Doctor Dashboard",
    admin: "Admin Dashboard",
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {titles[role] || "Dashboard"}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Welcome back, {user?.name?.split(" ")[0] || "User"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickActions.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="card-standard p-4 flex items-center gap-3 hover:shadow-md transition-shadow"
          >
            <span className="text-xl">{a.icon}</span>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{a.label}</span>
          </Link>
        ))}
      </div>

      {role === "user" && <UserDashboard />}
      {role === "doctor" && <DoctorDashboard />}
      {role === "admin" && <AdminDashboard />}
    </div>
  );
}
