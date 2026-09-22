"use client";

import { useState } from "react";

import { AlertTriangle, CheckCircle2, X } from "lucide-react";

import type { ScreenApplicationPayload, StaffApplication } from "./types";

type Props = {
  application: StaffApplication | null;

  loading: boolean;

  onClose: () => void;

  onSubmit: (applicationId: string, payload: ScreenApplicationPayload) => void;
};

export default function ScreenApplicationModal({
  application,
  loading,
  onClose,
  onSubmit,
}: Props) {
  if (!application) {
    return null;
  }

  return (
    <ScreenForm
      key={application.applicationId}
      application={application}
      loading={loading}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
}

function ScreenForm({
  application,
  loading,
  onClose,
  onSubmit,
}: {
  application: StaffApplication;

  loading: boolean;

  onClose: () => void;

  onSubmit: (applicationId: string, payload: ScreenApplicationPayload) => void;
}) {
  const [status, setStatus] = useState<"SCREENED" | "NEEDS_ATTENTION">(
    application.screening.status === "NEEDS_ATTENTION"
      ? "NEEDS_ATTENTION"
      : "SCREENED",
  );

  const [note, setNote] = useState(application.screening.note || "");

  const [error, setError] = useState("");

  const submit = () => {
    setError("");

    if (status === "NEEDS_ATTENTION" && !note.trim()) {
      setError("Please explain what needs Admin attention.");

      return;
    }

    onSubmit(application.applicationId, {
      screeningStatus: status,

      note: note.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center bg-slate-950/50 p-4">
      <button type="button" className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-lg rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 p-6">
          <div>
            <p className="text-xs font-semibold uppercase text-indigo-600">
              Staff Screening
            </p>

            <h2 className="mt-1 text-2xl font-bold">Screen Application</h2>

            <p className="mt-1 text-sm text-slate-500">
              {application.applicationId}
            </p>
          </div>

          <button type="button" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="font-semibold">{application.applicant.name || "-"}</p>

            <p className="mt-1 text-sm text-slate-500">
              {application.vacancy?.title || "-"} •{" "}
              {application.vacancy?.companyName || "-"}
            </p>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setStatus("SCREENED")}
              className={`rounded-2xl border p-4 text-left ${
                status === "SCREENED"
                  ? "border-emerald-400 bg-emerald-50"
                  : "border-slate-200"
              }`}
            >
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />

              <p className="mt-3 font-semibold">Screened</p>

              <p className="mt-1 text-xs text-slate-500">
                Application has been checked and is ready for Admin decision.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setStatus("NEEDS_ATTENTION")}
              className={`rounded-2xl border p-4 text-left ${
                status === "NEEDS_ATTENTION"
                  ? "border-red-300 bg-red-50"
                  : "border-slate-200"
              }`}
            >
              <AlertTriangle className="h-5 w-5 text-red-600" />

              <p className="mt-3 font-semibold">Needs Attention</p>

              <p className="mt-1 text-xs text-slate-500">
                Something should be reviewed by Admin before a decision.
              </p>
            </button>
          </div>

          <label className="block">
            <span className="text-sm font-semibold">Screening Note</span>

            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={5}
              maxLength={2000}
              placeholder="Enter screening notes..."
              className="mt-2 w-full resize-none rounded-xl border border-slate-200 p-4 outline-none focus:border-indigo-500"
            />
          </label>

          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
            This screening does not approve or reject the application. Final
            approval remains with Admin.
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 p-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-2.5"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={submit}
            className="rounded-xl bg-slate-950 px-5 py-2.5 font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Screening"}
          </button>
        </div>
      </div>
    </div>
  );
}
