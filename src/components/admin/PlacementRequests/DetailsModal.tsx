"use client";

import type { ComponentType, ReactNode } from "react";

import { useLocale, useTranslations } from "next-intl";

import {
  AlertTriangle,
  Briefcase,
  Building2,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  History,
  ListChecks,
  ShieldCheck,
  Wallet,
  X,
  XCircle,
} from "lucide-react";

import type {
  PlacementRequest,
  PlacementRequestScreeningStatus,
  PlacementRequestWorkflowHistoryEntry,
} from "./types";

// ======================================================
// PROPS
// ======================================================

type Props = {
  request: PlacementRequest;

  onClose: () => void;
};

type Tone = "sky" | "violet" | "amber" | "emerald" | "indigo" | "red";

// ======================================================
// COLORS
// ======================================================

const toneClasses: Record<
  Tone,
  {
    border: string;
    header: string;
    chip: string;
    title: string;
    field: string;
  }
> = {
  sky: {
    border: "border-sky-200",
    header: "bg-sky-50",
    chip: "bg-sky-100 text-sky-700",
    title: "text-sky-900",
    field: "bg-sky-50/60",
  },

  violet: {
    border: "border-violet-200",
    header: "bg-violet-50",
    chip: "bg-violet-100 text-violet-700",
    title: "text-violet-900",
    field: "bg-violet-50/60",
  },

  amber: {
    border: "border-amber-200",
    header: "bg-amber-50",
    chip: "bg-amber-100 text-amber-700",
    title: "text-amber-900",
    field: "bg-amber-50/60",
  },

  emerald: {
    border: "border-emerald-200",
    header: "bg-emerald-50",
    chip: "bg-emerald-100 text-emerald-700",
    title: "text-emerald-900",
    field: "bg-emerald-50/60",
  },

  indigo: {
    border: "border-indigo-200",
    header: "bg-indigo-50",
    chip: "bg-indigo-100 text-indigo-700",
    title: "text-indigo-900",
    field: "bg-indigo-50/60",
  },

  red: {
    border: "border-red-200",
    header: "bg-red-50",
    chip: "bg-red-100 text-red-700",
    title: "text-red-900",
    field: "bg-red-50/60",
  },
};

// ======================================================
// HELPERS
// ======================================================

const text = (value: string | number | null | undefined) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return String(value);
};

const screeningClass = (status: PlacementRequestScreeningStatus) => {
  switch (status) {
    case "SCREENED":
      return "border-emerald-200 bg-white text-emerald-700";

    case "NEEDS_ATTENTION":
      return "border-red-200 bg-white text-red-700";

    default:
      return "border-amber-200 bg-white text-amber-700";
  }
};

