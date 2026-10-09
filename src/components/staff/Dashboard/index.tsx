"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  ClipboardCheck,
  Clock,
  FileText,
  Send,
  ShieldCheck,
  UserRoundSearch,
  Users,
} from "lucide-react";

import { useStaffDashboard } from "./hook";

import type { StaffPermission } from "@/components/auth/Staff/types";

// ======================================================
// STYLES
//
// Additions for the light accent colors and clickable
// cards. The base classes (metric-card, welcome-section,
// etc.) come from the existing dashboard styles.
// ======================================================

const accentStyles = `
.accent-indigo  { --a: #4f46e5; --a-soft: #eef2ff; --a-line: #c7d2fe; }
.accent-sky     { --a: #0284c7; --a-soft: #f0f9ff; --a-line: #bae6fd; }
.accent-emerald { --a: #059669; --a-soft: #ecfdf5; --a-line: #a7f3d0; }
.accent-violet  { --a: #7c3aed; --a-soft: #f5f3ff; --a-line: #ddd6fe; }
.accent-amber   { --a: #b45309; --a-soft: #fffbeb; --a-line: #fde68a; }
.accent-rose    { --a: #e11d48; --a-soft: #fff1f2; --a-line: #fecdd3; }
.accent-teal    { --a: #0d9488; --a-soft: #f0fdfa; --a-line: #99f6e4; }

.workspace-content .welcome-section {
  background: linear-gradient(120deg, #eef2ff 0%, #f5f3ff 45%, #ffffff 100%);
}

.workspace-content .metric-card,
.workspace-content .operational-card {
  position: relative;
  display: block;
  color: inherit;
  text-decoration: none;
  background: linear-gradient(180deg, var(--a-soft) 0%, #ffffff 75%);
  border-color: var(--a-line);
  transition: border-color .15s, box-shadow .15s;
}

.card-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
.card-icon { display: grid; place-items: center; flex-shrink: 0; width: 34px; height: 34px; border-radius: 8px; background: #ffffff; border: 1px solid var(--a-line); color: var(--a); }
.card-icon svg { width: 16px; height: 16px; }
.operational-card .card-icon { width: 28px; height: 28px; border-radius: 7px; }
.operational-card .card-icon svg { width: 14px; height: 14px; }

.card-arrow { position: absolute; right: 10px; bottom: 10px; width: 14px; height: 14px; color: var(--a); opacity: 0; transition: opacity .15s; }

a.metric-card:hover,
a.operational-card:hover,
a.metric-card:focus-visible,
a.operational-card:focus-visible {
  border-color: var(--a);
  box-shadow: 0 6px 16px -8px color-mix(in srgb, var(--a) 45%, transparent);
  outline: none;
}
a.metric-card:hover .card-arrow,
a.operational-card:hover .card-arrow,
a.metric-card:focus-visible .card-arrow,
a.operational-card:focus-visible .card-arrow { opacity: 1; }

.mini-stat.is-indigo { background: #eef2ff; border-color: #c7d2fe; }
.mini-stat.is-amber  { background: #fffbeb; border-color: #fde68a; }

.workspace-content .security-section { background: linear-gradient(120deg, #fffbeb 0%, #ffffff 70%); }

@media (prefers-reduced-motion: reduce) {
  .workspace-content .metric-card,
  .workspace-content .operational-card,
  .card-arrow { transition: none; }
}
`;

// ======================================================
// TYPES
// ======================================================

type IconType = ComponentType<{ className?: string }>;

type Accent = "indigo" | "sky" | "emerald" | "violet" | "amber" | "rose" | "teal";

type MetricCardProps = {
  title: string;
  value: number;
  icon: IconType;
  accent: Accent;

  // Where the card goes when clicked. Without it
  // (or without permission) the card is not a link.
  href?: string;

  note?: string;
  noteTone?: "positive" | "warning";
  warnValue?: boolean;

  size?: "primary" | "operational";
};

// ======================================================
// METRIC CARD
// ======================================================

function MetricCard({
  title,
  value,
  icon: Icon,
  accent,
  href,
  note,
  noteTone,
  warnValue,
  size = "primary",
}: MetricCardProps) {
  const isOperational = size === "operational";

  const baseClass = isOperational ? "operational-card" : "metric-card";

  const className = `${baseClass} accent-${accent}`;

  const noteClass = isOperational
    ? "tone-warning mt-2 text-[11px]"
    : `metric-note ${
        noteTone === "warning"
          ? "tone-warning"
          : noteTone === "positive"
            ? "tone-positive"
            : "sub"
      }`;

  const content = (
    <>
      <div className="card-head">
        {isOperational ? (
          <h3 className="metric-title">{title}</h3>
        ) : (
          <h2 className="metric-title">{title}</h2>
        )}

        <span className="card-icon" aria-hidden="true">
          <Icon />
        </span>
      </div>

      <div className={`metric-value ${warnValue ? "tone-warning" : ""}`}>
        {value}
      </div>

      {note && <p className={noteClass}>{note}</p>}

      {href && <ArrowUpRight className="card-arrow" aria-hidden="true" />}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className} aria-label={`${title}: ${value}`}>
        {content}
      </Link>
    );
  }

  return <article className={className}>{content}</article>;
}

// ======================================================
// STAFF DASHBOARD
// ======================================================

