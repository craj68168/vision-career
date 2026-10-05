"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import type { ComponentType } from "react";

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
  ShieldCheck,
  UserRoundSearch,
  Users,
} from "lucide-react";

import { useStaffDashboard } from "./hook";

import type { StaffPermission } from "@/components/auth/Staff/types";

// ======================================================
// MENU TYPE
// ======================================================

type MenuItem = {
  label: string;

  permission?: StaffPermission;

  href: string;

  icon: ComponentType<{
    className?: string;
  }>;
};

// ======================================================
// STAFF MENU
// ======================================================
//
// AUTOMATIC:
// Dashboard
// Staff Training
// Security
//
// These three modules are available to every
// authenticated active Staff account.
//
// All other modules depend on assigned permissions.
// ======================================================

const menuItems: MenuItem[] = [
  // ====================================================
  // DASHBOARD
  //
  // Automatic access.
  // ====================================================

  {
    label: "Dashboard",

    href: "/staff",

    icon: LayoutDashboard,
  },

  // ====================================================
  // VACANCIES
  // ====================================================

  {
    label: "Vacancies",

    permission: "vacancies:view",

    href: "/staff/vacancies",

    icon: BriefcaseBusiness,
  },

  // ====================================================
  // APPLICATIONS
  // ====================================================

  {
    label: "Applications",

    permission: "applications:view",

    href: "/staff/applications",

    icon: FileText,
  },

  // ====================================================
  // CLIENTS / PROVIDERS
  // ====================================================

  {
    label: "Clients",

    permission: "providers:view",

    href: "/staff/clients",

    icon: Building2,
  },

  // ====================================================
  // JOB SEEKERS
  // ====================================================

  {
    label: "Job Seekers",

    permission: "seekers:view",

    href: "/staff/job-seekers",

    icon: Users,
  },

  // ====================================================
  // PLACEMENT REQUESTS
  // ====================================================

  {
    label: "Placement Requests",

    permission: "placement_requests:view",

    href: "/staff/placement-requests",

    icon: ClipboardCheck,
  },

  // ====================================================
  // PLACEMENT CANDIDATES
  // ====================================================

  {
    label: "Placement Candidates",

    permission: "placement_requests:manage_candidates",

    href: "/staff/placement-candidates",

    icon: UserRoundSearch,
  },

  // ====================================================
  // PLACEMENT BILLINGS
  // ====================================================

  {
    label: "Placement Billings",

    permission: "billing:view",

    href: "/staff/placement-billings",

    icon: CreditCard,
  },

  // ====================================================
  // STAFF TRAINING
  //
  // Automatic access.
  // ====================================================

  {
    label: "Staff Training",

    href: "/staff/training",

    icon: GraduationCap,
  },

  // ====================================================
  // SECURITY
  //
  // Automatic access.
  // Every authenticated active Staff user can manage
  // their own password.
  // ====================================================

  {
    label: "Security",

    href: "/staff/security",

    icon: ShieldCheck,
  },
];

// ======================================================
// STAFF DASHBOARD
// ======================================================

