"use client";

import type { ReactNode } from "react";

import {
  CheckCircle2,
  Clock3,
  History,
  ShieldCheck,
  UserRound,
  XCircle,
} from "lucide-react";

import { useFormatter, useTranslations } from "next-intl";

import type {
  ApprovalActorType,
  StaffSeeker,
  StaffSeekerApprovalDecision,
} from "./types";

type Props = {
  seeker: StaffSeeker;
};

export default function ApprovalHistorySection({ seeker }: Props) {
  const t = useTranslations("staffJobSeekers");

  const format = useFormatter();

  const history = seeker.approvalHistory ?? [];

  const review = seeker.approvalReview;

  const formatDateTime = (value?: string | null) => {
    if (!value) {
      return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return format.dateTime(date, {
      timeZone: "Asia/Tokyo",

      year: "numeric",

      month: "2-digit",

      day: "2-digit",

      hour: "2-digit",

      minute: "2-digit",
    });
  };

  const getDecisionLabel = (decision: StaffSeekerApprovalDecision) =>
    decision === "approved"
      ? t("statuses.approval.approved")
      : t("statuses.approval.rejected");

  const getActorLabel = (actorType?: ApprovalActorType | null) => {
    if (actorType === "admin") {
      return t("approvalHistory.admin");
    }

    if (actorType === "staff") {
      return t("approvalHistory.staff");
    }

    return "-";
  };

  return (
    <section className="min-w-0 rounded-2xl bg-white p-4 ring-1 ring-inset ring-slate-200 sm:p-5">
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden="true"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-violet-50 text-violet-600 ring-1 ring-inset ring-violet-100"
        >
          <History className="h-4 w-4" />
        </span>

        <h3 className="text-sm font-semibold text-slate-950">
          {t("approvalHistory.sectionTitle")}
        </h3>
      </div>

      {/* ==================================================
          CURRENT DECISION
      ================================================== */}

      <div className="mt-4 rounded-xl bg-slate-50 p-4 ring-1 ring-inset ring-slate-200/70">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              {t("approvalHistory.currentDecision")}
            </p>

            <div className="mt-2 flex items-center gap-2">
              {seeker.approval_status === "approved" && (
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              )}

              {seeker.approval_status === "rejected" && (
                <XCircle className="h-5 w-5 text-rose-600" />
              )}

              {seeker.approval_status === "pending" && (
                <Clock3 className="h-5 w-5 text-amber-600" />
              )}

              <span
                className={`rounded-full px-3 py-1 text-sm font-semibold ring-1 ring-inset ${
                  seeker.approval_status === "approved"
                    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                    : seeker.approval_status === "rejected"
                      ? "bg-rose-50 text-rose-700 ring-rose-200"
                      : "bg-amber-50 text-amber-700 ring-amber-200"
                }`}
              >
                {seeker.approval_status === "pending"
                  ? t("statuses.approval.pending")
                  : getDecisionLabel(seeker.approval_status)}
              </span>
            </div>
          </div>

          {review?.reviewedAt && (
            <div className="text-left sm:text-right">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {t("approvalHistory.reviewedAt")}
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-950">
                {formatDateTime(review.reviewedAt)}
              </p>
            </div>
          )}
        </div>

        {seeker.approval_status === "pending" ? (
          <div className="mt-4 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-700 ring-1 ring-inset ring-amber-200">
            {t("approvalHistory.pendingMessage")}
          </div>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Info
              icon={
                review?.reviewedByType === "admin" ? (
                  <ShieldCheck className="h-4 w-4" />
                ) : (
                  <UserRound className="h-4 w-4" />
                )
              }
              label={t("approvalHistory.reviewerType")}
              value={getActorLabel(review?.reviewedByType)}
            />

            <Info
              icon={<UserRound className="h-4 w-4" />}
              label={t("approvalHistory.reviewer")}
              value={review?.reviewedByName || "-"}
            />

            <Info
              icon={<ShieldCheck className="h-4 w-4" />}
              label={t("approvalHistory.reviewerId")}
              value={review?.reviewedById || "-"}
            />
          </div>
        )}

        {seeker.approval_status === "rejected" && seeker.rejection_reason && (
          <div className="mt-4 rounded-xl bg-rose-50 p-4 ring-1 ring-inset ring-rose-200">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-rose-600">
              {t("approvalHistory.reason")}
            </p>

            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-rose-700">
              {seeker.rejection_reason}
            </p>
          </div>
        )}
      </div>

      {/* ==================================================
          HISTORY
      ================================================== */}

      <div className="mt-5">
        <h4 className="text-sm font-semibold text-slate-950">
          {t("approvalHistory.history")}
        </h4>

        {history.length === 0 ? (
          <div className="mt-3 rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-400">
            {t("approvalHistory.noHistory")}
          </div>
        ) : (
          <div className="mt-3 space-y-3">
            {history.map((entry, index) => {
              const approved = entry.decision === "approved";

              return (
                <div
                  key={entry.id || `${entry.reviewedAt}-${index}`}
                  className="rounded-xl bg-white p-4 ring-1 ring-inset ring-slate-200"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 gap-3">
                      <span
                        aria-hidden="true"
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ring-1 ring-inset ${
                          approved
                            ? "bg-emerald-50 text-emerald-600 ring-emerald-200"
                            : "bg-rose-50 text-rose-600 ring-rose-200"
                        }`}
                      >
                        {approved ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}
                      </span>

                      <div className="min-w-0">
                        <p
                          className={`font-semibold ${
                            approved ? "text-emerald-700" : "text-rose-700"
                          }`}
                        >
                          {getDecisionLabel(entry.decision)}
                        </p>

                        <p className="mt-0.5 break-words text-sm text-slate-500">
                          {getActorLabel(entry.actorType)}
                          {" • "}
                          {entry.actorName || "-"}
                          {entry.actorId ? ` • ${entry.actorId}` : ""}
                        </p>
                      </div>
                    </div>

                    <p className="shrink-0 text-xs text-slate-400">
                      {formatDateTime(entry.reviewedAt)}
                    </p>
                  </div>

                  {entry.reason && (
                    <div className="mt-3 rounded-xl bg-slate-50 p-3 ring-1 ring-inset ring-slate-200/70">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        {t("approvalHistory.reason")}
                      </p>

                      <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                        {entry.reason}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function Info({
  icon,
  label,
  value,
}: {
  icon: ReactNode;

  label: string;

  value: string;
}) {
  return (
    <div className="min-w-0 rounded-xl bg-white p-3.5 ring-1 ring-inset ring-slate-200">
      <div className="flex items-center gap-2 text-slate-400">
        {icon}

        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          {label}
        </p>
      </div>

      <p className="mt-2 break-words text-sm font-semibold text-slate-950">
        {value}
      </p>
    </div>
  );
}