"use client";

import type { ComponentType, ReactNode } from "react";
import {
  AlertTriangle,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  FileText,
  Mail,
  Phone,
  UserRound,
  X,
} from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

import type { AdminProvider, ProviderStatus } from "./types";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-950";

type Props = {
  provider: AdminProvider;

  onClose: () => void;
};

// ======================================================
// COMPONENT
// ======================================================

export default function ViewModal({ provider, onClose }: Props) {
  const { lang } = useLanguage();

  const review = provider.staffReview;

  // ==================================================
  // STAFF REVIEW STATE
  // ==================================================

  let reviewBadgeClass =
    "border-zinc-200 bg-zinc-100 text-zinc-600 dark:border-white/10 dark:bg-white/10 dark:text-zinc-300";

  let reviewLabel = lang === "ja" ? "未確認" : "Not Reviewed";

  let bannerClass =
    "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200";

  let BannerIcon = AlertTriangle;

  let bannerTitle =
    lang === "ja"
      ? "このクライアント企業はまだスタッフに確認されていません。"
      : "This client company has not been reviewed by Staff yet.";

  let bannerText =
    lang === "ja"
      ? "アカウント管理の権限は引き続き管理者にあります。"
      : "Admin still retains full account management authority.";

  switch (review.status) {
    case "REVIEWED":
      reviewBadgeClass =
        "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300";

      reviewLabel = lang === "ja" ? "確認済み" : "Reviewed";

      bannerClass =
        "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200";

      BannerIcon = CheckCircle2;

      bannerTitle =
        lang === "ja" ? "スタッフの確認が完了しました。" : "Staff review completed.";

      bannerText =
        lang === "ja"
          ? "企業情報と運用情報が確認されています。"
          : "Company and operational information has been reviewed.";

      break;

    case "NEEDS_ATTENTION":
      reviewBadgeClass =
        "border-red-200 bg-red-50 text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300";

      reviewLabel = lang === "ja" ? "要確認" : "Needs Attention";

      bannerClass =
        "border-red-200 bg-red-50 text-red-800 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-200";

      bannerTitle =
        lang === "ja"
          ? "スタッフがこのクライアント企業を要確認としました。"
          : "Staff marked this client company as needing attention.";

      bannerText =
        lang === "ja"
          ? "アカウントに関する判断の前に、スタッフのメモを確認してください。"
          : "Review the Staff note before making account-related decisions.";

      break;
  }

  // ==================================================
  // UI
  // ==================================================

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="view-provider-title"
      className="fixed inset-0 z-[80] flex items-center justify-center bg-zinc-950/50 p-4 backdrop-blur-sm"
    >
      <button
        type="button"
        tabIndex={-1}
        aria-label={lang === "ja" ? "閉じる" : "Close"}
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-xl dark:border-white/10 dark:bg-zinc-900">
        {/* HEADER */}

        <div className="flex items-start justify-between gap-3 border-b border-zinc-200 px-4 py-4 dark:border-white/10 sm:px-5">
          <div className="min-w-0">
            <p
              title={provider.registerId}
              className="truncate text-xs font-medium text-emerald-600 dark:text-emerald-400"
            >
              {provider.registerId}
            </p>

            <h2
              id="view-provider-title"
              className="mt-1 break-words text-lg font-semibold text-zinc-950 dark:text-white sm:text-xl"
            >
              {provider.companyName}
            </h2>

            <p className="mt-0.5 break-words text-sm text-zinc-500 dark:text-zinc-400">
              {provider.name}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <ProviderStatusBadge status={provider.status} lang={lang} />

            <button
              type="button"
              onClick={onClose}
              aria-label={lang === "ja" ? "閉じる" : "Close"}
              className={`grid h-9 w-9 cursor-pointer place-items-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-white/10 ${focusRing}`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* BODY */}

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
          <div className="grid gap-3 md:grid-cols-2">
            <Section
              icon={UserRound}
              title={lang === "ja" ? "基本情報" : "Basic Information"}
            >
              <Field
                label={lang === "ja" ? "担当者名" : "Provider Name"}
                value={provider.name}
              />

              <Field
                label={lang === "ja" ? "企業名" : "Company"}
                value={provider.companyName}
              />

              <Field
                label={lang === "ja" ? "メール" : "Email"}
                value={provider.email}
              />

              <Field
                label={lang === "ja" ? "電話番号" : "Phone"}
                value={provider.phone}
              />
            </Section>

            <Section
              icon={Building2}
              title={lang === "ja" ? "企業情報" : "Company Information"}
            >
              <Field
                label={lang === "ja" ? "業種" : "Industry"}
                value={provider.industry}
              />

              <Field
                label={lang === "ja" ? "住所" : "Address"}
                value={provider.address}
              />

              <Field
                label={lang === "ja" ? "ウェブサイト" : "Website"}
                value={provider.website}
              />
            </Section>

            <Section
              icon={Phone}
              title={lang === "ja" ? "担当者" : "Contact Person"}
            >
              <Field
                label={lang === "ja" ? "氏名" : "Name"}
                value={provider.contactPerson}
              />

              <Field
                label={lang === "ja" ? "電話番号" : "Phone"}
                value={provider.contactPersonPhone}
              />

              <Field
                label={lang === "ja" ? "メール" : "Email"}
                value={provider.contactPersonEmail}
              />
            </Section>

            <Section
              icon={BriefcaseBusiness}
              title={lang === "ja" ? "採用情報" : "Hiring Information"}
            >
              <Field
                label={lang === "ja" ? "採用ニーズ" : "Hiring Needs"}
                value={provider.hiringNeeds}
              />

              <Field
                label={lang === "ja" ? "企業メモ" : "Provider Notes"}
                value={provider.notes}
              />
            </Section>
          </div>

          {/* STATISTICS */}

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 rounded-lg border border-zinc-200 p-3 dark:border-white/10">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400">
                <FileText className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  {lang === "ja" ? "求人" : "Vacancies"}
                </p>

                <p className="mt-0.5 text-xl font-semibold leading-tight text-zinc-950 dark:text-white">
                  {provider.vacancyCount}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-zinc-200 p-3 dark:border-white/10">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400">
                <Mail className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  {lang === "ja" ? "応募" : "Applications"}
                </p>

                <p className="mt-0.5 text-xl font-semibold leading-tight text-zinc-950 dark:text-white">
                  {provider.applicationCount}
                </p>
              </div>
            </div>
          </div>

          {/* STAFF REVIEW */}

          <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
                {lang === "ja" ? "スタッフ確認" : "Staff Review"}
              </h3>

              <span
                className={`whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium ${reviewBadgeClass}`}
              >
                {reviewLabel}
              </span>
            </div>

            <div className={`flex gap-3 rounded-lg border p-3 ${bannerClass}`}>
              <BannerIcon className="mt-0.5 h-4 w-4 shrink-0" />

              <div className="min-w-0">
                <p className="text-sm font-medium">{bannerTitle}</p>

                <p className="mt-0.5 text-xs opacity-90">{bannerText}</p>
              </div>
            </div>

            {review.status !== "NOT_REVIEWED" && (
              <dl className="grid gap-3 rounded-md bg-zinc-50 p-3 dark:bg-white/5 sm:grid-cols-2">
                <Field
                  label={lang === "ja" ? "確認者" : "Reviewed By"}
                  value={review.reviewedByStaffId}
                />

                <Field
                  label={lang === "ja" ? "確認日時" : "Reviewed At"}
                  value={formatDateTime(review.reviewedAt, lang)}
                />
              </dl>
            )}

            {review.note && (
              <div
                className={`rounded-lg border p-3 ${
                  review.status === "NEEDS_ATTENTION"
                    ? "border-red-200 bg-red-50 dark:border-red-400/20 dark:bg-red-400/10"
                    : "border-zinc-200 bg-zinc-50 dark:border-white/10 dark:bg-white/5"
                }`}
              >
                <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                  {lang === "ja" ? "スタッフのメモ" : "Staff Review Note"}
                </p>

                <p className="mt-1 whitespace-pre-wrap break-words text-sm text-zinc-700 dark:text-zinc-200">
                  {review.note}
                </p>
              </div>
            )}

            <p className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-500 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400">
              {lang === "ja"
                ? "スタッフ確認は運用上の情報です。企業の有効化・停止・編集・削除は引き続き管理者が管理します。"
                : "Staff review is operational information only. Provider activation, suspension, editing and deletion remain controlled by Admin."}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

// ======================================================
// SECTION
// ======================================================

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-lg border border-zinc-200 p-4 dark:border-white/10">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-950 dark:text-white">
        <Icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />

        {title}
      </div>

      <dl className="space-y-3">{children}</dl>
    </section>
  );
}

// ======================================================
// FIELD
// ======================================================

function Field({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
        {label}
      </dt>

      <dd className="mt-0.5 break-words text-sm font-medium text-zinc-900 dark:text-zinc-100">
        {value ?? "-"}
      </dd>
    </div>
  );
}

// ======================================================
// STATUS
// ======================================================

function ProviderStatusBadge({
  status,
  lang,
}: {
  status: ProviderStatus;
  lang: string;
}) {
  let className =
    "bg-zinc-100 text-zinc-600 dark:bg-white/10 dark:text-zinc-300";

  let label = lang === "ja" ? "無効" : "Inactive";

  switch (status) {
    case "active":
      className =
        "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300";

      label = lang === "ja" ? "有効" : "Active";

      break;

    case "suspended":
      className = "bg-red-50 text-red-700 dark:bg-red-400/10 dark:text-red-300";

      label = lang === "ja" ? "停止中" : "Suspended";

      break;
  }

  return (
    <span
      className={`h-fit shrink-0 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}

// ======================================================
// DATE
// ======================================================

function formatDateTime(value?: string | null, lang = "en") {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat(lang === "ja" ? "ja-JP" : "en-US", {
    year: "numeric",
    month: lang === "ja" ? "numeric" : "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}