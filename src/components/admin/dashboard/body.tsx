"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Building2,
  Briefcase,
  FileText,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  UserPlus,
  UserCheck,
  UserX,
  Eye,
  ChevronRight,
  MoreVertical,
  Download,
  Filter,
  RefreshCw,
  Loader2,
  GraduationCap,
  BookOpen,
  File,
  FolderTree,
  CreditCard,
  ClipboardList,
  UserCog,
  PieChart,
  BarChart3,
  Activity,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import {
  useAdminDashboard,
  MonthlyCount,
  MonthlyBilling,
} from "@/hooks/useAdminDashboard";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  ComposedChart,
} from "recharts";
import toast from "react-hot-toast";

// Color palettes
const COLORS = {
  primary: "#4F46E5",
  primaryLight: "#818CF8",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#3B82F6",
  purple: "#8B5CF6",
  pink: "#EC4899",
  indigo: "#6366F1",
  cyan: "#06B6D4",
  orange: "#F97316",
  teal: "#14B8A6",
  gray: "#6B7280",
  lightGray: "#E5E7EB",
  darkGray: "#374151",
};

const CHART_COLORS = [
  COLORS.primary,
  COLORS.success,
  COLORS.warning,
  COLORS.danger,
  COLORS.info,
  COLORS.purple,
  COLORS.pink,
  COLORS.indigo,
  COLORS.cyan,
  COLORS.orange,
  COLORS.teal,
];

interface AdminDashboardProps {
  setActiveDashboardTab: React.Dispatch<React.SetStateAction<string>>;
}