const requestStatusClass = (status?: string | null) => {
  const key = (status ?? "").toUpperCase();

  if (key.includes("REJECT")) {
    return "border-red-200 bg-red-50 text-red-700";
  }

  if (key.includes("APPROV") || key.includes("ACCEPT")) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (key.includes("PEND") || key.includes("REVIEW")) {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-zinc-200 bg-zinc-50 text-zinc-700";
};

const historyClass = (action: string) => {
  if (action === "APPROVED" || action === "SCREENED") {
    return "border-emerald-200 bg-emerald-50";
  }

  if (action === "REJECTED" || action === "NEEDS_ATTENTION") {
    return "border-red-200 bg-red-50";
  }

  return "border-indigo-200 bg-indigo-50";
};

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

// ======================================================
// COMPONENT
// ======================================================

export default function DetailsModal({ request, onClose }: Props) {
  const t = useTranslations("placementRequestDetails");

  const locale = useLocale();

  const isJapanese = locale.startsWith("ja");

  const screening = request.staffScreening;

  const review = request.review ?? {
    decision:
      request.status === "approved" || request.status === "rejected"
        ? request.status
        : null,

    reviewedAt: request.reviewedAt,

    reviewedByRole: request.reviewedByRole,

    reviewedById: request.reviewedById,

    reviewedByName: request.reviewedByName,

    rejectionReason: request.rejectionReason,
  };

  const copy = isJapanese
    ? {
        workflowAudit: "ワークフロー・監査",

        internalOnly:
          "Vision Career 内部監査情報。求職者・企業には表示されません。",

        staffScreening: "スタッフ確認",

        screenedBy: "確認者",

        staffId: "スタッフID",

        screenedAt: "確認日時",

        screeningNote: "確認メモ",

        decision: "採用依頼の最終判断",

        currentDecision: "現在の判断",

        reviewedBy: "判断者",

        role: "権限",

        actorId: "担当者ID",

        reviewedAt: "判断日時",

        pending: "判断待ち",

        approved: "承認",

        rejected: "却下",

        admin: "管理者",

        staff: "スタッフ",

        completeHistory: "履歴",

        noHistory: "監査履歴はまだありません。",

        rejectionReason: "却下理由",

        screened: "確認済み",

        needsAttention: "要確認",

        notScreened: "未確認",

        resubmitted: "再申請",
      }
    : {
        workflowAudit: "Workflow & Audit",

        internalOnly:
          "Internal Vision Career audit information. This is not exposed to Job Seekers or Providers.",

        staffScreening: "Staff Screening",

        screenedBy: "Screened By",

        staffId: "Staff ID",

        screenedAt: "Screened At",

        screeningNote: "Screening Note",

        decision: "Placement Request Decision",

        currentDecision: "Current Decision",

        reviewedBy: "Reviewed By",

        role: "Role",

        actorId: "Actor ID",

        reviewedAt: "Reviewed At",

        pending: "Pending",

        approved: "Approved",

        rejected: "Rejected",

        admin: "Admin",

        staff: "Staff",

        completeHistory: "Complete History",

        noHistory: "No audit history has been recorded yet.",

        rejectionReason: "Rejection Reason",

        screened: "Screened",

        needsAttention: "Needs Attention",

        notScreened: "Not Screened",

        resubmitted: "Resubmitted",
      };

  const dateTime = (value?: string | null) => {
    if (!value) {
      return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString(locale, {
      timeZone: "Asia/Tokyo",
    });
  };

  const screeningLabel = (status: PlacementRequestScreeningStatus) => {
    switch (status) {
      case "SCREENED":
        return copy.screened;

      case "NEEDS_ATTENTION":
        return copy.needsAttention;

      default:
        return copy.notScreened;
    }
  };

  const roleLabel = (role?: string | null) => {
    if (role === "admin") {
      return copy.admin;
    }

    if (role === "staff") {
      return copy.staff;
    }

    return "-";
  };

  const decisionLabel =
    review.decision === "approved"
      ? copy.approved
      : review.decision === "rejected"
        ? copy.rejected
        : copy.pending;

  const historyActionLabel = (action: string) => {
    switch (action) {
      case "SCREENED":
        return copy.screened;

      case "NEEDS_ATTENTION":
        return copy.needsAttention;

      case "APPROVED":
        return copy.approved;

      case "REJECTED":
        return copy.rejected;

      case "RESUBMITTED":
        return copy.resubmitted;

      default:
        return action;
    }
  };

  const localizedValue = (
    group: "requestStatuses" | "employmentTypes" | "salaryTypes",

    value?: string | null,
  ) => {
    if (!value) {
      return "-";
    }

    const key = `${group}.${value.trim().toUpperCase().replace(/[ -]+/g, "_")}`;

    return t.has(key) ? t(key) : value;
  };

  const history = request.workflowHistory ?? [];

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-zinc-950/50 p-3 backdrop-blur-sm sm:p-4">
      <button
        type="button"
        aria-label={t("close")}
        className="absolute inset-0"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="placement-details-title"
        className="relative z-10 flex max-h-[94dvh] w-full max-w-5xl flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-xl"
      >
        {/* HEADER */}

        <div className="flex items-start justify-between gap-3 border-b border-zinc-200 bg-white px-4 py-4 sm:px-5">
          <div className="flex min-w-0 items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-emerald-600 text-white">
              <ClipboardList className="h-5 w-5" />
            </span>

            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-emerald-700">
                {request.recruitId}
              </p>

              <h2
                id="placement-details-title"
                className="mt-0.5 break-words text-lg font-semibold text-zinc-950 sm:text-xl"
              >
                {request.jobTitle}
              </h2>

              <p className="mt-0.5 flex items-center gap-1.5 text-sm text-zinc-500">
                <Building2 className="h-4 w-4 shrink-0" />

                <span className="truncate">{request.companyName}</span>
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span
              className={`hidden whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium sm:inline-flex ${requestStatusClass(
                request.status,
              )}`}
            >
              {localizedValue("requestStatuses", request.status)}
            </span>

            <button
              type="button"
              onClick={onClose}
              aria-label={t("close")}
              className={`grid h-9 w-9 place-items-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 ${focusRing}`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* CONTENT */}

        <div className="overflow-y-auto bg-zinc-50/60 p-3 sm:p-5">
          {/* WORKFLOW & AUDIT */}

          <section className="mb-4 overflow-hidden rounded-lg border border-indigo-200 bg-white shadow-sm">
            <div className="border-b border-indigo-200 bg-indigo-50 px-4 py-3">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-indigo-700" />

                <h3 className="text-sm font-semibold text-indigo-900">
                  {copy.workflowAudit}
                </h3>
              </div>

              <p className="mt-1 text-xs text-indigo-600">
                {copy.internalOnly}
              </p>
            </div>

            <div className="space-y-4 p-4">
              {/* SCREENING */}

              <div className="rounded-lg border border-zinc-200 p-3">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-violet-600" />

                    <h4 className="text-sm font-semibold text-zinc-900">
                      {copy.staffScreening}
                    </h4>
                  </div>

                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${screeningClass(
                      screening.status,
                    )}`}
                  >
                    {screeningLabel(screening.status)}
                  </span>
                </div>

                {screening.status === "NOT_SCREENED" && (
                  <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

                    <p className="text-sm text-amber-700">{copy.notScreened}</p>
                  </div>
                )}

                {screening.status !== "NOT_SCREENED" && (
                  <div className="grid gap-2 sm:grid-cols-3">
                    <AuditField
                      label={copy.screenedBy}
                      value={
                        screening.screenedByStaffName ||
                        screening.screenedByStaffId
                      }
                    />

                    <AuditField
                      label={copy.staffId}
                      value={screening.screenedByStaffId}
                    />

                    <AuditField
                      label={copy.screenedAt}
                      value={dateTime(screening.screenedAt)}
                    />
                  </div>
                )}

                {screening.note && (
                  <div className="mt-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                      {copy.screeningNote}
                    </p>

                    <p className="mt-1.5 whitespace-pre-wrap text-sm text-zinc-700">
                      {screening.note}
                    </p>
                  </div>
                )}
              </div>

              {/* FINAL DECISION */}

              <div className="rounded-lg border border-zinc-200 p-3">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {review.decision === "rejected" ? (
                      <XCircle className="h-4 w-4 text-red-600" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    )}

                    <h4 className="text-sm font-semibold text-zinc-900">
                      {copy.decision}
                    </h4>
                  </div>

                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                      review.decision === "approved"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : review.decision === "rejected"
                          ? "border-red-200 bg-red-50 text-red-700"
                          : "border-amber-200 bg-amber-50 text-amber-700"
                    }`}
                  >
                    {decisionLabel}
                  </span>
                </div>

                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  <AuditField
                    label={copy.reviewedBy}
                    value={review.reviewedByName || review.reviewedById}
                  />

                  <AuditField
                    label={copy.role}
                    value={roleLabel(review.reviewedByRole)}
                  />

                  <AuditField
                    label={copy.actorId}
                    value={review.reviewedById}
                  />

                  <AuditField
                    label={copy.reviewedAt}
                    value={dateTime(review.reviewedAt)}
                  />
                </div>

                {review.rejectionReason && (
                  <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-red-600">
                      {copy.rejectionReason}
                    </p>

                    <p className="mt-1.5 whitespace-pre-wrap text-sm text-red-700">
                      {review.rejectionReason}
                    </p>
                  </div>
                )}
              </div>

              {/* COMPLETE HISTORY */}

              <div className="rounded-lg border border-zinc-200 p-3">
                <div className="mb-3 flex items-center gap-2">
                  <History className="h-4 w-4 text-indigo-600" />

                  <h4 className="text-sm font-semibold text-zinc-900">
                    {copy.completeHistory}
                  </h4>
                </div>

                {history.length === 0 ? (
                  <p className="rounded-lg bg-zinc-50 p-3 text-sm text-zinc-500">
                    {copy.noHistory}
                  </p>
                ) : (
                  <div className="space-y-2">
                    {history.map(
                      (item: PlacementRequestWorkflowHistoryEntry, index) => (
                        <div
                          key={`${item.action}-${item.createdAt ?? index}-${index}`}
                          className={`rounded-lg border p-3 ${historyClass(
                            item.action,
                          )}`}
                        >
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <p className="text-sm font-semibold text-zinc-900">
                                {historyActionLabel(item.action)}
                              </p>

                              <p className="mt-1 text-xs text-zinc-600">
                                {item.actorName || item.actorId || "-"}
                                {item.actorRole
                                  ? ` • ${roleLabel(item.actorRole)}`
                                  : ""}
                                {item.actorId ? ` • ${item.actorId}` : ""}
                              </p>
                            </div>

                            <span className="text-xs text-zinc-500">
                              {dateTime(item.createdAt)}
                            </span>
                          </div>

                          {item.note && (
                            <p className="mt-2 rounded-md bg-white/70 px-2.5 py-2 text-sm text-zinc-700">
                              {item.note}
                            </p>
                          )}
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* MAIN DETAILS */}

          <div className="grid items-start gap-4 lg:grid-cols-2">
            <div className="min-w-0 space-y-4">
              <Section
                title={t("providerInformation")}
                icon={Building2}
                tone="sky"
              >
                <Field
                  tone="sky"
                  label={t("company")}
                  value={request.companyName}
                />

                <Field
                  tone="sky"
                  label={t("provider")}
                  value={request.providerName}
                />

                <Field
                  tone="sky"
                  wide
                  label={t("providerEmail")}
                  value={request.providerEmail}
                />
              </Section>

              <Section
                title={t("jobInformation")}
                icon={Briefcase}
                tone="violet"
              >
                <Field
                  tone="violet"
                  wide
                  label={t("jobTitle")}
                  value={request.jobTitle}
                />

                <Field
                  tone="violet"
                  label={t("category")}
                  value={request.jobCategory}
                />

                <Field
                  tone="violet"
                  label={t("employmentType")}
                  value={localizedValue(
                    "employmentTypes",
                    request.employmentType,
                  )}
                />

                <Field
                  tone="violet"
                  label={t("positions")}
                  value={request.numberOfPositions}
                />

                <Field
                  tone="violet"
                  label={t("startDate")}
                  value={request.startDate}
                />

                <Field
                  tone="violet"
                  wide
                  label={t("workLocation")}
                  value={request.workLocation}
                />
              </Section>

              <Section title={t("requirements")} icon={ListChecks} tone="amber">
                <Field
                  tone="amber"
                  label={t("japaneseLevel")}
                  value={request.japaneseLevelRequired}
                />

                <Field
                  tone="amber"
                  label={t("visaRequirement")}
                  value={request.visaTypeRequired}
                />

                <Field
                  tone="amber"
                  wide
                  label={t("jobDescription")}
                  value={request.jobDescription}
                />

                <Field
                  tone="amber"
                  wide
                  label={t("requirements")}
                  value={request.requirements}
                />
              </Section>
            </div>

            <div className="min-w-0 space-y-4">
              <Section title={t("workConditions")} icon={Wallet} tone="emerald">
                <Field
                  tone="emerald"
                  wide
                  label={t("salary")}
                  value={
                    request.salaryAmount != null
                      ? `${request.salaryAmount.toLocaleString(locale)} ${
                          request.salaryType
                            ? localizedValue("salaryTypes", request.salaryType)
                            : ""
                        }`
                      : localizedValue("salaryTypes", request.salaryType)
                  }
                />

                <Field
                  tone="emerald"
                  label={t("workingHours")}
                  value={request.workingHours}
                />

                <Field
                  tone="emerald"
                  label={t("daysOff")}
                  value={request.daysOff}
                />
              </Section>

              <Section title={t("timeline")} icon={CalendarClock} tone="indigo">
                <Field
                  tone="indigo"
                  label={t("submittedAt")}
                  value={dateTime(request.submittedAt)}
                />

                <Field
                  tone="indigo"
                  label={t("adminReviewedAt")}
                  value={dateTime(request.reviewedAt)}
                />

                <Field
                  tone="indigo"
                  wide
                  label={t("status")}
                  value={localizedValue("requestStatuses", request.status)}
                />
              </Section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ======================================================
// SECTION
// ======================================================

function Section({
  title,
  icon: Icon,
  tone,
  children,
}: {
  title: string;

  icon: ComponentType<{
    className?: string;
  }>;

  tone: Tone;

  children: ReactNode;
}) {
  const classes = toneClasses[tone];

  return (
    <section
      className={`overflow-hidden rounded-lg border bg-white shadow-sm ${classes.border}`}
    >
      <div
        className={`flex items-center gap-2.5 border-b px-4 py-2.5 ${classes.border} ${classes.header}`}
      >
        <span
          className={`grid h-7 w-7 shrink-0 place-items-center rounded-md ${classes.chip}`}
        >
          <Icon className="h-4 w-4" />
        </span>

        <h3 className={`truncate text-sm font-semibold ${classes.title}`}>
          {title}
        </h3>
      </div>

      <div className="grid gap-2 p-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

// ======================================================
// FIELD
// ======================================================

function Field({
  label,
  value,
  tone,
  wide = false,
}: {
  label: string;

  value: string | number | null | undefined;

  tone: Tone;

  wide?: boolean;
}) {
  return (
    <div
      className={`min-w-0 rounded-md px-3 py-2 ${toneClasses[tone].field} ${
        wide ? "sm:col-span-2" : ""
      }`}
    >
      <p className="text-[11px] font-medium text-zinc-500">{label}</p>

      <p className="mt-0.5 whitespace-pre-wrap break-words text-sm font-medium text-zinc-900">
        {text(value)}
      </p>
    </div>
  );
}

// ======================================================
// AUDIT FIELD
// ======================================================

function AuditField({
  label,
  value,
}: {
  label: string;

  value: string | number | null | undefined;
}) {
  return (
    <div className="rounded-md bg-zinc-50 px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium text-zinc-900">
        {text(value)}
      </p>
    </div>
  );
}
