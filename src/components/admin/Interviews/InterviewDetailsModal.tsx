"use client";

import {
  Building2,
  CalendarDays,
  Clock3,
  Link2,
  Mail,
  MapPin,
  Pencil,
  Phone,
  UserRound,
  Video,
  X,
} from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

import type {
  AdminInterview,
  AdminInterviewMethod,
  AdminInterviewStatus,
} from "./types";

// ======================================================
// PROPS
// ======================================================

type Props = {
  interview: AdminInterview;

  onClose: () => void;

  onEdit: (interview: AdminInterview) => void;
};

// ======================================================
// DATE
// ======================================================

const formatDate = (value?: string | null, lang = "en") => {
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
  }).format(date);
};

// ======================================================
// DATE TIME
// ======================================================

const formatDateTime = (value?: string | null, lang = "en") => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat(lang === "ja" ? "ja-JP" : "en-US", {
    year: "numeric",

    month: "short",

    day: "numeric",

    hour: "2-digit",

    minute: "2-digit",
  }).format(date);
};

// ======================================================
// METHOD
// ======================================================

const methodLabel = (method: AdminInterviewMethod, lang: string) => {
  if (method === "ZOOM") {
    return "Zoom";
  }

  if (method === "GOOGLE_MEET") {
    return "Google Meet";
  }

  if (method === "PHONE") {
    return lang === "ja" ? "電話" : "Phone";
  }

  if (method === "FACE_TO_FACE") {
    return lang === "ja" ? "対面" : "Face-to-Face";
  }

  return lang === "ja" ? "その他" : "Other";
};

// ======================================================
// STATUS
// ======================================================

const statusLabel = (status: AdminInterviewStatus, lang: string) => {
  switch (status) {
    case "AWAITING_LINK":
      return lang === "ja" ? "リンク待ち" : "Awaiting Link";

    case "CONFIRMED":
      return lang === "ja" ? "確定" : "Confirmed";

    case "COMPLETED":
      return lang === "ja" ? "完了" : "Completed";

    case "CANCELLED":
      return lang === "ja" ? "キャンセル" : "Cancelled";
  }
};

const statusClass = (status: AdminInterviewStatus) => {
  switch (status) {
    case "AWAITING_LINK":
      return "border-amber-200 bg-amber-50 text-amber-700";

    case "CONFIRMED":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "COMPLETED":
      return "border-blue-200 bg-blue-50 text-blue-700";

    case "CANCELLED":
      return "border-red-200 bg-red-50 text-red-700";
  }
};

// ======================================================
// COMPONENT
// ======================================================

