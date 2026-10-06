"use client";

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
    <section>
      <div className="mb-4 flex items-center gap-2">
        <History className="h-5 w-5 text-indigo-600" />

        <h3 className="text-lg font-bold">
          {t("approvalHistory.sectionTitle")}
        </h3>
      </div>

      {/* ==================================================
          CURRENT DECISION
      ================================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              {t("approvalHistory.currentDecision")}
            </p>

            <div className="mt-2 flex items-center gap-2">
              {seeker.approval_status === "approved" && (
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              )}

              {seeker.approval_status === "rejected" && (
                <XCircle className="h-5 w-5 text-red-600" />
              )}

              {seeker.approval_status === "pending" && (
                <Clock3 className="h-5 w-5 text-amber-600" />
              )}

              <span
                className={`rounded-full border px-3 py-1 text-sm font-semibold ${
                  seeker.approval_status === "approved"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : seeker.approval_status === "rejected"
                      ? "border-red-200 bg-red-50 text-red-700"
                      : "border-amber-200 bg-amber-50 text-amber-700"
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
              <p className="text-xs text-slate-400">
                {t("approvalHistory.reviewedAt")}
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-700">
                {formatDateTime(review.reviewedAt)}
              </p>
            </div>
          )}
        </div>

        {seeker.approval_status === "pending" ? (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
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
          <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-4">
            <p className="text-xs font-semibold uppercase text-red-500">
              {t("approvalHistory.reason")}
            </p>

            <p className="mt-2 whitespace-pre-wrap text-sm text-red-700">
              {seeker.rejection_reason}
            </p>
          </div>
        )}
      </div>

      {/* ==================================================
          HISTORY
      ================================================== */}

      <div className="mt-5">
        <h4 className="font-semibold text-slate-950">
          {t("approvalHistory.history")}
        </h4>

        {history.length === 0 ? (
          <div className="mt-3 rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-400">
            {t("approvalHistory.noHistory")}
          </div>
        ) : (
          <div className="mt-3 space-y-3">
            {history.map((entry, index) => {
              const approved = entry.decision === "approved";

              return (
                <div
                  key={entry.id || `${entry.reviewedAt}-${index}`}
                  className="rounded-2xl border border-slate-200 p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex gap-3">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                          approved
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {approved ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <XCircle className="h-5 w-5" />
                        )}
                      </div>

                      <div>
                        <p
                          className={`font-semibold ${
                            approved ? "text-emerald-700" : "text-red-700"
                          }`}
                        >
                          {getDecisionLabel(entry.decision)}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {getActorLabel(entry.actorType)}
                          {" • "}
                          {entry.actorName || "-"}
                          {entry.actorId ? ` • ${entry.actorId}` : ""}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400">
                      {formatDateTime(entry.reviewedAt)}
                    </p>
                  </div>

                  {entry.reason && (
                    <div className="mt-3 rounded-xl bg-slate-50 p-3">
                      <p className="text-xs font-semibold uppercase text-slate-400">
                        {t("approvalHistory.reason")}
                      </p>

                      <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">
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
  icon: React.ReactNode;

  label: string;

  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <div className="flex gap-2 text-slate-400">
        {icon}

        <p className="text-xs font-semibold uppercase">{label}</p>
      </div>

      <p className="mt-2 break-words text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}
