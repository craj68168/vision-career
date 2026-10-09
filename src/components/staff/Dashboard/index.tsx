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
// ACCENT COLORS
//
// Full class names are written out (not built from
// strings) so Tailwind can detect them.
//
// Outlines use `ring` (a shadow) instead of `border`, so
// they are not affected by global border-color rules.
// ======================================================

const accents: Record<
  Accent,
  { card: string; hover: string; chip: string; arrow: string }
> = {
  indigo: {
    card: "bg-[linear-gradient(180deg,#eef2ff,#ffffff_75%)] ring-indigo-200",
    hover: "hover:ring-indigo-400 hover:shadow-indigo-500/20 focus-visible:ring-indigo-500",
    chip: "text-indigo-600 ring-indigo-200",
    arrow: "text-indigo-600",
  },
  sky: {
    card: "bg-[linear-gradient(180deg,#f0f9ff,#ffffff_75%)] ring-sky-200",
    hover: "hover:ring-sky-400 hover:shadow-sky-500/20 focus-visible:ring-sky-500",
    chip: "text-sky-600 ring-sky-200",
    arrow: "text-sky-600",
  },
  emerald: {
    card: "bg-[linear-gradient(180deg,#ecfdf5,#ffffff_75%)] ring-emerald-200",
    hover: "hover:ring-emerald-400 hover:shadow-emerald-500/20 focus-visible:ring-emerald-500",
    chip: "text-emerald-600 ring-emerald-200",
    arrow: "text-emerald-600",
  },
  violet: {
    card: "bg-[linear-gradient(180deg,#f5f3ff,#ffffff_75%)] ring-violet-200",
    hover: "hover:ring-violet-400 hover:shadow-violet-500/20 focus-visible:ring-violet-500",
    chip: "text-violet-600 ring-violet-200",
    arrow: "text-violet-600",
  },
  amber: {
    card: "bg-[linear-gradient(180deg,#fffbeb,#ffffff_75%)] ring-amber-200",
    hover: "hover:ring-amber-400 hover:shadow-amber-500/20 focus-visible:ring-amber-500",
    chip: "text-amber-700 ring-amber-200",
    arrow: "text-amber-700",
  },
  rose: {
    card: "bg-[linear-gradient(180deg,#fff1f2,#ffffff_75%)] ring-rose-200",
    hover: "hover:ring-rose-400 hover:shadow-rose-500/20 focus-visible:ring-rose-500",
    chip: "text-rose-600 ring-rose-200",
    arrow: "text-rose-600",
  },
  teal: {
    card: "bg-[linear-gradient(180deg,#f0fdfa,#ffffff_75%)] ring-teal-200",
    hover: "hover:ring-teal-400 hover:shadow-teal-500/20 focus-visible:ring-teal-500",
    chip: "text-teal-600 ring-teal-200",
    arrow: "text-teal-600",
  },
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
  const colors = accents[accent];

  const cardClass = [
    "group relative block min-w-0 rounded-xl ring-1 ring-inset transition-shadow",
    isOperational ? "p-3 sm:p-4" : "p-4 sm:p-5",
    colors.card,
    href
      ? `hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 ${colors.hover}`
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  const titleClass = `font-medium uppercase leading-snug tracking-wide text-slate-500 ${
    isOperational ? "min-h-9 text-[10px] sm:text-[11px]" : "text-[11px]"
  }`;

  const chipClass = `grid shrink-0 place-items-center bg-white ring-1 ring-inset ${colors.chip} ${
    isOperational ? "h-7 w-7 rounded-md" : "h-9 w-9 rounded-lg"
  }`;

  const valueClass = `font-semibold leading-none tabular-nums ${
    warnValue ? "text-amber-700" : "text-slate-950"
  } ${
    isOperational
      ? "mt-2 text-2xl sm:text-[26px]"
      : "mt-3 text-[26px] sm:text-[32px]"
  }`;

  const noteClass = `${isOperational ? "mt-2 text-[11px]" : "mt-2.5 text-xs"} ${
    isOperational || noteTone === "warning"
      ? "text-amber-700"
      : noteTone === "positive"
        ? "text-emerald-700"
        : "text-slate-500"
  }`;

  const content = (
    <>
      <div className="flex items-start justify-between gap-2">
        {isOperational ? (
          <h3 className={titleClass}>{title}</h3>
        ) : (
          <h2 className={titleClass}>{title}</h2>
        )}

        <span className={chipClass} aria-hidden="true">
          <Icon className={isOperational ? "h-3.5 w-3.5" : "h-4 w-4"} />
        </span>
      </div>

      <div className={valueClass}>{value}</div>

      {note && <p className={noteClass}>{note}</p>}

      {href && (
        <ArrowUpRight
          aria-hidden="true"
          className={`absolute bottom-3 right-3 h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 ${colors.arrow}`}
        />
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cardClass} aria-label={`${title}: ${value}`}>
        {content}
      </Link>
    );
  }

  return <article className={cardClass}>{content}</article>;
}

// ======================================================
// STAFF DASHBOARD
// ======================================================

export default function StaffDashboard() {
  const pathname = usePathname();
  const { staff, summary, vacancySummary, placementCandidateSummary, isLoading } =
    useStaffDashboard();

  const prefix = pathname.startsWith("/en/") ? "/en" : "";

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
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

  const pendingVacancyReviews =
    vacancySummary?.pendingReview ?? summary?.vacancies.pendingReview ?? 0;
  const pendingApplications = summary?.applications.pendingAdminApproval ?? 0;
  const vacancyTotal = vacancySummary?.total ?? summary?.vacancies.total ?? 0;
  const publishedVacancies =
    vacancySummary?.published ?? summary?.vacancies.published ?? 0;
  const placementCandidateTotal =
    placementCandidateSummary?.total ?? summary?.placementCandidates?.total ?? 0;
  const needsAttention =
    placementCandidateSummary?.needsAttention ??
    summary?.placementCandidates?.needsAttention ??
    0;

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
      value: vacancyTotal,
      icon: BriefcaseBusiness,
      accent: "emerald",
      note: `Published: ${publishedVacancies}`,
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
      value: placementCandidateTotal,
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
    <div className="mx-auto w-full max-w-[1600px] px-3 py-4 sm:p-5 lg:px-8 lg:py-6">
      {/* ================================================= */}
      {/* WELCOME */}
      {/* ================================================= */}

      <section
        aria-label="Dashboard overview"
        className="relative overflow-hidden rounded-2xl bg-[linear-gradient(120deg,#eef2ff_0%,#f5f3ff_45%,#ffffff_100%)] p-5 ring-1 ring-inset ring-indigo-100 sm:p-6 lg:p-8"
      >
        {/* decorative grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(79,70,229,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(79,70,229,0.07)_1px,transparent_1px)] bg-[length:44px_44px] [mask-image:linear-gradient(90deg,#000,transparent)]"
        />

        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[48ch]">
            <h1 className="text-2xl font-semibold leading-tight text-slate-950 sm:text-3xl lg:text-4xl">
              Welcome back, {staff.name}.
            </h1>

            <p className="mt-3 max-w-[48ch] text-sm leading-7 text-slate-600">
              Your recruitment overview at a glance. {pendingVacancyReviews}{" "}
              vacancy reviews and {needsAttention} placement candidates need
              attention.
            </p>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* PRIMARY METRICS */}
      {/* ================================================= */}

      <section
        aria-label="Recruitment summary"
        className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4"
      >
        {primaryMetrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </section>

      {/* ================================================= */}
      {/* OPERATIONAL COUNTERS */}
      {/* ================================================= */}

      <section aria-labelledby="operational-title" className="mt-6">
        <h2
          id="operational-title"
          className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500"
        >
          Operational counters
        </h2>

        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 xl:grid-cols-5">
          {operationalMetrics.map((metric) => (
            <MetricCard key={metric.title} size="operational" {...metric} />
          ))}
        </div>
      </section>

      {/* ================================================= */}
      {/* SECURITY */}
      {/* ================================================= */}

      <section
        aria-label="Account security"
        className="mt-6 flex flex-col items-start gap-4 rounded-2xl bg-[linear-gradient(120deg,#fffbeb_0%,#ffffff_70%)] p-4 ring-1 ring-inset ring-amber-200 sm:flex-row sm:items-center sm:justify-between sm:p-5"
      >
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white text-amber-700 ring-1 ring-inset ring-amber-200">
            <ShieldCheck className="h-5 w-5" />
          </span>

          <div>
            <h2 className="text-sm font-semibold text-slate-950">Security</h2>
            <p className="mt-1 text-xs text-slate-600">
              Manage your account security and change your password.
            </p>
          </div>
        </div>

        <Link
          href={securityHref}
          className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg bg-amber-50 px-4 text-sm font-medium text-amber-800 ring-1 ring-inset ring-amber-300 transition-colors hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          Open
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </section>

      <footer className="pt-6 text-[11px] text-slate-500">
        Staff Panel / Dashboard
      </footer>
    </div>
  );
}