export default function InterviewDetailsModal({
  interview,
  onClose,
  onEdit,
}: Props) {
  const { lang } = useLanguage();

  const canEdit =
    interview.applicationStatus === "INTERVIEW" &&
    interview.status !== "COMPLETED" &&
    interview.status !== "CANCELLED";

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* HEADER */}

        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
              {interview.interviewId}
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-950">
              {interview.candidate?.name || "-"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {interview.vacancy?.title || "-"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClass(
                interview.status,
              )}`}
            >
              {statusLabel(interview.status, lang)}
            </span>

            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-full p-2 text-slate-500 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* BODY */}

        <div className="overflow-y-auto p-6">
          <div className="space-y-8">
            {/* SCHEDULE */}

            <section>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-lg font-bold text-slate-950">
                  {lang === "ja" ? "面接スケジュール" : "Interview Schedule"}
                </h3>

                {canEdit && (
                  <button
                    type="button"
                    onClick={() => onEdit(interview)}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
                  >
                    <Pencil className="h-4 w-4" />

                    {lang === "ja" ? "編集" : "Edit Interview"}
                  </button>
                )}
              </div>

              <div className="grid gap-3 md:grid-cols-4">
                <DetailItem
                  icon={<CalendarDays className="h-4 w-4" />}
                  label={lang === "ja" ? "面接日" : "Date"}
                  value={formatDate(interview.interviewDate, lang)}
                />

                <DetailItem
                  icon={<Clock3 className="h-4 w-4" />}
                  label={lang === "ja" ? "時間" : "Time"}
                  value={interview.interviewTime}
                />

                <DetailItem
                  icon={<Clock3 className="h-4 w-4" />}
                  label={lang === "ja" ? "タイムゾーン" : "Timezone"}
                  value={interview.timezone}
                />

                <DetailItem
                  icon={<Video className="h-4 w-4" />}
                  label={lang === "ja" ? "面接方法" : "Method"}
                  value={methodLabel(interview.interviewMethod, lang)}
                />
              </div>

              {interview.meetingLink ? (
                <div className="mt-4 rounded-2xl border border-indigo-200 bg-indigo-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-indigo-900">
                    <Link2 className="h-4 w-4" />

                    {lang === "ja" ? "ミーティングリンク" : "Meeting Link"}
                  </div>

                  <a
                    href={interview.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 block break-all text-sm font-medium text-indigo-600 underline"
                  >
                    {interview.meetingLink}
                  </a>
                </div>
              ) : (
                interview.status === "AWAITING_LINK" && (
                  <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                    {lang === "ja"
                      ? "オンライン面接リンクがまだ登録されていません。編集画面からリンクを追加できます。"
                      : "The online interview link has not been added yet. Admin can add it from Edit Interview."}
                  </div>
                )
              )}

              {interview.notes && (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {lang === "ja" ? "重要事項" : "Important Notes"}
                  </p>

                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                    {interview.notes}
                  </p>
                </div>
              )}
            </section>

            {/* CANDIDATE */}

            <section>
              <h3 className="mb-4 text-lg font-bold text-slate-950">
                {lang === "ja" ? "候補者情報" : "Candidate Information"}
              </h3>

              <div className="grid gap-3 md:grid-cols-3">
                <DetailItem
                  icon={<UserRound className="h-4 w-4" />}
                  label={lang === "ja" ? "求職者ID" : "Seeker ID"}
                  value={interview.seekerId}
                />

                <DetailItem
                  label={lang === "ja" ? "氏名" : "Name"}
                  value={interview.candidate?.name}
                />

                <DetailItem
                  icon={<Mail className="h-4 w-4" />}
                  label="Email"
                  value={interview.candidate?.email}
                />

                <DetailItem
                  icon={<Phone className="h-4 w-4" />}
                  label={lang === "ja" ? "電話" : "Phone"}
                  value={interview.candidate?.phone}
                />

                <DetailItem
                  label={lang === "ja" ? "国籍" : "Nationality"}
                  value={interview.candidate?.nationality}
                />

                <DetailItem
                  label={lang === "ja" ? "在留資格" : "Visa"}
                  value={interview.candidate?.visaType}
                />

                <DetailItem
                  label={lang === "ja" ? "日本語レベル" : "Japanese"}
                  value={interview.candidate?.japaneseLevel}
                />

                <DetailItem
                  icon={<MapPin className="h-4 w-4" />}
                  label={lang === "ja" ? "現在地" : "Current Location"}
                  value={interview.candidate?.currentLocation}
                />
              </div>
            </section>

            {/* VACANCY */}

            <section>
              <h3 className="mb-4 text-lg font-bold text-slate-950">
                {lang === "ja" ? "求人情報" : "Vacancy Information"}
              </h3>

              <div className="grid gap-3 md:grid-cols-3">
                <DetailItem
                  label={lang === "ja" ? "求人ID" : "Vacancy ID"}
                  value={interview.vacancyId}
                />

                <DetailItem
                  label={lang === "ja" ? "職種" : "Position"}
                  value={interview.vacancy?.title}
                />

                <DetailItem
                  icon={<Building2 className="h-4 w-4" />}
                  label={lang === "ja" ? "企業" : "Company"}
                  value={interview.vacancy?.companyName}
                />

                <DetailItem
                  label={lang === "ja" ? "雇用形態" : "Employment"}
                  value={interview.vacancy?.employmentType}
                />

                <DetailItem
                  icon={<MapPin className="h-4 w-4" />}
                  label={lang === "ja" ? "勤務地" : "Work Location"}
                  value={interview.vacancy?.workLocation}
                />
              </div>
            </section>

            {/* PROVIDER */}

            <section>
              <h3 className="mb-4 text-lg font-bold text-slate-950">
                {lang === "ja" ? "企業アカウント" : "Provider Information"}
              </h3>

              <div className="grid gap-3 md:grid-cols-3">
                <DetailItem
                  label={lang === "ja" ? "企業ID" : "Provider ID"}
                  value={interview.providerId}
                />

                <DetailItem
                  label={lang === "ja" ? "担当者" : "Provider Name"}
                  value={interview.provider?.name}
                />

                <DetailItem
                  label={lang === "ja" ? "会社" : "Company"}
                  value={interview.provider?.companyName}
                />

                <DetailItem
                  icon={<Mail className="h-4 w-4" />}
                  label="Email"
                  value={interview.provider?.email}
                />
              </div>
            </section>

            {/* AUDIT */}

            <section>
              <h3 className="mb-4 text-lg font-bold text-slate-950">
                {lang === "ja" ? "システム情報" : "System Information"}
              </h3>

              <div className="grid gap-3 md:grid-cols-3">
                <DetailItem
                  label={lang === "ja" ? "応募ID" : "Application ID"}
                  value={interview.applicationId}
                />

                <DetailItem
                  label={
                    lang === "ja" ? "応募ステータス" : "Application Status"
                  }
                  value={interview.applicationStatus}
                />

                <DetailItem
                  label={lang === "ja" ? "登録者" : "Scheduled By"}
                  value={`${interview.scheduledBy?.role || "-"} / ${
                    interview.scheduledBy?.id || "-"
                  }`}
                />

                <DetailItem
                  label={lang === "ja" ? "最終更新者" : "Updated By"}
                  value={`${interview.updatedBy?.role || "-"} / ${
                    interview.updatedBy?.id || "-"
                  }`}
                />

                <DetailItem
                  label={lang === "ja" ? "確定日時" : "Confirmed At"}
                  value={formatDateTime(interview.confirmedAt, lang)}
                />

                <DetailItem
                  label={lang === "ja" ? "通知送信日時" : "Notification Sent"}
                  value={formatDateTime(interview.notificationSentAt, lang)}
                />
              </div>
            </section>
          </div>
        </div>

        {/* FOOTER */}

        <div className="flex justify-end border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {lang === "ja" ? "閉じる" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ======================================================
// DETAIL ITEM
// ======================================================

function DetailItem({
  label,
  value,
  icon,
}: {
  label: string;

  value: string | number | null | undefined;

  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-slate-500">
        {icon}

        <p className="text-xs font-semibold uppercase tracking-wide">{label}</p>
      </div>

      <p className="mt-2 break-words text-sm font-medium text-slate-900">
        {value || "-"}
      </p>
    </div>
  );
}
