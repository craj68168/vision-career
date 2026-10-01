"use client";

import { Loader2, Send, X } from "lucide-react";
import { useTranslations } from "next-intl";

import type { PlacementRequest } from "./types";

type Props = {
  open: boolean;

  request: PlacementRequest | null;

  loading: boolean;

  onClose: () => void;

  onSubmit: () => void;
};

export default function SubmitPlacementRequestModal({
  open,
  request,
  loading,
  onClose,
  onSubmit,
}: Props) {
  const t = useTranslations("provider.placementRequests.submitModal");

  if (!open || !request) {
    return null;
  }

  const resubmit = request.status === "rejected";

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50">
            <Send className="h-6 w-6 text-indigo-600" />
          </div>

          <button disabled={loading} onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <h2 className="mt-5 text-xl font-bold">
          {resubmit ? t("resubmitTitle") : t("submitTitle")}
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          {resubmit
            ? t("resubmitDescription")
            : t("submitDescription")}
        </p>

        <div className="mt-4 rounded-xl bg-slate-50 p-4">
          <p className="text-xs text-slate-400">{request.recruitId}</p>

          <p className="font-semibold">{request.job_title}</p>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="rounded-xl border px-4 py-2.5"
          >
            {t("cancel")}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onSubmit}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 font-semibold text-white disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}

            {resubmit ? t("resubmit") : t("submit")}
          </button>
        </div>
      </div>
    </div>
  );
}
