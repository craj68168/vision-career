"use client";

import { useState } from "react";

import { Loader2, X } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

import type { AdminVacancy } from "./types";

type Props = {
  vacancy: AdminVacancy;

  isRejecting: boolean;

  onClose: () => void;

  onReject: (vacancyId: string, reason: string) => void;
};

export default function RejectVacancyModal({
  vacancy,
  isRejecting,
  onClose,
  onReject,
}: Props) {
  const { lang } = useLanguage();

  const [reason, setReason] = useState("");

  const canSubmit = reason.trim().length > 0 && !isRejecting;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 cursor-default"
        onClick={() => {
          if (!isRejecting) {
            onClose();
          }
        }}
      />

      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-red-500">
              {lang === "ja" ? "求人を却下" : "Reject Vacancy"}
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-950">
              {vacancy.title}
            </h2>

            <p className="mt-1 text-sm text-slate-500">{vacancy.companyName}</p>
          </div>

          <button
            type="button"
            disabled={isRejecting}
            onClick={onClose}
            className="cursor-pointer rounded-full p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <label className="text-sm font-semibold text-slate-700">
            {lang === "ja" ? "却下理由" : "Reason for rejection"}
          </label>

          <p className="mt-1 text-xs text-slate-500">
            {lang === "ja"
              ? "企業が修正する内容を具体的に入力してください。"
              : "Explain what the Provider should correct before resubmitting."}
          </p>

          <textarea
            rows={5}
            maxLength={1000}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            disabled={isRejecting}
            placeholder={
              lang === "ja"
                ? "例：仕事内容をより具体的に記載してください。"
                : "Example: Please provide a more detailed job description."
            }
            className="mt-3 w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-red-400 disabled:bg-slate-50"
          />

          <div className="mt-2 text-right text-xs text-slate-400">
            {reason.length}/1000
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              disabled={isRejecting}
              onClick={onClose}
              className="cursor-pointer rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              {lang === "ja" ? "キャンセル" : "Cancel"}
            </button>

            <button
              type="button"
              disabled={!canSubmit}
              onClick={() => onReject(vacancy.vacancyId, reason.trim())}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isRejecting && <Loader2 className="h-4 w-4 animate-spin" />}

              {lang === "ja" ? "求人を却下" : "Reject Vacancy"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