export default function StaffDashboard() {
  const pathname = usePathname();
  const { staff, summary, isLoading } = useStaffDashboard();

  const prefix = pathname.startsWith("/en/") ? "/en" : "";

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

  // ====================================================
  // CARD LINKS
  //
  // A card is only clickable when the staff member has
  // the permission for the page it opens.
  // ====================================================

  const linkTo = (href: string, permission?: StaffPermission) => {
    if (permission && !staff.permissions.includes(permission)) {
      return undefined;
    }

    return `${prefix}${href}`;
  };

  const securityHref = `${prefix}/staff/security`;

  const pendingVacancyReviews = summary?.vacancies.pendingReview ?? 0;
  const pendingApplications = summary?.applications.pendingAdminApproval ?? 0;
  const needsAttention = summary?.placementCandidates?.needsAttention ?? 0;
  const pendingTotal = pendingVacancyReviews + pendingApplications;

  const primaryMetrics: MetricCardProps[] = [
    {
      title: "Job Seekers",
      value: summary?.jobSeekers.total ?? 0,
      icon: Users,
      accent: "indigo",
      href: linkTo("/staff/job-seekers", "seekers:view"),
    },
    {
      title: "Job Providers",
      value: summary?.providers.total ?? 0,
      icon: Building2,
      accent: "sky",
      href: linkTo("/staff/clients", "providers:view"),
    },
    {
      title: "Vacancies",
      value: summary?.vacancies.total ?? 0,
      icon: BriefcaseBusiness,
      accent: "emerald",
      note: `Published: ${summary?.vacancies.published ?? 0}`,
      noteTone: "positive",
      href: linkTo("/staff/vacancies", "vacancies:view"),
    },
    {
      title: "Applications",
      value: summary?.applications.total ?? 0,
      icon: FileText,
      accent: "violet",
      note: `Pending: ${pendingApplications}`,
      noteTone: pendingApplications > 0 ? "warning" : undefined,
      href: linkTo("/staff/applications", "applications:view"),
    },
  ];

  const operationalMetrics: MetricCardProps[] = [
    {
      title: "Pending Vacancy Reviews",
      value: pendingVacancyReviews,
      icon: ClipboardCheck,
      accent: "amber",
      warnValue: pendingVacancyReviews > 0,
      href: linkTo("/staff/vacancies", "vacancies:view"),
    },
    {
      title: "Pending Applications",
      value: pendingApplications,
      icon: Clock,
      accent: "rose",
      warnValue: pendingApplications > 0,
      href: linkTo("/staff/applications", "applications:view"),
    },
    {
      title: "Provider Process",
      value: summary?.applications.providerProcess ?? 0,
      icon: Send,
      accent: "teal",
      href: linkTo("/staff/applications", "applications:view"),
    },
    {
      title: "Placement Requests",
      value: summary?.placementRequests.total ?? 0,
      icon: ClipboardCheck,
      accent: "indigo",
      href: linkTo("/staff/placement-requests", "placement_requests:view"),
    },
    {
      title: "Placement Candidates",
      value: summary?.placementCandidates?.total ?? 0,
      icon: UserRoundSearch,
      accent: "emerald",
      note: needsAttention > 0 ? `Needs attention: ${needsAttention}` : undefined,
      href: linkTo(
        "/staff/placement-candidates",
        "placement_requests:manage_candidates",
      ),
    },
  ];

  return (
    <div className="workspace-content">
      <style dangerouslySetInnerHTML={{ __html: accentStyles }} />

      <section className="welcome-section" aria-label="Dashboard overview">
        <div className="welcome-grid" />

        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[48ch]">
            <h1 className="font-display text-3xl font-semibold leading-tight lg:text-4xl">
              Welcome back, {staff.name}.
            </h1>

            <p className="sub mt-3 max-w-[48ch] text-sm leading-7">
              Your recruitment overview at a glance. {pendingVacancyReviews}{" "}
              vacancy reviews and {needsAttention} placement candidates need
              attention.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="mini-stat is-indigo">
              <div className="metric-title">Pending</div>
              <div className="font-display tone-positive mt-1 text-xl font-semibold">
                {pendingTotal}
              </div>
            </div>

            <div className="mini-stat is-amber">
              <div className="metric-title">Flagged</div>
              <div className="font-display tone-warning mt-1 text-xl font-semibold">
                {needsAttention}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4"
        aria-label="Recruitment summary"
      >
        {primaryMetrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </section>

      <section className="operational-section" aria-labelledby="operational-title">
        <h2 id="operational-title" className="sub mb-3 text-[10px] uppercase">
          Operational counters
        </h2>

        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-5">
          {operationalMetrics.map((metric) => (
            <MetricCard key={metric.title} size="operational" {...metric} />
          ))}
        </div>
      </section>

      <section className="security-section" aria-label="Account security">
        <div className="flex items-center gap-3">
          <ShieldCheck className="tone-warning size-5 shrink-0" />

          <div>
            <h2 className="text-sm font-medium">Security</h2>
            <p className="sub mt-1 text-xs">
              Manage your account security and change your password.
            </p>
          </div>
        </div>

        <Link href={securityHref} className="btn btn-warning">
          Open
          <ArrowUpRight />
        </Link>
      </section>

      <footer className="workspace-footnote">
        <span>Staff Panel / Dashboard</span>
      </footer>
    </div>
  );
}