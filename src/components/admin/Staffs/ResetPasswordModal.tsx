"use client";

import { useState } from "react";

import { KeyRound, X } from "lucide-react";

import type { Staff } from "./types";

type Props = {
  staff: Staff | null;

  loading: boolean;

  onClose: () => void;

  onSubmit: (staffId: string, password: string) => void;
};

export default function ResetPasswordModal({
  staff,
  loading,
  onClose,
  onSubmit,
}: Props) {
  if (!staff) {
    return null;
  }

  return (
    <ResetForm
      key={staff.staffId}
      staff={staff}
      loading={loading}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
}

function ResetForm({
  staff,
  loading,
  onClose,
  onSubmit,
}: {
  staff: Staff;

  loading: boolean;

  onClose: () => void;

  onSubmit: (staffId: string, password: string) => void;
}) {
  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = () => {
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");

      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");

      return;
    }

    onSubmit(staff.staffId, password);
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/50 p-4">
      <button type="button" className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-md rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 p-6">
          <div>
            <p className="text-xs font-semibold uppercase text-indigo-600">
              Staff Security
            </p>

            <h2 className="mt-1 text-xl font-bold">Reset Password</h2>

            <p className="mt-1 text-sm text-slate-500">
              {staff.name} • {staff.staffId}
            </p>
          </div>

          <button type="button" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 p-6">
          {error && (
            <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <label className="block">
            <span className="text-sm font-semibold">New Password</span>

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-indigo-500"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold">Confirm Password</span>

            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-indigo-500"
            />
          </label>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 p-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2.5"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 font-semibold text-white disabled:opacity-50"
          >
            <KeyRound className="h-4 w-4" />

            {loading ? "Saving..." : "Reset Password"}
          </button>
        </div>
      </div>
    </div>
  );
}
