"use client";

import { CheckCircle2, Loader2, X, XCircle } from "lucide-react";

import { useState } from "react";

import type { PlacementRequest } from "./types";

type Props = {
  request: PlacementRequest;

  isSaving: boolean;

  onClose: () => void;

  onApprove: () => void;

  onReject: (reason: string) => void;
};

export default function StatusModal({
  request,
  isSaving,
  onClose,
  onApprove,
  onReject,
}: Props) {
  const [mode, setMode] = useState<"approve" | "reject">("approve");

  const [reason, setReason] = useState("");

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6">
        <div className="flex justify-between">
          <div>
            <h2 className="text-xl font-bold">Review Placement Request</h2>

            <p className="mt-1 text-sm text-slate-500">
              {request.recruitId} · {request.companyName}
            </p>
          </div>

          <button onClick={onClose} disabled={isSaving}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setMode("approve")}
            className={`rounded-xl border p-4 text-left ${
              mode === "approve" ? "border-emerald-500 bg-emerald-50" : ""
            }`}
          >
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />

            <p className="mt-2 font-semibold">Approve</p>
          </button>

          <button
            type="button"
            onClick={() => setMode("reject")}
            className={`rounded-xl border p-4 text-left ${
              mode === "reject" ? "border-red-500 bg-red-50" : ""
            }`}
          >
            <XCircle className="h-5 w-5 text-red-600" />

            <p className="mt-2 font-semibold">Reject</p>
          </button>
        </div>

        {mode === "reject" && (
          <div className="mt-5">
            <label className="text-sm font-semibold">Rejection Reason *</label>

            <textarea
              rows={4}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className="mt-2 w-full rounded-xl border p-3"
              placeholder="Explain why this request is being rejected..."
            />
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            disabled={isSaving}
            onClick={onClose}
            className="rounded-xl border px-4 py-2"
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
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-2 font-semibold text-white disabled:opacity-50 ${
              mode === "approve" ? "bg-emerald-600" : "bg-red-600"
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
