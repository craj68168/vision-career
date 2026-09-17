"use client";

import {
  BriefcaseBusiness,
  Building2,
  ClipboardCheck,
  CreditCard,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Send,
  Users,
} from "lucide-react";

import { useStaffDashboard } from "./hook";

import type { StaffPermission } from "@/components/auth/Staff/types";

// ======================================================
// MENU
// ======================================================

type MenuItem = {
  label: string;

  permission: StaffPermission;

  icon: React.ComponentType<{
    className?: string;
  }>;
};

const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    permission: "dashboard:view",
    icon: LayoutDashboard,
  },

  {
    label: "Vacancies",
    permission: "vacancies:view",
    icon: BriefcaseBusiness,
  },

  {
    label: "Applications",
    permission: "applications:view",
    icon: FileText,
  },

  {
    label: "Clients",
    permission: "providers:view",
    icon: Building2,
  },

  {
    label: "Job Seekers",
    permission: "seekers:view",
    icon: Users,
  },

  {
    label: "Placement Requests",
    permission: "placement_requests:view",
    icon: ClipboardCheck,
  },

  {
    label: "Placement Billings",
    permission: "billing:view",
    icon: CreditCard,
  },

  {
    label: "Staff Training",
    permission: "training:view",
    icon: GraduationCap,
  },
];

// ======================================================
// DASHBOARD
// ======================================================

export default function StaffDashboard() {
  const { staff, summary, isLoading, hasDashboardPermission, logout } =
    useStaffDashboard();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F8FA]">
        <p className="text-sm text-slate-500">Loading Staff dashboard...</p>
      </div>
    );
  }

  if (!staff) {
    return null;
  }

  const visibleMenu = menuItems.filter((item) =>
    staff.permissions.includes(item.permission),
  );

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xl font-bold text-slate-950">Staff Panel</p>

            <p className="text-xs text-slate-500">
              {staff.name} • {staff.staffId}
            </p>
          </div>

          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>

        {/* NAVIGATION */}

        <div className="border-t border-slate-100">
          <div className="mx-auto flex max-w-7xl flex-wrap gap-1 px-6 py-2">
            {visibleMenu.map(({ label, icon: Icon }) => (
              <button
                key={label}
                type="button"
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
              >
                <Icon className="h-4 w-4" />

                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ================================================= */}
      {/* CONTENT */}
      {/* ================================================= */}

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-7">
          <h1 className="text-3xl font-bold text-slate-950">Dashboard</h1>

          <p className="mt-1 text-sm text-slate-500">
            Welcome back, {staff.name}.
          </p>
        </div>

        {!hasDashboardPermission ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <p className="font-semibold text-amber-800">
              Dashboard access is not enabled for your Staff account.
            </p>

            <p className="mt-1 text-sm text-amber-700">
              Use the modules assigned to you by an administrator.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <SummaryCard
                title="Job Seekers"
                value={summary?.jobSeekers.total ?? 0}
                icon={Users}
              />

              <SummaryCard
                title="Job Providers"
                value={summary?.providers.total ?? 0}
                icon={Building2}
              />

              <SummaryCard
                title="Vacancies"
                value={summary?.vacancies.total ?? 0}
                note={`Published: ${summary?.vacancies.published ?? 0}`}
                icon={BriefcaseBusiness}
              />

              <SummaryCard
                title="Applications"
                value={summary?.applications.total ?? 0}
                note={`Pending: ${
                  summary?.applications.pendingAdminApproval ?? 0
                }`}
                icon={FileText}
              />

              <SummaryCard
                title="Pending Vacancy Reviews"
                value={summary?.vacancies.pendingReview ?? 0}
                icon={ClipboardCheck}
              />

              <SummaryCard
                title="Pending Applications"
                value={summary?.applications.pendingAdminApproval ?? 0}
                icon={Users}
              />

              <SummaryCard
                title="Provider Process"
                value={summary?.applications.providerProcess ?? 0}
                icon={Send}
              />

              <SummaryCard
                title="Placement Requests"
                value={summary?.placementRequests.total ?? 0}
                icon={ClipboardCheck}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}

// ======================================================
// SUMMARY CARD
// ======================================================

function SummaryCard({
  title,
  value,
  note,
  icon: Icon,
}: {
  title: string;

  value: number;

  note?: string;

  icon: React.ComponentType<{
    className?: string;
  }>;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>

          <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>

          {note && <p className="mt-1 text-xs text-slate-500">{note}</p>}
        </div>

        <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
