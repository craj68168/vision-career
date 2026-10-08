"use client";

import {
  AlertTriangle,
  CheckCircle2,
  History,
  ShieldCheck,
  X,
  XCircle,
} from "lucide-react";

import {
  formatDate,
  formatDateTime,
  formatSalary,
  getRequestStatusClass,
  getRequestStatusLabel,
  getScreeningClass,
  getScreeningLabel,
} from "./helper";

import type {
  PlacementRequestWorkflowHistoryEntry,
  StaffPlacementRequest,
} from "./types";

import { useLocale, useTranslations } from "next-intl";

// ======================================================
// PROPS
// ======================================================

type Props = {
  request: StaffPlacementRequest | undefined;

  canReview: boolean;

  canApprove: boolean;

  onClose: () => void;

  onScreen: (request: StaffPlacementRequest) => void;

  onDecision: (request: StaffPlacementRequest) => void;
};

// ======================================================
// COMPONENT
// ======================================================

export default function PlacementRequestDetails({
  request,
  canReview,
  onClose,
  onScreen,
  canApprove,
  onDecision,
}: Props) {
  const t = useTranslations("staffPlacementRequests");

  const locale = useLocale();

  const isJapanese = locale.startsWith("ja");

  if (!request) {
    return null;
  }

  const canScreen = canReview && request.status === "pending_review";

  const canMakeDecision = canApprove && request.status === "pending_review";

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

        internalOnly: "Vision Career 内部監査情報",

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

        approved: "承認",

        rejected: "却下",

        pending: "判断待ち",

        admin: "管理者",

        staff: "スタッフ",

        history: "履歴",

        noHistory: "監査履歴はまだありません。",

        resubmitted: "再申請",

        needsAttention: "要確認",

        screened: "確認済み",

        rejectionReason: "却下理由",
      }
    : {
        workflowAudit: "Workflow & Audit",

        internalOnly: "Internal Vision Career audit information",

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

        approved: "Approved",

        rejected: "Rejected",

        pending: "Pending",

        admin: "Admin",

        staff: "Staff",

        history: "Complete History",

        noHistory: "No audit history has been recorded yet.",

        resubmitted: "Resubmitted",

        needsAttention: "Needs Attention",

        screened: "Screened",

        rejectionReason: "Rejection Reason",
      };

  const roleLabel = (value?: string | null) => {
    if (value === "admin") {
      return copy.admin;
    }

    if (value === "staff") {
      return copy.staff;
    }

    return "-";
  };

  const actionLabel = (action: string) => {
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

  const historyClass = (action: string) => {
    if (action === "SCREENED" || action === "APPROVED") {
      return "border-emerald-200 bg-emerald-50";
    }

    if (action === "NEEDS_ATTENTION" || action === "REJECTED") {
      return "border-red-200 bg-red-50";
    }

    return "border-indigo-200 bg-indigo-50";
  };

  const history = request.workflowHistory ?? [];

  const decisionLabel =
    review.decision === "approved"
      ? copy.approved
      : review.decision === "rejected"
        ? copy.rejected
        : copy.pending;

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <button type="button" className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* HEADER */}

        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
              {request.recruitId}
            </p>

            <h2 className="mt-1 text-2xl font-bold">{request.jobTitle}</h2>

            <p className="mt-1 text-sm text-slate-500">{request.companyName}</p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${getRequestStatusClass(
                request.status,
              )}`}
            >
              {getRequestStatusLabel(request.status)}
            </span>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* CONTENT */}

        <div className="overflow-y-auto p-6">
          <div className="space-y-7">
            {/* WORKFLOW AUDIT */}

            <section className="rounded-2xl border border-indigo-200 bg-indigo-50/30 p-4">
              <div className="mb-4 flex items-start gap-3">
                <div className="rounded-xl bg-indigo-100 p-2 text-indigo-700">
                  <History className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-950">
                    {copy.workflowAudit}
                  </h3>

                  <p className="mt-1 text-xs text-indigo-600">
                    {copy.internalOnly}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* SCREENING */}

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-indigo-600" />

                      <h4 className="font-bold">{copy.staffScreening}</h4>
                    </div>

                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${getScreeningClass(
                        request.staffScreening.status,
                      )}`}
                    >
                      {getScreeningLabel(request.staffScreening.status)}
                    </span>
                  </div>

                  {request.staffScreening.status === "NOT_SCREENED" && (
                    <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
                      <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />

                      <p className="text-sm text-amber-700">
                        This placement request has not been screened by Staff
                        yet.
                      </p>
                    </div>
                  )}

                  {request.staffScreening.status !== "NOT_SCREENED" && (
                    <div className="grid gap-3 md:grid-cols-3">
                      <Field
                        label={copy.screenedBy}
                        value={
                          request.staffScreening.screenedByStaffName ||
                          request.staffScreening.screenedByStaffId
                        }
                      />

                      <Field
                        label={copy.staffId}
                        value={request.staffScreening.screenedByStaffId}
                      />

                      <Field
                        label={copy.screenedAt}
                        value={formatDateTime(
                          request.staffScreening.screenedAt,
                        )}
                      />
                    </div>
                  )}

                  {request.staffScreening.note && (
                    <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {copy.screeningNote}
                      </p>

                      <p className="mt-2 whitespace-pre-wrap text-sm">
                        {request.staffScreening.note}
                      </p>
                    </div>
                  )}
                </div>

                {/* DECISION */}

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {review.decision === "rejected" ? (
                        <XCircle className="h-5 w-5 text-red-600" />
                      ) : (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      )}

                      <h4 className="font-bold">{copy.decision}</h4>
                    </div>

                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${
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

                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                    <Field
                      label={copy.reviewedBy}
                      value={review.reviewedByName || review.reviewedById}
                    />

                    <Field
                      label={copy.role}
                      value={roleLabel(review.reviewedByRole)}
                    />

                    <Field label={copy.actorId} value={review.reviewedById} />

                    <Field
                      label={copy.reviewedAt}
                      value={formatDateTime(review.reviewedAt)}
                    />
                  </div>

                  {review.rejectionReason && (
                    <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-red-600">
                        {copy.rejectionReason}
                      </p>

                      <p className="mt-2 whitespace-pre-wrap text-sm text-red-700">
                        {review.rejectionReason}
                      </p>
                    </div>
                  )}
                </div>

                {/* HISTORY */}

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="mb-4 flex items-center gap-2">
                    <History className="h-5 w-5 text-indigo-600" />

                    <h4 className="font-bold">{copy.history}</h4>
                  </div>

                  {history.length === 0 ? (
                    <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-500">
                      {copy.noHistory}
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {history.map(
                        (item: PlacementRequestWorkflowHistoryEntry, index) => (
                          <div
                            key={`${item.action}-${item.createdAt ?? index}-${index}`}
                            className={`rounded-xl border p-3 ${historyClass(
                              item.action,
                            )}`}
                          >
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div>
                                <p className="text-sm font-semibold">
                                  {actionLabel(item.action)}
                                </p>

                                <p className="mt-1 text-xs text-slate-600">
                                  {item.actorName || item.actorId || "-"}
                                  {item.actorRole
                                    ? ` • ${roleLabel(item.actorRole)}`
                                    : ""}
                                  {item.actorId ? ` • ${item.actorId}` : ""}
                                </p>
                              </div>

                              <span className="text-xs text-slate-500">
                                {formatDateTime(item.createdAt)}
                              </span>
                            </div>

                            {item.note && (
                              <div className="mt-2 rounded-lg bg-white/70 p-2 text-sm">
                                {item.note}
                              </div>
                            )}
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </div>

                <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">
                  Staff screening and placement-request approval are separate
                  actions. Staff must have the appropriate approval permission
                  to approve or reject the request.
                </div>
              </div>
            </section>

            {/* PROVIDER */}

            <section>
              <h3 className="mb-4 text-lg font-bold">Provider Information</h3>

              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                <Field label="Company" value={request.companyName} />

                <Field label="Provider" value={request.providerName} />

                <Field label="Provider Email" value={request.providerEmail} />
              </div>
            </section>

            {/* JOB */}

            <section>
              <h3 className="mb-4 text-lg font-bold">Job Information</h3>

              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                <Field label="Job Title" value={request.jobTitle} />

                <Field label="Category" value={request.jobCategory} />

                <Field label="Employment Type" value={request.employmentType} />

                <Field label="Positions" value={request.numberOfPositions} />

                <Field label="Work Location" value={request.workLocation} />

                <Field label="Start Date" value={request.startDate} />
              </div>
            </section>

            {/* REQUIREMENTS */}

            <section>
              <h3 className="mb-4 text-lg font-bold">Requirements</h3>

              <div className="grid gap-3 md:grid-cols-2">
                <Field
                  label="Japanese Level"
                  value={request.japaneseLevelRequired}
                />

                <Field
                  label="Visa Requirement"
                  value={request.visaTypeRequired}
                />
              </div>

              <div className="mt-3 grid gap-3">
                <Field label="Job Description" value={request.jobDescription} />

                <Field label="Requirements" value={request.requirements} />
              </div>
            </section>

            {/* CONDITIONS */}

            <section>
              <h3 className="mb-4 text-lg font-bold">Work Conditions</h3>

              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                <Field
                  label="Salary"
                  value={formatSalary(request.salaryAmount, request.salaryType)}
                />

                <Field label="Working Hours" value={request.workingHours} />

                <Field label="Days Off" value={request.daysOff} />
              </div>
            </section>

            {/* TIMELINE */}

            <section>
              <h3 className="mb-4 text-lg font-bold">Request Timeline</h3>

              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                <Field
                  label="Submitted At"
                  value={formatDateTime(request.submittedAt)}
                />

                <Field
                  label="Reviewed At"
                  value={formatDateTime(request.reviewedAt)}
                />

                <Field
                  label="Reviewed By"
                  value={request.reviewedByName || request.reviewedById}
                />

                <Field
                  label="Created At"
                  value={formatDate(request.createdAt)}
                />
              </div>
            </section>
          </div>
        </div>

        {/* FOOTER */}

        <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 p-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-2.5"
          >
            Close
          </button>

          {canScreen && (
            <button
              type="button"
              onClick={() => onScreen(request)}
              className="rounded-xl bg-slate-950 px-5 py-2.5 font-semibold text-white"
            >
              {request.staffScreening.status === "NOT_SCREENED"
                ? "Screen Request"
                : "Edit Screening"}
            </button>
          )}

          {canMakeDecision && (
            <button
              type="button"
              onClick={() => onDecision(request)}
              className="rounded-xl bg-emerald-600 px-5 py-2.5 font-semibold text-white hover:bg-emerald-700"
            >
              {t("reviewDecision")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ======================================================
// FIELD
// ======================================================

function Field({
  label,
  value,
}: {
  label: string;

  value: string | number | null | undefined;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 whitespace-pre-wrap break-words text-sm font-medium">
        {value ?? "-"}
      </p>
    </div>
  );
}