export default function AdminDashboard({
  setActiveDashboardTab,
}: AdminDashboardProps) {
  const { lang } = useLanguage();
  const [timeRange, setTimeRange] = useState<"7" | "30" | "90">("30");
  const [activeTab, setActiveTab] = useState<"overview" | "training">(
    "overview",
  );
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check for dark mode
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);
  }, []);

  const { data, isLoading, error, refetch, isFetching } = useAdminDashboard();

  // Dark mode aware colors for charts
  const getChartColors = () => {
    return {
      grid: isDarkMode ? COLORS.darkGray : COLORS.lightGray,
      text: isDarkMode ? "#9CA3AF" : "#6B7280",
      background: isDarkMode ? "#1F2937" : "#FFFFFF",
      tooltipBg: isDarkMode ? "#1F2937" : "#FFFFFF",
      tooltipText: isDarkMode ? "#F9FAFB" : "#111827",
      tooltipBorder: isDarkMode ? "#374151" : "#E5E7EB",
    };
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-indigo-600 dark:text-indigo-400" />
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
            {lang === "ja"
              ? "ダッシュボードを読み込み中..."
              : "Loading dashboard..."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-900">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center max-w-md dark:border-red-800 dark:bg-red-900/20">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 dark:text-red-400" />
          <h3 className="mt-4 text-lg font-semibold text-red-800 dark:text-red-300">
            {lang === "ja" ? "エラーが発生しました" : "An error occurred"}
          </h3>
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            {error instanceof Error
              ? error.message
              : "Failed to load dashboard"}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition dark:bg-red-500 dark:hover:bg-red-600"
          >
            <RefreshCw className="h-4 w-4" />
            {lang === "ja" ? "再読み込み" : "Retry"}
          </button>
        </div>
      </div>
    );
  }

  const dashboardData = data?.data;
  if (!dashboardData) return null;

  const { summary, status_breakdown, recent, charts } = dashboardData;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(lang === "ja" ? "ja-JP" : "en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat(lang === "ja" ? "ja-JP" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(date);
    } catch {
      return dateString;
    }
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const statusMap: Record<
      string,
      { color: string; darkColor: string; label: { ja: string; en: string } }
    > = {
      active: {
        color: "bg-emerald-50 text-emerald-700 border-emerald-200",
        darkColor:
          "dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
        label: { ja: "有効", en: "Active" },
      },
      inactive: {
        color: "bg-slate-100 text-slate-600 border-slate-200",
        darkColor:
          "dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
        label: { ja: "無効", en: "Inactive" },
      },
      pending: {
        color: "bg-yellow-50 text-yellow-700 border-yellow-200",
        darkColor:
          "dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
        label: { ja: "保留中", en: "Pending" },
      },
      reviewed: {
        color: "bg-blue-50 text-blue-700 border-blue-200",
        darkColor:
          "dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
        label: { ja: "レビュー済み", en: "Reviewed" },
      },
      shortlisted: {
        color: "bg-indigo-50 text-indigo-700 border-indigo-200",
        darkColor:
          "dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800",
        label: { ja: "選考中", en: "Shortlisted" },
      },
      rejected: {
        color: "bg-red-50 text-red-700 border-red-200",
        darkColor: "dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
        label: { ja: "不合格", en: "Rejected" },
      },
      hired: {
        color: "bg-emerald-50 text-emerald-700 border-emerald-200",
        darkColor:
          "dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
        label: { ja: "採用", en: "Hired" },
      },
      open: {
        color: "bg-emerald-50 text-emerald-700 border-emerald-200",
        darkColor:
          "dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
        label: { ja: "公開中", en: "Open" },
      },
      expired: {
        color: "bg-slate-100 text-slate-600 border-slate-200",
        darkColor:
          "dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
        label: { ja: "期限切れ", en: "Expired" },
      },
      suspended: {
        color: "bg-red-50 text-red-700 border-red-200",
        darkColor: "dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
        label: { ja: "停止中", en: "Suspended" },
      },
      in_progress: {
        color: "bg-blue-50 text-blue-700 border-blue-200",
        darkColor:
          "dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
        label: { ja: "進行中", en: "In Progress" },
      },
      closed: {
        color: "bg-slate-100 text-slate-600 border-slate-200",
        darkColor:
          "dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
        label: { ja: "クローズ", en: "Closed" },
      },
      cancelled: {
        color: "bg-red-50 text-red-700 border-red-200",
        darkColor: "dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
        label: { ja: "キャンセル", en: "Cancelled" },
      },
      recommended: {
        color: "bg-indigo-50 text-indigo-700 border-indigo-200",
        darkColor:
          "dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800",
        label: { ja: "推薦", en: "Recommended" },
      },
      sent_to_company: {
        color: "bg-blue-50 text-blue-700 border-blue-200",
        darkColor:
          "dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
        label: { ja: "会社送付", en: "Sent to Company" },
      },
      interview: {
        color: "bg-purple-50 text-purple-700 border-purple-200",
        darkColor:
          "dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
        label: { ja: "面接", en: "Interview" },
      },
      selected: {
        color: "bg-emerald-50 text-emerald-700 border-emerald-200",
        darkColor:
          "dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
        label: { ja: "選定", en: "Selected" },
      },
      joined: {
        color: "bg-teal-50 text-teal-700 border-teal-200",
        darkColor:
          "dark:bg-teal-900/30 dark:text-teal-400 dark:border-teal-800",
        label: { ja: "入社", en: "Joined" },
      },
      draft: {
        color: "bg-slate-100 text-slate-600 border-slate-200",
        darkColor:
          "dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
        label: { ja: "下書き", en: "Draft" },
      },
      sent: {
        color: "bg-blue-50 text-blue-700 border-blue-200",
        darkColor:
          "dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
        label: { ja: "送信済み", en: "Sent" },
      },
      paid: {
        color: "bg-emerald-50 text-emerald-700 border-emerald-200",
        darkColor:
          "dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
        label: { ja: "支払済み", en: "Paid" },
      },
      overdue: {
        color: "bg-red-50 text-red-700 border-red-200",
        darkColor: "dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
        label: { ja: "期限切れ", en: "Overdue" },
      },
      due: {
        color: "bg-yellow-50 text-yellow-700 border-yellow-200",
        darkColor:
          "dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
        label: { ja: "支払期限", en: "Due" },
      },
      due_soon: {
        color: "bg-orange-50 text-orange-700 border-orange-200",
        darkColor:
          "dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800",
        label: { ja: "期限近い", en: "Due Soon" },
      },
      partial: {
        color: "bg-yellow-50 text-yellow-700 border-yellow-200",
        darkColor:
          "dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
        label: { ja: "一部支払", en: "Partial" },
      },
      not_invoiced: {
        color: "bg-slate-100 text-slate-600 border-slate-200",
        darkColor:
          "dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
        label: { ja: "未請求", en: "Not Invoiced" },
      },
      unpaid: {
        color: "bg-red-50 text-red-700 border-red-200",
        darkColor: "dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
        label: { ja: "未払い", en: "Unpaid" },
      },
    };

    const info = statusMap[status?.toLowerCase()] || {
      color: "bg-slate-100 text-slate-600 border-slate-200",
      darkColor: "dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
      label: { ja: status || "不明", en: status || "Unknown" },
    };

    return (
      <span
        className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${info.color} ${info.darkColor}`}
      >
        {lang === "ja" ? info.label.ja : info.label.en}
      </span>
    );
  };

  // Stat Card Component
  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    subtitle,
    trend,
    trendValue,
  }: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
    subtitle?: string;
    trend?: "up" | "down" | "neutral";
    trendValue?: string;
  }) => {
    const trendColors = {
      up: "text-emerald-600 dark:text-emerald-400",
      down: "text-red-600 dark:text-red-400",
      neutral: "text-slate-600 dark:text-slate-400",
    };

    const bgColors: Record<string, string> = {
      primary:
        "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
      success:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
      warning:
        "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
      danger: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
      info: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
      purple:
        "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
      pink: "bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400",
      teal: "bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400",
      orange:
        "bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
      gray: "bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
      emerald:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    };

    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {title}
            </p>
            <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
              {value}
            </p>
            {subtitle && (
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                {subtitle}
              </p>
            )}
            {trend && trendValue && (
              <div className="mt-2 flex items-center gap-1">
                {trend === "up" && (
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                )}
                {trend === "down" && (
                  <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                )}
                <span className={`text-xs font-medium ${trendColors[trend]}`}>
                  {trendValue}
                </span>
              </div>
            )}
          </div>
          <div className={`rounded-xl p-3 ${bgColors[color] || bgColors.gray}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </div>
    );
  };

  // Custom Tooltip for Charts
  const CustomTooltip = ({ active, payload, label, valueFormatter }: any) => {
    const chartColors = getChartColors();
    if (active && payload && payload.length) {
      return (
        <div
          className="rounded-xl border p-3 shadow-lg"
          style={{
            backgroundColor: chartColors.tooltipBg,
            borderColor: chartColors.tooltipBorder,
          }}
        >
          <p
            className="text-sm font-semibold"
            style={{ color: chartColors.tooltipText }}
          >
            {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <p
              key={index}
              className="text-sm"
              style={{ color: chartColors.tooltipText }}
            >
              {entry.name}:{" "}
              {valueFormatter ? valueFormatter(entry.value) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const chartColors = getChartColors();

  return (
    <div className="min-h-screen max-w-7xl mx-auto bg-slate-50 dark:bg-slate-900 px-4 md:px-8">
      <div className="space-y-6 py-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {lang === "ja" ? "ダッシュボード" : "Dashboard"}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {lang === "ja"
                ? "システム全体の概要と主要な指標"
                : "System overview and key metrics"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-800">
              <button
                onClick={() => setActiveTab("overview")}
                className={`rounded-lg cursor-pointer px-3 py-1.5 text-sm font-medium transition ${
                  activeTab === "overview"
                    ? "bg-indigo-600 text-white dark:bg-indigo-500"
                    : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700"
                }`}
              >
                {lang === "ja" ? "概要" : "Overview"}
              </button>
              <button
                onClick={() => setActiveTab("training")}
                className={`rounded-lg cursor-pointer px-3 py-1.5 text-sm font-medium transition ${
                  activeTab === "training"
                    ? "bg-indigo-600 text-white dark:bg-indigo-500"
                    : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700"
                }`}
              >
                {lang === "ja" ? "トレーニング" : "Training"}
              </button>
            </div>
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <RefreshCw
                className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
              />
              {lang === "ja" ? "更新" : "Refresh"}
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <>
            {/* Summary Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title={lang === "ja" ? "求職者" : "Job Seekers"}
                value={summary.job_seekers.total}
                icon={Users}
                color="primary"
                subtitle={`${lang === "ja" ? "有効" : "Active"}: ${summary.job_seekers.active}`}
              />
              <StatCard
                title={lang === "ja" ? "企業" : "Companies"}
                value={summary.companies.total}
                icon={Building2}
                color="success"
                subtitle={`${lang === "ja" ? "有効" : "Active"}: ${summary.companies.active}`}
              />
              <StatCard
                title={lang === "ja" ? "求人" : "Vacancies"}
                value={summary.vacancies.total}
                icon={Briefcase}
                color="warning"
                subtitle={`${lang === "ja" ? "公開中" : "Open"}: ${summary.vacancies.open}`}
              />
              <StatCard
                title={lang === "ja" ? "案件" : "Placements"}
                value={summary.placements.total}
                icon={FileText}
                color="purple"
                subtitle={formatCurrency(summary.placements.total_fee_amount)}
              />
            </div>

            {/* Secondary Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard
                title={lang === "ja" ? "応募" : "Applications"}
                value={summary.applications.total}
                icon={ClipboardList}
                color="info"
              />
              <StatCard
                title={lang === "ja" ? "依頼" : "Placement Requests"}
                value={summary.placement_requests.total}
                icon={UserCog}
                color="teal"
              />
              <StatCard
                title={lang === "ja" ? "請求" : "Billings"}
                value={summary.billings.total}
                icon={CreditCard}
                color="orange"
              />
              <StatCard
                title={lang === "ja" ? "スタッフ" : "Staff"}
                value={summary.staffs.total}
                icon={UserCheck}
                color="pink"
              />
              <StatCard
                title={lang === "ja" ? "採用候補" : "Placement Candidates"}
                value={summary.placement_candidates.total}
                icon={UserPlus}
                color="indigo"
              />
              <StatCard
                title={lang === "ja" ? "請求額" : "Total Billed"}
                value={formatCurrency(summary.billings.total_billing_amount)}
                icon={DollarSign}
                color="emerald"
              />
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Monthly Job Seekers Chart */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {lang === "ja" ? "月別求職者登録数" : "Monthly Job Seekers"}
                  </h3>
                  <select
                    value={timeRange}
                    onChange={(e) =>
                      setTimeRange(e.target.value as "7" | "30" | "90")
                    }
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    <option value="7">
                      {lang === "ja" ? "過去7ヶ月" : "Last 7 months"}
                    </option>
                    <option value="30">
                      {lang === "ja" ? "過去30ヶ月" : "Last 30 months"}
                    </option>
                    <option value="90">
                      {lang === "ja" ? "過去90ヶ月" : "Last 90 months"}
                    </option>
                  </select>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart
                    data={charts.monthly_job_seekers.slice(
                      0,
                      parseInt(timeRange),
                    )}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="jobSeekersGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={COLORS.primary}
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor={COLORS.primary}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={chartColors.grid}
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11, fill: chartColors.text }}
                    />
                    <YAxis tick={{ fontSize: 11, fill: chartColors.text }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke={COLORS.primary}
                      strokeWidth={2}
                      fill="url(#jobSeekersGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Monthly Placement Requests Chart */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {lang === "ja"
                      ? "月別案件数"
                      : "Monthly Placement Requests"}
                  </h3>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={charts.monthly_placement_requests.slice(
                      0,
                      parseInt(timeRange),
                    )}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={chartColors.grid}
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11, fill: chartColors.text }}
                    />
                    <YAxis tick={{ fontSize: 11, fill: chartColors.text }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="total"
                      fill={COLORS.success}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Monthly Billings Chart */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {lang === "ja" ? "月別請求額" : "Monthly Billings"}
                  </h3>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart
                    data={charts.monthly_billings.slice(0, parseInt(timeRange))}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={chartColors.grid}
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11, fill: chartColors.text }}
                    />
                    <YAxis
                      yAxisId="left"
                      tick={{ fontSize: 11, fill: chartColors.text }}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tick={{ fontSize: 11, fill: chartColors.text }}
                    />
                    <Tooltip
                      content={
                        <CustomTooltip
                          valueFormatter={(value: number) =>
                            formatCurrency(value)
                          }
                        />
                      }
                    />
                    <Bar
                      yAxisId="left"
                      dataKey="total_bills"
                      fill={COLORS.info}
                      radius={[4, 4, 0, 0]}
                      name={lang === "ja" ? "請求書数" : "Bill Count"}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="total_amount"
                      stroke={COLORS.warning}
                      strokeWidth={2}
                      name={lang === "ja" ? "請求額" : "Amount"}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Monthly Applications Chart */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {lang === "ja" ? "月別応募数" : "Monthly Applications"}
                  </h3>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart
                    data={charts.monthly_applications.slice(
                      0,
                      parseInt(timeRange),
                    )}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="applicationsGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={COLORS.purple}
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor={COLORS.purple}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={chartColors.grid}
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11, fill: chartColors.text }}
                    />
                    <YAxis tick={{ fontSize: 11, fill: chartColors.text }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke={COLORS.purple}
                      strokeWidth={2}
                      fill="url(#applicationsGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              {/* Recent Job Seekers */}
              <div className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {lang === "ja" ? "最近の求職者" : "Recent Job Seekers"}
                  </h3>
                  <button
                    onClick={() => setActiveDashboardTab("seekers")}
                    className="flex gap-1 items-center cursor-pointer text-sm text-indigo-600 hover:text-indigo-700 font-medium dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    {lang === "ja" ? "すべて表示" : "View All"}{" "}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  {recent.job_seekers.slice(0, 5).map((seeker) => (
                    <div
                      key={seeker.id}
                      className="flex items-center justify-between rounded-xl border border-slate-100 p-3 hover:bg-slate-50 transition dark:border-slate-700 dark:hover:bg-slate-700/50"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 dark:bg-indigo-900/50">
                          <Users className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate dark:text-white">
                            {seeker.name}
                          </p>
                          <p className="text-xs text-slate-500 truncate dark:text-slate-400">
                            {seeker.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={seeker.status || "active"} />
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          {formatDate(seeker.created_at)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Companies */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {lang === "ja" ? "最近の企業" : "Recent Companies"}
                  </h3>
                  <button
                    onClick={() => setActiveDashboardTab("providers")}
                    className="flex gap-1 items-center cursor-pointer text-sm text-indigo-600 hover:text-indigo-700 font-medium dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    {lang === "ja" ? "すべて表示" : "View All"}{" "}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  {recent.companies.slice(0, 5).map((company) => (
                    <div
                      key={company.id}
                      className="flex items-center justify-between rounded-xl border border-slate-100 p-3 hover:bg-slate-50 transition dark:border-slate-700 dark:hover:bg-slate-700/50"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-9 w-9 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 dark:bg-emerald-900/50">
                          <Building2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate dark:text-white">
                            {company.company_name || company.name}
                          </p>
                          <p className="text-xs text-slate-500 truncate dark:text-slate-400">
                            {company.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={company.status || "active"} />
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          {formatDate(company.created_at)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Placement Requests */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {lang === "ja" ? "最近の案件" : "Recent Placement Requests"}
                  </h3>
                  <button
                    onClick={() => setActiveDashboardTab("placement-requests")}
                    className="flex gap-1 items-center cursor-pointer text-sm text-indigo-600 hover:text-indigo-700 font-medium dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    {lang === "ja" ? "すべて表示" : "View All"}{" "}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  {recent.placement_requests.slice(0, 5).map((request) => (
                    <div
                      key={request.id}
                      className="rounded-xl border border-slate-100 p-3 hover:bg-slate-50 transition dark:border-slate-700 dark:hover:bg-slate-700/50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-slate-900 truncate dark:text-white">
                            {request.job_title}
                          </p>
                          <p className="text-xs text-slate-500 truncate dark:text-slate-400">
                            {request.company_name}
                          </p>
                          <div className="mt-1 flex items-center gap-2">
                            <StatusBadge status={request.request_status} />
                            <span className="text-xs text-slate-400 dark:text-slate-500">
                              {request.number_of_positions}{" "}
                              {lang === "ja" ? "ポジション" : "positions"}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs text-slate-400 flex-shrink-0 ml-2 dark:text-slate-500">
                          {formatDate(request.created_at)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Billings */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {lang === "ja" ? "最近の請求" : "Recent Billings"}
                  </h3>
                  <button
                    onClick={() => setActiveDashboardTab("placement-billings")}
                    className="flex gap-1 items-center cursor-pointer text-sm text-indigo-600 hover:text-indigo-700 font-medium dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    {lang === "ja" ? "すべて表示" : "View All"}{" "}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  {recent.billings.slice(0, 5).map((billing) => (
                    <div
                      key={billing.id}
                      className="rounded-xl border border-slate-100 p-3 hover:bg-slate-50 transition dark:border-slate-700 dark:hover:bg-slate-700/50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-slate-900 truncate dark:text-white">
                              {billing.invoice_number}
                            </p>
                            <StatusBadge status={billing.billing_status} />
                          </div>
                          <p className="text-xs text-slate-500 truncate dark:text-slate-400">
                            {billing.company_name}
                          </p>
                          <p className="text-sm font-semibold text-slate-900 mt-1 dark:text-white">
                            {formatCurrency(billing.total_amount)}
                          </p>
                        </div>
                        <span className="text-xs text-slate-400 flex-shrink-0 ml-2 dark:text-slate-500">
                          {formatDate(billing.created_at)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Training Tab */}
        {activeTab === "training" && (
          <div className="space-y-6">
            {/* Training Summary Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title={lang === "ja" ? "カテゴリー" : "Categories"}
                value={summary.training.total_categories}
                icon={FolderTree}
                color="primary"
                subtitle={`${lang === "ja" ? "有効" : "Active"}: ${summary.training.active_categories}`}
              />
              <StatCard
                title={lang === "ja" ? "トピック" : "Topics"}
                value={summary.training.total_topics}
                icon={BookOpen}
                color="success"
                subtitle={`${lang === "ja" ? "有効" : "Active"}: ${summary.training.active_topics}`}
              />
              <StatCard
                title={lang === "ja" ? "ファイル" : "Files"}
                value={summary.training.total_files}
                icon={File}
                color="warning"
                subtitle={`${lang === "ja" ? "有効" : "Active"}: ${summary.training.active_files}`}
              />
              <StatCard
                title={
                  lang === "ja" ? "トレーニング素材" : "Training Materials"
                }
                value={
                  summary.training.total_topics + summary.training.total_files
                }
                icon={GraduationCap}
                color="purple"
              />
            </div>

            {/* Training Details */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Category Distribution */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <h3 className="text-sm font-semibold text-slate-700 mb-4 dark:text-slate-300">
                  {lang === "ja"
                    ? "カテゴリーとトピックの分布"
                    : "Category & Topic Distribution"}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {lang === "ja" ? "総カテゴリー" : "Total Categories"}
                      </p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {summary.training.total_categories}
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center dark:bg-indigo-900/50">
                      <FolderTree className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {lang === "ja" ? "総トピック" : "Total Topics"}
                      </p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {summary.training.total_topics}
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center dark:bg-emerald-900/50">
                      <BookOpen className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {lang === "ja" ? "総ファイル" : "Total Files"}
                      </p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {summary.training.total_files}
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center dark:bg-amber-900/50">
                      <File className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Active vs Inactive */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <h3 className="text-sm font-semibold text-slate-700 mb-4 dark:text-slate-300">
                  {lang === "ja" ? "アクティブなコンテンツ" : "Active Content"}
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {lang === "ja" ? "カテゴリー" : "Categories"}
                      </span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {summary.training.active_categories}/
                        {summary.training.total_categories}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                      <div
                        className="h-2 rounded-full bg-indigo-600 transition-all dark:bg-indigo-500"
                        style={{
                          width: `${summary.training.total_categories > 0 ? (summary.training.active_categories / summary.training.total_categories) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {lang === "ja" ? "トピック" : "Topics"}
                      </span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {summary.training.active_topics}/
                        {summary.training.total_topics}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                      <div
                        className="h-2 rounded-full bg-emerald-600 transition-all dark:bg-emerald-500"
                        style={{
                          width: `${summary.training.total_topics > 0 ? (summary.training.active_topics / summary.training.total_topics) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {lang === "ja" ? "ファイル" : "Files"}
                      </span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {summary.training.active_files}/
                        {summary.training.total_files}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                      <div
                        className="h-2 rounded-full bg-amber-600 transition-all dark:bg-amber-500"
                        style={{
                          width: `${summary.training.total_files > 0 ? (summary.training.active_files / summary.training.total_files) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h3 className="text-sm font-semibold text-slate-700 mb-4 dark:text-slate-300">
                {lang === "ja" ? "クイックアクション" : "Quick Actions"}
              </h3>
              <div className="grid gap-3 sm:grid-cols-3">
                <button
                  onClick={() => setActiveDashboardTab("training")}
                  className="cursor-pointer flex items-center justify-between rounded-xl border border-slate-200 p-4 hover:bg-slate-50 transition group dark:border-slate-700 dark:hover:bg-slate-700/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-indigo-50 p-2 dark:bg-indigo-900/30">
                      <FolderTree className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {lang === "ja" ? "カテゴリー管理" : "Manage Categories"}
                    </span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 transition dark:text-slate-500 dark:group-hover:text-indigo-400" />
                </button>
                <button
                  onClick={() => setActiveDashboardTab("training")}
                  className="cursor-pointer flex items-center justify-between rounded-xl border border-slate-200 p-4 hover:bg-slate-50 transition group dark:border-slate-700 dark:hover:bg-slate-700/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-emerald-50 p-2 dark:bg-emerald-900/30">
                      <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {lang === "ja" ? "トピック管理" : "Manage Topics"}
                    </span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 transition dark:text-slate-500 dark:group-hover:text-indigo-400" />
                </button>
                <button
                  onClick={() => setActiveDashboardTab("training")}
                  className="cursor-pointer flex items-center justify-between rounded-xl border border-slate-200 p-4 hover:bg-slate-50 transition group dark:border-slate-700 dark:hover:bg-slate-700/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-amber-50 p-2 dark:bg-amber-900/30">
                      <File className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {lang === "ja" ? "ファイル管理" : "Manage Files"}
                    </span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 transition dark:text-slate-500 dark:group-hover:text-indigo-400" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
