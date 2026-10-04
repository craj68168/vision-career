"use client";
import { AlertTriangle, CheckCircle2, Loader2, X, XCircle } from "lucide-react";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type {
  PlacementRequest,
  PlacementRequestScreeningStatus,
} from "./types";
type Props = {
  request: PlacementRequest;
  isSaving: boolean;
  onClose: () => void;
  onApprove: () => void;
  onReject: (reason: string) => void;
};
// ======================================================
// SCREENING
// ======================================================
const screeningClass = (status: PlacementRequestScreeningStatus) => {
  switch (status) {
    case "SCREENED":
      return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300";
    case "NEEDS_ATTENTION":
      return "border-red-200 bg-red-50 text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300";
    default:
      return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300";
  }
};

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-950";
// ======================================================
// MODAL
// ======================================================
export default function StatusModal({
  request,
  isSaving,
  onClose,
  onApprove,
  onReject,
}: Props) {
  const t = useTranslations("placementRequestReview");
  const locale = useLocale();

  const screeningLabel = (status: PlacementRequestScreeningStatus) => {
    switch (status) {
      case "SCREENED": return t("screened");
      case "NEEDS_ATTENTION": return t("needsAttention");
      default: return t("notScreened");
    }
  };

  const formatDateTime = (value?: string | null) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleString(locale, { timeZone: "Asia/Tokyo" });
  };

  const [mode, setMode] = useState<"approve" | "reject">("approve");
  const [reason, setReason] = useState("");
  const screening = request.staffScreening;
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-zinc-950/50 p-4 backdrop-blur-sm">
      <button
        type="button"
        aria-label={t("close")}
        className="absolute inset-0"
        onClick={() => {
          if (!isSaving) {
            onClose();
          }
        }}
      />
      <div className="relative z-10 flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-xl dark:border-white/10 dark:bg-zinc-900">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-3 border-b border-zinc-200 px-4 py-4 dark:border-white/10 sm:px-5">
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-emerald-600 dark:text-emerald-400">
              {request.recruitId}
            </p>
            <h2 className="mt-0.5 text-lg font-semibold text-zinc-950 dark:text-white">{t("title")}</h2>
            <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
              {request.companyName}
              {" • "}
              {request.jobTitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("close")}
            disabled={isSaving}
            className={`grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-400 dark:hover:bg-white/10 ${focusRing}`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
          {/* ================================================= */}
          {/* STAFF SCREENING */}
          {/* ================================================= */}
          <section className="rounded-lg border border-zinc-200 p-4 dark:border-white/10">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">{t("staffScreening")}</h3>
              <span
                className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${screeningClass(
                  screening.status,
                )}`}
              >
                {screeningLabel(screening.status)}
              </span>
            </div>
            {screening.status === "NOT_SCREENED" && (
              <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-400/20 dark:bg-amber-400/10">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                <div>
                  <p className="font-semibold text-amber-800 dark:text-amber-200">{t("notScreenedTitle")}</p>
                  <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">{t("notScreenedDescription")}</p>
                </div>
              </div>
            )}
            {screening.status === "SCREENED" && (
              <div className="flex gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-400/20 dark:bg-emerald-400/10">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <div>
                  <p className="font-semibold text-emerald-800 dark:text-emerald-200">{t("screenedTitle")}</p>
                  <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-300">{t("screenedDescription")}</p>
                </div>
              </div>
            )}
            {screening.status === "NEEDS_ATTENTION" && (
              <div className="flex gap-3 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-400/20 dark:bg-red-400/10">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                <div>
                  <p className="font-semibold text-red-800 dark:text-red-200">{t("needsAttentionTitle")}</p>
                  <p className="mt-1 text-sm text-red-700 dark:text-red-300">{t("needsAttentionDescription")}</p>
                </div>
              </div>
            )}
            {screening.note && (
              <div
                className={`mt-3 rounded-lg border p-3 ${
                  screening.status === "NEEDS_ATTENTION"
                    ? "border-red-200 bg-red-50 dark:border-red-400/20 dark:bg-red-400/10"
                    : "border-zinc-200 bg-zinc-50 dark:border-white/10 dark:bg-white/5"
                }`}
              >
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{t("staffNote")}</p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300">
                  {screening.note}
                </p>
                <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
                  <span>{t("staffId", { id: screening.screenedByStaffId || "-" })}</span>
                  <span>
                    {t("screenedAt", {
                    date: formatDateTime(screening.screenedAt),
                  })}
                </span>
                </div>
              </div>
            )}
          </section>
          {/* ================================================= */}
          {/* ADMIN DECISION */}
          {/* ================================================= */}
          <section>
            <h3 className="mb-3 text-sm font-semibold text-zinc-950 dark:text-white">{t("adminDecision")}</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={isSaving}
                onClick={() => setMode("approve")}
                className={`rounded-lg border p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-50 ${focusRing} ${
                  mode === "approve"
                    ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/20 dark:bg-emerald-400/10"
                    : "border-zinc-200 hover:bg-zinc-50 dark:border-white/10 dark:hover:bg-white/5"
                }`}
              >
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <p className="mt-2 font-semibold text-zinc-950 dark:text-white">{t("approve")}</p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{t("approveDescription")}</p>
              </button>
              <button
                type="button"
                disabled={isSaving}
                onClick={() => setMode("reject")}
                className={`rounded-lg border p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-50 ${focusRing} ${
                  mode === "reject"
                    ? "border-red-500 bg-red-50 ring-2 ring-red-500/20 dark:bg-red-400/10"
                    : "border-zinc-200 hover:bg-zinc-50 dark:border-white/10 dark:hover:bg-white/5"
                }`}
              >
                <XCircle className="h-5 w-5 text-red-600" />
                <p className="mt-2 font-semibold text-zinc-950 dark:text-white">{t("reject")}</p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{t("rejectDescription")}</p>
              </button>
            </div>
          </section>
          {/* REJECTION */}
          {mode === "reject" && (
            <div>
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{t("rejectionReason")}</label>
              <textarea
                rows={4}
                maxLength={1000}
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                className="mt-2 w-full resize-none rounded-lg border border-zinc-200 bg-white p-3 text-sm text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-zinc-900 dark:text-white"
                placeholder={t("reasonPlaceholder")}
              />
              <p className="mt-1 text-right text-xs text-zinc-400 dark:text-zinc-500">
                {t("characterCount", { count: reason.length })}
              </p>
            </div>
          )}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700 dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-300">{t("advisory")}</div>
        </div>
        {/* FOOTER */}
        <div className="flex flex-wrap justify-end gap-2 border-t border-zinc-200 px-4 py-3 dark:border-white/10 sm:px-5">
          <button
            type="button"
            disabled={isSaving}
            onClick={onClose}
            className={`inline-flex h-10 flex-1 cursor-pointer items-center justify-center rounded-lg border border-zinc-200 px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:text-zinc-200 dark:hover:bg-white/10 sm:flex-none ${focusRing}`}
          >{t("cancel")}</button>
          <button
            type="button"
            disabled={isSaving || (mode === "reject" && !reason.trim())}
            onClick={() => {
              if (mode === "approve") {
                onApprove();
                return;
              }
              onReject(reason.trim());
            }}
            className={`inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none ${focusRing} ${
              mode === "approve"
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "approve" ? t("approveRequest") : t("rejectRequest")}
          </button>
        </div>
      </div>
    </div>
  );
}
