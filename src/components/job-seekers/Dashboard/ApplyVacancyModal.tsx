"use client";

import { useEffect, useState, type ReactNode } from "react";

import axios from "axios";

import toast from "react-hot-toast";

import { Briefcase, Info, Loader2, MapPin, X } from "lucide-react";

import { applyToVacancy } from "./api";

import type { ApiErrorResponse, Vacancy } from "./types";

type ApplyVacancyModalProps = {
  open: boolean;

  vacancy: Vacancy | null;

  lang: string;

  onClose: () => void;

  onSuccess: () => void | Promise<void>;
};

export default function ApplyVacancyModal({
  open,
  vacancy,
  lang,
  onClose,
  onSuccess,
}: ApplyVacancyModalProps) {
  const [coverLetter, setCoverLetter] = useState("");

  const [submitting, setSubmitting] = useState(false);

  // ======================================================
  // RESET WHEN OPENING
  // ======================================================

  useEffect(() => {
    if (open) {
      setCoverLetter("");
    }
  }, [open, vacancy?.vacancyId]);

  if (!open || !vacancy) {
    return null;
  }

  // ======================================================
  // SUBMIT
  // ======================================================

  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      const response = await applyToVacancy({
        vacancyId: vacancy.vacancyId,

        coverLetter: coverLetter.trim() ? coverLetter.trim() : null,
      });

      toast.success(
        response.message ||
          (lang === "ja"
            ? "応募を送信しました"
            : "Application submitted successfully."),
      );

      await onSuccess();
    } catch (error: unknown) {
      console.error("Apply vacancy error:", error);

      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        toast.error(
          error.response?.data?.message || "Failed to submit application.",
        );

        return;
      }

      toast.error(
        lang === "ja"
          ? "応募の送信に失敗しました"
          : "Failed to submit application.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      {/* ================================================= */}
      {/* BACKDROP */}
      {/* ================================================= */}

      <button
        type="button"
        aria-label="Close"
        onClick={submitting ? undefined : onClose}
        className="absolute inset-0"
      />

      {/* ================================================= */}
      {/* MODAL */}
      {/* ================================================= */}

      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* HEADER */}

        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-slate-950">
              {lang === "ja"
                ? `${vacancy.title} に応募`
                : `Apply for ${vacancy.title}`}
            </h2>

            <p className="mt-1 text-sm text-slate-500">{vacancy.companyName}</p>
          </div>

          <button
            type="button"
            disabled={submitting}
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ================================================= */}
        {/* BODY */}
        {/* ================================================= */}

        <div className="max-h-[75vh] overflow-y-auto p-6">
          {/* JOB */}

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="text-sm font-semibold text-slate-900">
              {lang === "ja" ? "求人情報" : "Job Details"}
            </h3>

            <div className="mt-4 space-y-3 text-sm">
              <DetailRow
                icon={<Briefcase className="h-4 w-4" />}
                label={lang === "ja" ? "雇用形態" : "Employment Type"}
                value={vacancy.employmentType}
              />

              <DetailRow
                icon={<MapPin className="h-4 w-4" />}
                label={lang === "ja" ? "勤務地" : "Location"}
                value={vacancy.workLocation}
              />

              <DetailRow
                label={lang === "ja" ? "給与" : "Salary"}
                value={formatSalary(vacancy.salaryMin, vacancy.salaryMax)}
              />
            </div>
          </div>

          {/* ================================================= */}
          {/* PROFILE SNAPSHOT INFO */}
          {/* ================================================= */}

          <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-5">
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

              <div>
                <h3 className="font-semibold text-blue-800">
                  {lang === "ja"
                    ? "プロフィール情報の自動送信"
                    : "Automatic Profile Submission"}
                </h3>

                <p className="mt-1 text-sm leading-6 text-blue-700">
                  {lang === "ja"
                    ? "応募時点の職務プロフィール情報が保存され、応募審査に使用されます。"
                    : "Your professional profile at the time of application will be securely captured for application review."}
                </p>

                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-blue-700">
                  <li>
                    {lang === "ja" ? "国籍・ビザ情報" : "Nationality & Visa"}
                  </li>

                  <li>{lang === "ja" ? "日本語レベル" : "Japanese Level"}</li>

                  <li>{lang === "ja" ? "スキル" : "Skills"}</li>

                  <li>{lang === "ja" ? "学歴" : "Education Background"}</li>

                  <li>{lang === "ja" ? "職歴" : "Employment History"}</li>

                  <li>
                    {lang === "ja"
                      ? "応募時点の履歴書"
                      : "Application-specific Resume"}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* COVER LETTER */}
          {/* ================================================= */}

          <div className="mt-5">
            <label className="block text-sm font-medium text-slate-700">
              {lang === "ja"
                ? "応募理由・カバーレター（任意）"
                : "Cover Letter / Reason for Applying (optional)"}
            </label>

            <textarea
              rows={6}
              maxLength={3000}
              value={coverLetter}
              onChange={(event) => setCoverLetter(event.target.value)}
              placeholder={
                lang === "ja"
                  ? "簡単な自己紹介や応募理由を入力してください..."
                  : "Write a short introduction or cover letter..."
              }
              className="mt-2 w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white"
            />

            <p className="mt-1 text-right text-xs text-slate-400">
              {coverLetter.length}
              /3000
            </p>
          </div>
        </div>

        {/* ================================================= */}
        {/* FOOTER */}
        {/* ================================================= */}

        <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            type="button"
            disabled={submitting}
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {lang === "ja" ? "キャンセル" : "Cancel"}
          </button>

          <button
            type="button"
            disabled={submitting}
            onClick={() => void handleSubmit()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Loader2
              className={`h-4 w-4 animate-spin ${
                submitting ? "block" : "hidden"
              }`}
            />

            {submitting
              ? lang === "ja"
                ? "送信中..."
                : "Submitting..."
              : lang === "ja"
                ? "応募を送信"
                : "Submit Application"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ======================================================
// DETAIL ROW
// ======================================================

function DetailRow({
  icon,
  label,
  value,
}: {
  icon?: ReactNode;

  label: string;

  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-5">
      <div className="flex items-center gap-2 text-slate-500">
        {icon}

        <span>{label}</span>
      </div>

      <span className="text-right font-medium text-slate-900">{value}</span>
    </div>
  );
}

// ======================================================
// SALARY
// ======================================================

function formatSalary(
  minimum?: number | null,

  maximum?: number | null,
) {
  if (minimum == null && maximum == null) {
    return "-";
  }

  if (minimum != null && maximum != null) {
    return `${minimum} ~ ${maximum} 万円`;
  }

  if (minimum != null) {
    return `${minimum} 万円~`;
  }

  return `~ ${maximum} 万円`;
}
