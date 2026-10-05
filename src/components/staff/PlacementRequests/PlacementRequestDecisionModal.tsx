"use client";

import { useState } from "react";

import { CheckCircle2, Loader2, ShieldCheck, X, XCircle } from "lucide-react";

import { useTranslations } from "next-intl";

import type { StaffPlacementRequest } from "./types";

type Decision = "approved" | "rejected";

type Props = {
  request: StaffPlacementRequest | null;

  isApproving: boolean;

  isRejecting: boolean;

  onClose: () => void;

  onApprove: (recruitId: string) => void;

  onReject: (recruitId: string, reason: string) => void;
};

export default function PlacementRequestDecisionModal({
  request,
  isApproving,
  isRejecting,
  onClose,
  onApprove,
  onReject,
}: Props) {
  if (!request) {
    return null;
  }

  return (
    <DecisionForm
      key={request.recruitId}
      request={request}
      isApproving={isApproving}
      isRejecting={isRejecting}
      onClose={onClose}
      onApprove={onApprove}
      onReject={onReject}
    />
  );
}

function DecisionForm({
  request,
  isApproving,
  isRejecting,
  onClose,
  onApprove,
  onReject,
}: {
  request: StaffPlacementRequest;

  isApproving: boolean;

  isRejecting: boolean;

  onClose: () => void;

  onApprove: (recruitId: string) => void;

  onReject: (recruitId: string, reason: string) => void;
}) {
  const t = useTranslations("staffPlacementRequests.decisionModal");

  const [decision, setDecision] = useState<Decision>("approved");

  const [reason, setReason] = useState("");

  const [error, setError] = useState("");

  const isSaving = isApproving || isRejecting;

  const submit = () => {
    setError("");

    if (decision === "approved") {
      onApprove(request.recruitId);

      return;
    }

    const normalizedReason = reason.trim();

    if (!normalizedReason) {
      setError(t("reasonRequired"));

      return;
    }

    if (normalizedReason.length > 1000) {
      setError(t("reasonTooLong"));

      return;
    }

    onReject(request.recruitId, normalizedReason);
  };

  return (
    <div className="fixed inset-0 z-[170] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <button
        type="button"
        disabled={isSaving}
        className="absolute inset-0"
        onClick={onClose}
        aria-label={t("close")}
      />

      <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 p-6">
          <div>
            <p className="text-xs font-semibold uppercase text-indigo-600">
              {t("eyebrow")}
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-950">
              {t("title")}
            </h2>

            <p className="mt-1 text-sm text-slate-500">{request.recruitId}</p>
          </div>

          <button
            type="button"
            disabled={isSaving}
            onClick={onClose}
            aria-label={t("close")}
            className="rounded-full p-2 hover:bg-slate-100 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="font-semibold text-slate-950">{request.jobTitle}</p>

            <p className="mt-1 text-sm text-slate-500">{request.companyName}</p>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              disabled={isSaving}
              onClick={() => setDecision("approved")}
              className={`rounded-2xl border p-4 text-left transition disabled:opacity-50 ${
                decision === "approved"
                  ? "border-emerald-300 bg-emerald-50"
                  : "border-slate-200 hover:bg-slate-50"
              }`}
            >
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />

              <p className="mt-3 font-semibold">{t("approve")}</p>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                {t("approveDescription")}
              </p>
            </button>

            <button
              type="button"
              disabled={isSaving}
              onClick={() => setDecision("rejected")}
              className={`rounded-2xl border p-4 text-left transition disabled:opacity-50 ${
                decision === "rejected"
                  ? "border-red-300 bg-red-50"
                  : "border-slate-200 hover:bg-slate-50"
              }`}
            >
              <XCircle className="h-5 w-5 text-red-600" />

              <p className="mt-3 font-semibold">{t("reject")}</p>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                {t("rejectDescription")}
              </p>
            </button>
          </div>

          {decision === "rejected" && (
            <label className="block">
              <span className="text-sm font-semibold">
                {t("rejectionReason")}
              </span>

              <textarea
                rows={5}
                maxLength={1000}
                disabled={isSaving}
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder={t("rejectionPlaceholder")}
                className="mt-2 w-full resize-none rounded-xl border border-slate-200 p-4 outline-none focus:border-red-500 disabled:opacity-50"
              />

              <p className="mt-1 text-right text-xs text-slate-400">
                {reason.length} / 1000
              </p>
            </label>
          )}

          <div className="flex gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />

            <p>{t("permissionNotice")}</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 p-6">
          <button
            type="button"
            disabled={isSaving}
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-2.5 disabled:opacity-50"
          >
            {t("cancel")}
          </button>

          <button
            type="button"
            disabled={isSaving || (decision === "rejected" && !reason.trim())}
            onClick={submit}
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-semibold text-white disabled:opacity-50 ${
              decision === "approved"
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}

            {isSaving
              ? t("saving")
              : decision === "approved"
                ? t("approveRequest")
                : t("rejectRequest")}
          </button>
        </div>
      </div>
    </div>
  );
}
