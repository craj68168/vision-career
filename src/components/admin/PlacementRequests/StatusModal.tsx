"use client";

import { AlertTriangle, CheckCircle2, Loader2, X, XCircle } from "lucide-react";

import { useState } from "react";

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

const screeningLabel = (status: PlacementRequestScreeningStatus) => {
  switch (status) {
    case "SCREENED":
      return "Screened";

    case "NEEDS_ATTENTION":
      return "Needs Attention";

    default:
      return "Not Screened";
  }
};

const screeningClass = (status: PlacementRequestScreeningStatus) => {
  switch (status) {
    case "SCREENED":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "NEEDS_ATTENTION":
      return "border-red-200 bg-red-50 text-red-700";

    default:
      return "border-amber-200 bg-amber-50 text-amber-700";
  }
};

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
  const [mode, setMode] = useState<"approve" | "reject">("approve");

  const [reason, setReason] = useState("");

  const screening = request.staffScreening;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <button
        type="button"
        className="absolute inset-0"
        onClick={() => {
          if (!isSaving) {
            onClose();
          }
        }}
      />

      <div className="relative z-10 max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        {/* HEADER */}

        <div className="flex items-start justify-between border-b border-slate-200 p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
              {request.recruitId}
            </p>

            <h2 className="mt-1 text-xl font-bold">Review Placement Request</h2>

            <p className="mt-1 text-sm text-slate-500">
              {request.companyName}
              {" • "}
              {request.jobTitle}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-full p-2 hover:bg-slate-100 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          {/* ================================================= */}
          {/* STAFF SCREENING */}
          {/* ================================================= */}

          <section>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="font-bold">Staff Screening</h3>

              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${screeningClass(
                  screening.status,
                )}`}
              >
                {screeningLabel(screening.status)}
              </span>
            </div>

            {screening.status === "NOT_SCREENED" && (
              <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

                <div>
                  <p className="font-semibold text-amber-800">
                    Not screened by Staff
                  </p>

                  <p className="mt-1 text-sm text-amber-700">
                    You can still make the final Admin decision.
                  </p>
                </div>
              </div>
            )}

            {screening.status === "SCREENED" && (
              <div className="flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

                <div>
                  <p className="font-semibold text-emerald-800">
                    Staff screening completed
                  </p>

                  <p className="mt-1 text-sm text-emerald-700">
                    Staff marked this request as ready for Admin review.
                  </p>
                </div>
              </div>
            )}

            {screening.status === "NEEDS_ATTENTION" && (
              <div className="flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                <div>
                  <p className="font-semibold text-red-800">
                    Staff marked this request as Needs Attention
                  </p>

                  <p className="mt-1 text-sm text-red-700">
                    Check the Staff note carefully before approving or rejecting
                    this request.
                  </p>
                </div>
              </div>
            )}

            {screening.note && (
              <div
                className={`mt-3 rounded-2xl border p-4 ${
                  screening.status === "NEEDS_ATTENTION"
                    ? "border-red-200 bg-red-50"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Staff Note
                </p>

                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                  {screening.note}
                </p>

                <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-500">
                  <span>Staff: {screening.screenedByStaffId || "-"}</span>

                  <span>
                    Screened:{" "}
                    {screening.screenedAt
                      ? new Date(screening.screenedAt).toLocaleString()
                      : "-"}
                  </span>
                </div>
              </div>
            )}
          </section>

          {/* ================================================= */}
          {/* ADMIN DECISION */}
          {/* ================================================= */}

          <section>
            <h3 className="mb-3 font-bold">Admin Decision</h3>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={isSaving}
                onClick={() => setMode("approve")}
                className={`rounded-xl border p-4 text-left transition disabled:opacity-50 ${
                  mode === "approve"
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-slate-200"
                }`}
              >
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />

                <p className="mt-2 font-semibold">Approve</p>

                <p className="mt-1 text-xs text-slate-500">
                  Allow candidate matching for this placement request.
                </p>
              </button>

              <button
                type="button"
                disabled={isSaving}
                onClick={() => setMode("reject")}
                className={`rounded-xl border p-4 text-left transition disabled:opacity-50 ${
                  mode === "reject"
                    ? "border-red-500 bg-red-50"
                    : "border-slate-200"
                }`}
              >
                <XCircle className="h-5 w-5 text-red-600" />

                <p className="mt-2 font-semibold">Reject</p>

                <p className="mt-1 text-xs text-slate-500">
                  Send the request back to the Provider with a reason.
                </p>
              </button>
            </div>
          </section>

          {/* REJECTION */}

          {mode === "reject" && (
            <div>
              <label className="text-sm font-semibold">
                Rejection Reason *
              </label>

              <textarea
                rows={4}
                maxLength={1000}
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                className="mt-2 w-full resize-none rounded-xl border border-slate-200 p-3 outline-none focus:border-red-400"
                placeholder="Explain why this request is being rejected..."
              />

              <p className="mt-1 text-right text-xs text-slate-400">
                {reason.length}/1000
              </p>
            </div>
          )}

          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
            Staff screening is advisory. The action below is the final Admin
            approval/rejection decision.
          </div>
        </div>

        {/* FOOTER */}

        <div className="flex justify-end gap-3 border-t border-slate-200 p-6">
          <button
            type="button"
            disabled={isSaving}
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2.5 disabled:opacity-50"
          >
            Cancel
          </button>

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
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-semibold text-white disabled:opacity-50 ${
              mode === "approve"
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}

            {mode === "approve" ? "Approve Request" : "Reject Request"}
          </button>
        </div>
      </div>
    </div>
  );
}