export default function StaffDashboard() {
  const pathname = usePathname();

  const {
    staff,

    summary,

    isLoading,

    logout,
  } = useStaffDashboard();

  // ====================================================
  // LANGUAGE PREFIX
  // ====================================================

  const prefix = pathname.startsWith("/en/") ? "/en" : "";

  // ====================================================
  // LOADING
  // ====================================================

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F8FA]">
        <p className="text-sm text-slate-500">Loading Staff dashboard...</p>
      </div>
    );
  }

  // ====================================================
  // NO STAFF
  //
  // StaffRouteGuard / auth handling will redirect an
  // invalid Staff session.
  // ====================================================

  if (!staff) {
    return null;
  }

  // ====================================================
  // PERMISSION-CONTROLLED MENU
  //
  // Items without permission are always visible.
  //
  // Automatic:
  // Dashboard
  // Staff Training
  // Security
  //
  // Assigned:
  // Vacancies
  // Applications
  // Clients
  // Job Seekers
  // Placement Requests
  // Placement Candidates
  // Placement Billings
  // ====================================================

  const visibleMenu = menuItems.filter((item) => {
    if (!item.permission) {
      return true;
    }

    return staff.permissions.includes(item.permission);
  });

  // ====================================================
  // ACTIVE ROUTE CHECK
  // ====================================================

  const isMenuActive = (href: string) => {
    const fullHref = `${prefix}${href}`;

    if (href === "/staff") {
      return pathname === fullHref || pathname === `${fullHref}/`;
    }

    return pathname.startsWith(fullHref);
  };

  // ====================================================
  // SECURITY URL
  // ====================================================

  const securityHref = `${prefix}/staff/security`;

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <header className="border-b border-slate-200 bg-white">
        {/* TOP BAR */}

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-slate-950">Staff Panel</h1>

            <p className="mt-1 text-xs text-slate-500">
              {staff.name}
              {" • "}
              {staff.staffId}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              void logout();
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>

        {/* ================================================= */}
        {/* NAVIGATION */}
        {/* ================================================= */}

        <div className="border-t border-slate-100">
          <nav className="mx-auto flex max-w-7xl flex-wrap items-center gap-1 px-6 py-2">
            {visibleMenu.map((item) => {
              const Icon = item.icon;

              const href = `${prefix}${item.href}`;

              const active = isMenuActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={href}
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                    active
                      ? "bg-indigo-50 font-semibold text-indigo-600"
                      : "text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                  }`}
                >
                  <Icon className="h-4 w-4" />

                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* ================================================= */}
      {/* DASHBOARD */}
      {/* ================================================= */}

      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* PAGE HEADER */}

        <div className="mb-7">
          <h2 className="text-3xl font-bold text-slate-950">Dashboard</h2>

          <p className="mt-1 text-sm text-slate-500">
            Welcome back, {staff.name}.
          </p>
        </div>

        {/* ================================================= */}
        {/* SECURITY */}
        {/* ================================================= */}

        <div className="mb-6">
          <DashboardActionCard
            title="Security"
            description="Manage your account security and change your password."
            href={securityHref}
            icon={ShieldCheck}
          />
        </div>

        {/* ================================================= */}
        {/* DASHBOARD SUMMARY */}
        {/* Dashboard is automatic for every active Staff. */}
        {/* ================================================= */}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* ================================================= */}
          {/* JOB SEEKERS */}
          {/* ================================================= */}

          <SummaryCard
            title="Job Seekers"
            value={summary?.jobSeekers.total ?? 0}
            icon={Users}
          />

          {/* ================================================= */}
          {/* JOB PROVIDERS */}
          {/* ================================================= */}

          <SummaryCard
            title="Job Providers"
            value={summary?.providers.total ?? 0}
            icon={Building2}
          />

          {/* ================================================= */}
          {/* VACANCIES */}
          {/* ================================================= */}

          <SummaryCard
            title="Vacancies"
            value={summary?.vacancies.total ?? 0}
            note={`Published: ${summary?.vacancies.published ?? 0}`}
            icon={BriefcaseBusiness}
          />

          {/* ================================================= */}
          {/* APPLICATIONS */}
          {/* ================================================= */}

          <SummaryCard
            title="Applications"
            value={summary?.applications.total ?? 0}
            note={`Pending: ${summary?.applications.pendingAdminApproval ?? 0}`}
            icon={FileText}
          />

          {/* ================================================= */}
          {/* PENDING VACANCIES */}
          {/* ================================================= */}

          <SummaryCard
            title="Pending Vacancy Reviews"
            value={summary?.vacancies.pendingReview ?? 0}
            icon={ClipboardCheck}
          />

          {/* ================================================= */}
          {/* PENDING APPLICATIONS */}
          {/* ================================================= */}

          <SummaryCard
            title="Pending Applications"
            value={summary?.applications.pendingAdminApproval ?? 0}
            icon={Users}
          />

          {/* ================================================= */}
          {/* PROVIDER PROCESS */}
          {/* ================================================= */}

          <SummaryCard
            title="Provider Process"
            value={summary?.applications.providerProcess ?? 0}
            icon={Send}
          />

          {/* ================================================= */}
          {/* PLACEMENT REQUESTS */}
          {/* ================================================= */}

          <SummaryCard
            title="Placement Requests"
            value={summary?.placementRequests.total ?? 0}
            icon={ClipboardCheck}
          />

          {/* ================================================= */}
          {/* PLACEMENT CANDIDATES */}
          {/* ================================================= */}

          <SummaryCard
            title="Placement Candidates"
            value={summary?.placementCandidates?.total ?? 0}
            note={`Needs Attention: ${
              summary?.placementCandidates?.needsAttention ?? 0
            }`}
            icon={UserRoundSearch}
          />
        </div>
      </main>
    </div>
  );
}

// ======================================================
// SUMMARY CARD
// ======================================================

type SummaryCardProps = {
  title: string;

  value: number;

  note?: string;

  icon: ComponentType<{
    className?: string;
  }>;
};

function SummaryCard({ title, value, note, icon: Icon }: SummaryCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
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

// ======================================================
// DASHBOARD ACTION CARD
// ======================================================

type DashboardActionCardProps = {
  title: string;

  description: string;

  href: string;

  icon: ComponentType<{
    className?: string;
  }>;
};

function DashboardActionCard({
  title,
  description,
  href,
  icon: Icon,
}: DashboardActionCardProps) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50/30"
    >
      <div className="flex items-center gap-4">
        <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600 transition group-hover:bg-indigo-100">
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <p className="font-semibold text-slate-950">{title}</p>

          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
      </div>

      <span className="text-sm font-semibold text-indigo-600">Open</span>
    </Link>
  );
}
