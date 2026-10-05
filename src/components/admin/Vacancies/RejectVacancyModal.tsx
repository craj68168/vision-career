"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";

import { Loader2, X } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

import type { AdminVacancy } from "./types";

type Props = {
  vacancy: AdminVacancy;

  isRejecting: boolean;

  onClose: () => void;

  onReject: (vacancyId: string, reason: string) => void;
};

const MAX_LENGTH = 1000;

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-900";

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function RejectVacancyModal({
  vacancy,
  isRejecting,
  onClose,
  onReject,
}: Props) {
  const { lang } = useLanguage();
  const ja = lang === "ja";

  const titleId = useId();
  const fieldId = useId();
  const hintId = useId();

  const dialogRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [reason, setReason] = useState("");

  const canSubmit = reason.trim().length > 0 && !isRejecting;
  const isNearLimit = reason.length >= MAX_LENGTH * 0.9;

  // Lock background scroll, focus the reason field, restore focus on close.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    textareaRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, []);

  const submit = () => {
    if (canSubmit) {
      onReject(vacancy.vacancyId, reason.trim());
    }
  };

  // Escape closes (unless busy), Ctrl/Cmd+Enter submits, Tab stays inside.
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.stopPropagation();

      if (!isRejecting) {
        onClose();
      }

      return;
    }

    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      submit();
      return;
    }

    if (event.key !== "Tab" || !dialogRef.current) {
      return;
    }

    const focusable = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
    );

    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-zinc-950/50 backdrop-blur-sm sm:items-center sm:p-4">
      {/* Backdrop click closes the modal. Escape and the X button are the keyboard routes. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        onClick={() => {
          if (!isRejecting) {
            onClose();
          }
        }}
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-t-xl border border-zinc-200 bg-white shadow-2xl outline-none dark:border-white/10 dark:bg-zinc-900 sm:rounded-xl"
      >
        {/* HEADER */}

        <div className="flex items-start justify-between gap-4 border-b border-zinc-200 px-4 py-4 dark:border-white/10 sm:px-6">
          <div className="min-w-0">
            <h2
              id={titleId}
              className="text-lg font-semibold text-zinc-950 dark:text-white"
            >
              {ja ? "求人を却下" : "Reject Vacancy"}
            </h2>

            <p className="mt-1 break-words text-sm text-zinc-600 dark:text-zinc-300">
              {vacancy.title}
            </p>

            <p className="mt-0.5 break-words text-xs text-zinc-500 dark:text-zinc-400">
              {vacancy.companyName}
            </p>
          </div>

          <button
            type="button"
            disabled={isRejecting}
            onClick={onClose}
            aria-label={ja ? "閉じる" : "Close"}
            className={`grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white ${focusRing}`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* BODY */}

        <div className="px-4 py-4 sm:px-6">
          <label
            htmlFor={fieldId}
            className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
          >
            {ja ? "却下理由" : "Reason for rejection"}
          </label>

          <p
            id={hintId}
            className="mt-1 text-xs text-zinc-500 dark:text-zinc-400"
          >
            {ja
              ? "企業が修正する内容を具体的に入力してください。この内容は企業に共有されます。"
              : "Explain what the Provider should correct before resubmitting. This is shared with the Provider."}
          </p>

          <textarea
            id={fieldId}
            ref={textareaRef}
            rows={5}
            maxLength={MAX_LENGTH}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            disabled={isRejecting}
            aria-describedby={hintId}
            placeholder={
              ja
                ? "例：仕事内容をより具体的に記載してください。"
                : "Example: Please provide a more detailed job description."
            }
            className="mt-3 w-full resize-none rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-red-400 focus:ring-2 focus:ring-red-500/20 disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-white dark:disabled:bg-white/5"
          />

          <p
            className={`mt-1.5 text-right text-xs ${
              isNearLimit
                ? "text-amber-600 dark:text-amber-400"
                : "text-zinc-400 dark:text-zinc-500"
            }`}
          >
            {reason.length}/{MAX_LENGTH}
          </p>
        </div>

        {/* ACTIONS */}

        <div className="flex flex-wrap justify-end gap-2 border-t border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-white/10 dark:bg-zinc-950/40 sm:px-6">
          <button
            type="button"
            disabled={isRejecting}
            onClick={onClose}
            className={`inline-flex h-9 cursor-pointer items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10 ${focusRing}`}
          >
            {ja ? "キャンセル" : "Cancel"}
          </button>

          <button
            type="button"
            disabled={!canSubmit}
            onClick={submit}
            className={`inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`}
          >
            {isRejecting && <Loader2 className="h-4 w-4 animate-spin" />}

            {ja ? "求人を却下" : "Reject Vacancy"}
          </button>
        </div>
      </div>
    </div>
  );
}