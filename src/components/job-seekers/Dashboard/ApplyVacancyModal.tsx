"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";

import axios from "axios";

import { useTranslations } from "next-intl";

import toast from "react-hot-toast";

import { Briefcase, Check, Info, Loader2, MapPin, X } from "lucide-react";

import { applyToVacancy } from "./api";

import type { ApiErrorResponse, Vacancy } from "./types";

type ApplyVacancyModalProps = {
  open: boolean;

  vacancy: Vacancy | null;

  onClose: () => void;

  onSuccess: () => void | Promise<void>;
};

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700";
const btnBase = `inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2 text-[13px] font-semibold transition active:translate-y-px disabled:cursor-not-allowed disabled:opacity-55 ${focusRing}`;
const wrap = "[overflow-wrap:anywhere]";
const MAX_LENGTH = 3000;

export default function ApplyVacancyModal({
  open,
  vacancy,
  onClose,
  onSuccess,
}: ApplyVacancyModalProps) {
  const t = useTranslations("jobSeeker.dashboard");

  const titleId = useId();
  const textareaId = useId();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  // ======================================================
  // ESCAPE KEY, SCROLL LOCK, AUTOFOCUS
  // ======================================================

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(
      () => textareaRef.current?.focus(),
      50,
    );

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape" && !submitting) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, submitting, onClose]);

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

      toast.success(response.message || t("applySubmitSuccess"));

      await onSuccess();
    } catch (error: unknown) {
      console.error("Apply vacancy error:", error);

      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        toast.error(error.response?.data?.message || t("applySubmitError"));

        return;
      }

      toast.error(t("applySubmitError"));
    } finally {
      setSubmitting(false);
    }
  };

  const initial = (vacancy.companyName || vacancy.title || "?")
    .trim()
    .charAt(0)
    .toUpperCase();

  const snapshotItems = [
    t("profileSnapshotNationalityVisa"),
    t("profileSnapshotJapaneseLevel"),
    t("profileSnapshotSkills"),
    t("profileSnapshotEducation"),
    t("profileSnapshotEmployment"),
    t("profileSnapshotResume"),
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-emerald-950/40 backdrop-blur-sm sm:items-center sm:p-4">
      {/* BACKDROP */}

      <button
        type="button"
        tabIndex={-1}
        aria-label={t("close")}
        onClick={submitting ? undefined : onClose}
        className="absolute inset-0 cursor-default"
      />

      {/* MODAL (bottom sheet on mobile, centered dialog from sm up) */}

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-h-[90dvh] sm:max-w-xl sm:rounded-lg"
      >
        {/* HEADER */}

        <div className="flex items-start gap-3 border-b border-slate-200 px-4 py-4 sm:px-5">
          <span
            aria-hidden
            className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-emerald-50 text-base font-semibold text-emerald-800"
          >
            {initial}
          </span>

          <div className="min-w-0 flex-1">
            <h2
              id={titleId}
              className={`text-base font-semibold leading-snug text-emerald-950 sm:text-lg ${wrap}`}
            >
              {t("applyForTitle", { title: vacancy.title })}
            </h2>

            <p className={`mt-0.5 text-[13px] text-slate-600 ${wrap}`}>
              {vacancy.companyName}
            </p>
          </div>

          <button
            type="button"
            disabled={submitting}
            onClick={onClose}
            aria-label={t("close")}
            className={`-mr-1 grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-emerald-950 disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* BODY */}

        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5">
          {/* JOB */}

          <section aria-labelledby={`${titleId}-details`}>
            <h3
              id={`${titleId}-details`}
              className="text-[13px] font-semibold text-emerald-950"
            >
              {t("jobDetails")}
            </h3>

            <dl className="mt-2 divide-y divide-slate-100 rounded-md border border-slate-200 bg-white px-3.5 text-[13px]">
              <DetailRow
                icon={<Briefcase className="h-3.5 w-3.5" />}
                label={t("employmentType")}
                value={vacancy.employmentType}
              />

              <DetailRow
                icon={<MapPin className="h-3.5 w-3.5" />}
                label={t("location")}
                value={vacancy.workLocation}
              />

              <DetailRow
                label={t("salary")}
                highlight
                value={formatSalary(
                  vacancy.salaryMin,
                  vacancy.salaryMax,
                  t("salaryUnit"),
                )}
              />
            </dl>
          </section>

          {/* PROFILE SNAPSHOT INFO */}

          <section className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-3.5">
            <div className="flex items-start gap-2.5">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />

              <div className="min-w-0">
                <h3 className="text-[13px] font-semibold text-emerald-950">
                  {t("automaticProfileSubmission")}
                </h3>

                <p className="mt-1 text-xs leading-5 text-emerald-900/80">
                  {t("automaticProfileSubmissionDescription")}
                </p>

                <ul className="mt-2.5 grid gap-x-4 gap-y-1.5 sm:grid-cols-2">
                  {snapshotItems.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-1.5 text-xs leading-5 text-emerald-900"
                    >
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-700" />
                      <span className={wrap}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* COVER LETTER */}

          <div className="mt-4">
            <label
              htmlFor={textareaId}
              className="block text-[13px] font-medium text-emerald-950"
            >
              {t("coverLetterLabel")}
            </label>

            <textarea
              id={textareaId}
              ref={textareaRef}
              rows={5}
              maxLength={MAX_LENGTH}
              value={coverLetter}
              disabled={submitting}
              onChange={(event) => setCoverLetter(event.target.value)}
              placeholder={t("coverLetterPlaceholder")}
              className="mt-1.5 w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-2.5 text-base leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/25 disabled:bg-slate-50 sm:text-sm sm:leading-5"
            />

            <p
              className="mt-1 text-right text-xs tabular-nums text-slate-500"
              aria-live="polite"
            >
              {coverLetter.length}/{MAX_LENGTH}
            </p>
          </div>
        </div>

        {/* FOOTER */}

        <div className="flex flex-col-reverse gap-2 border-t border-slate-200 bg-slate-50 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:flex-row sm:justify-end sm:px-5">
          <button
            type="button"
            disabled={submitting}
            onClick={onClose}
            className={`${btnBase} border border-slate-200 bg-white text-emerald-950 hover:border-slate-300 hover:bg-slate-100`}
          >
            {t("cancel")}
          </button>

          <button
            type="button"
            disabled={submitting}
            aria-busy={submitting}
            onClick={() => void handleSubmit()}
            className={`${btnBase} bg-emerald-700 text-white hover:bg-emerald-800`}
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}

            {submitting ? t("submittingApplication") : t("submitApplication")}
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
  highlight = false,
}: {
  icon?: ReactNode;

  label: string;

  value: string;

  highlight?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <dt className="flex shrink-0 items-center gap-1.5 text-slate-500">
        {icon}

        <span>{label}</span>
      </dt>

      <dd
        className={`text-right font-medium ${wrap} ${
          highlight ? "text-emerald-800" : "text-emerald-950"
        }`}
      >
        {value || "-"}
      </dd>
    </div>
  );
}

// ======================================================
// SALARY
// ======================================================

function formatSalary(
  minimum?: number | null,

  maximum?: number | null,

  unit = "",
) {
  if (minimum == null && maximum == null) {
    return "-";
  }

  if (minimum != null && maximum != null) {
    return `${minimum} ~ ${maximum} ${unit}`;
  }

  if (minimum != null) {
    return `${minimum} ${unit}~`;
  }

  return `~ ${maximum} ${unit}`;
}