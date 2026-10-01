"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import {
  AlertCircle,
  ArrowLeft,
  BadgeCheck,
  Briefcase,
  Building2,
  CalendarDays,
  Compass,
  Edit2,
  FileText,
  Globe,
  GraduationCap,
  Languages,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Upload,
  User,
} from "lucide-react";

import { useJobSeekerProfileView } from "./hook";

/*
  Design tokens (same as job seeker dashboard, Tailwind only)
  - page      oklch(0.975 0.008 150)   text emerald-950   muted slate-600
  - primary   emerald-700 (hover 800)  soft emerald-50
  - weights   headings semibold, labels/body medium or normal (no bold)
  - density   compact: 40px controls, 16px card padding, 12px gaps
*/

const pageBg = "bg-[oklch(0.975_0.008_150)] text-emerald-950";
const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700";
const btnBase = `inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-md px-3.5 py-2 text-[13px] font-semibold transition active:translate-y-px disabled:cursor-not-allowed disabled:opacity-55 ${focusRing}`;
const btnPrimary = `${btnBase} bg-emerald-700 text-white hover:bg-emerald-800`;
const btnSecondary = `${btnBase} border border-slate-200 bg-white text-emerald-950 hover:border-slate-300 hover:bg-slate-100`;
const btnWarning = `${btnBase} bg-amber-600 text-white hover:bg-amber-700`;

const container = "mx-auto w-full max-w-[90rem] px-4 sm:px-6 lg:px-10";
const sectionCard =
  "min-w-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm";
const rowCard =
  "flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-slate-50 p-3";
const labelCaps =
  "text-[10px] font-medium uppercase tracking-wider text-slate-500";
const wrap = "[overflow-wrap:anywhere]";

const MISSING_FIELD_LABELS: Record<string, { ja: string; en: string }> = {
  phone: { ja: "\u96fb\u8a71\u756a\u53f7", en: "Phone Number" },
  address: { ja: "\u4f4f\u6240", en: "Address" },
  nationality: { ja: "\u56fd\u7c4d", en: "Nationality" },
  visa_type: { ja: "\u30d3\u30b6\u7a2e\u985e", en: "Visa Type" },
  japanese_level: { ja: "\u65e5\u672c\u8a9e\u30ec\u30d9\u30eb", en: "Japanese Level" },
  desired_job: { ja: "\u5e0c\u671b\u8077\u7a2e", en: "Desired Job" },
  desired_location: { ja: "\u5e0c\u671b\u52e4\u52d9\u5730", en: "Desired Location" },
  available_from: { ja: "\u5c31\u696d\u53ef\u80fd\u65e5", en: "Available From" },
  resume_file: { ja: "\u5c65\u6b74\u66f8", en: "Resume File" },
  education: { ja: "\u5b66\u6b74", en: "Educational Background" },
  employment_history: { ja: "\u8077\u6b74", en: "Employment History" },
};

export default function JobSeekerProfileView() {
  const t = useTranslations("jobSeeker.profile");
  const {
    profile,
    education,
    employmentHistory,
    isComplete,
    completionPercentage,
    missingFields,
    lang,
    loading,
    formatDate,
    editProfile,
    backToDashboard,
    viewGeneratedResume,
  } = useJobSeekerProfileView();

  if (loading) {
    return (
      <div
        className={`flex min-h-dvh items-center justify-center ${pageBg}`}
        role="status"
        aria-busy="true"
      >
        <Loader2 className="h-6 w-6 animate-spin text-emerald-700" />
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const placementStatusLabels: Record<string, string> = {
    unplaced: t("placementUnplaced"),
    matching: t("placementMatching"),
    interview: t("placementInterview"),
    selected: t("placementSelected"),
    placed: t("placementPlaced"),
  };

  const placementStatus =
    placementStatusLabels[profile.placement_status || "unplaced"] ||
    profile.placement_status ||
    "-";

  const backendBaseUrl =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") ||
    "http://localhost:5000";

  const getFileUrl = (value: string) => {
    if (/^https?:\/\//i.test(value)) {
      return value;
    }

    return `${backendBaseUrl}${value.startsWith("/") ? value : `/${value}`}`;
  };

  const getDisplayFileName = (value: string, fallback: string) => {
    try {
      const path = /^https?:\/\//i.test(value)
        ? new URL(value).pathname
        : value;

      const lastPart = path.split("/").filter(Boolean).pop();

      if (!lastPart) {
        return fallback;
      }

      return decodeURIComponent(lastPart).replace(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-/i,
        "",
      );
    } catch {
      return fallback;
    }
  };

  const getMissingFieldLabel = (field: string, backendLabel: string) => {
    const labels = MISSING_FIELD_LABELS[field];

    if (!labels) {
      return backendLabel;
    }

    return lang === "ja" ? labels.ja : labels.en;
  };

  const progress = Math.min(
    Math.max(Number(completionPercentage) || 0, 0),
    100,
  );

  const initial = (profile.name || "?").trim().charAt(0).toUpperCase();

  return (
    <div className={`min-h-dvh ${pageBg}`}>
      {/*
        Header + quick facts share one surface: it starts white (matches the navbar)
        and fades into the page background, same as the dashboard.
      */}
      <header className="bg-gradient-to-b from-white to-[oklch(0.975_0.008_150)]">
        <div className={`${container} pt-5 sm:pt-6`}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Identity */}
            <div className="flex min-w-0 items-center gap-4">
              <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full bg-emerald-50 text-2xl font-semibold text-emerald-800 shadow-md ring-4 ring-white sm:h-20 sm:w-20">
                {profile.profile_photo ? (
                  <img
                    src={getFileUrl(profile.profile_photo)}
                    alt={profile.name || t("profilePhoto")}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span aria-hidden>{initial}</span>
                )}
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium text-emerald-700">
                  {t("pageLabel")}
                </p>

                <h1
                  className={`mt-0.5 text-balance text-xl font-semibold tracking-tight sm:text-2xl ${wrap}`}
                >
                  {profile.name}
                </h1>

                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <p
                    className={`inline-flex min-w-0 items-center gap-1.5 text-sm text-slate-600 ${wrap}`}
                  >
                    <Mail
                      aria-hidden
                      className="h-3.5 w-3.5 shrink-0 text-slate-400"
                    />
                    {profile.email}
                  </p>

                  {isComplete && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-800">
                      <BadgeCheck aria-hidden className="h-3.5 w-3.5" />
                      {lang === "ja" ? "プロフィール完了" : "Profile complete"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap lg:shrink-0">
              <button
                type="button"
                onClick={backToDashboard}
                className={btnSecondary}
              >
                <ArrowLeft className="h-4 w-4" />
                {t("dashboard")}
              </button>

              <button
                type="button"
                onClick={editProfile}
                className={btnPrimary}
              >
                <Edit2 className="h-4 w-4" />
                {t("editProfile")}
              </button>
            </div>
          </div>

          {/* Quick facts */}
          <section
            className="mt-5 grid grid-cols-2 gap-2.5 sm:gap-3 xl:grid-cols-4"
            aria-label={t("pageLabel")}
          >
            <FactCard
              icon={<Compass />}
              label={t("placementStatus")}
              value={placementStatus}
            />
            <FactCard
              icon={<Languages />}
              label={t("japaneseLevel")}
              value={profile.japanese_level}
            />
            <FactCard
              icon={<Globe />}
              label={t("visaType")}
              value={profile.visa_type}
            />
            <FactCard
              icon={<CalendarDays />}
              label={t("availableFrom")}
              value={formatDate(profile.available_from)}
            />
          </section>
        </div>
      </header>

      <main className={`${container} pb-6`}>
        {!isComplete && (
          <section className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <span
                  aria-hidden
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-amber-500 text-white"
                >
                  <AlertCircle className="h-4 w-4" />
                </span>

                <div className="min-w-0">
                  <h2 className="flex flex-wrap items-baseline gap-x-2 text-sm font-semibold text-amber-950">
                    {t("profileIncomplete")}
                    <span className="text-[13px] font-medium tabular-nums text-amber-900/80">
                      {progress}%
                    </span>
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={editProfile}
                className={`${btnWarning} w-full shrink-0 sm:w-auto`}
              >
                {t("completeProfile")}
              </button>
            </div>

            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
              aria-label={
                lang === "ja" ? "プロフィール完成度" : "Profile completion"
              }
              className="mt-3 h-2 overflow-hidden rounded-full bg-amber-100"
            >
              <div
                className="h-full rounded-full bg-amber-500 transition-[width] duration-500 motion-reduce:transition-none"
                style={{ width: `${progress}%` }}
              />
            </div>

            {missingFields.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {missingFields.map((field) => (
                  <span
                    key={field.field}
                    className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-900"
                  >
                    {getMissingFieldLabel(field.field, field.label)}
                  </span>
                ))}
              </div>
            )}
          </section>
        )}

        <div className="mt-4 grid gap-3 sm:gap-4 lg:grid-cols-[minmax(0,1fr)_20rem] xl:grid-cols-[minmax(0,1fr)_23rem]">
          {/* Main column */}
          <div className="min-w-0 space-y-3 sm:space-y-4">
            <ProfileSection title={t("basicInformation")} icon={<User />}>
              <FieldGrid>
                <ViewField
                  label={t("phone")}
                  value={profile.phone}
                  icon={<Phone />}
                />
                <ViewField
                  label={t("dateOfBirth")}
                  value={formatDate(profile.date_of_birth)}
                />
                <ViewField label={t("gender")} value={profile.gender} />
                <ViewField
                  label={t("nationality")}
                  value={profile.nationality}
                />
                <ViewField
                  label={t("address")}
                  value={profile.address}
                  icon={<MapPin />}
                  className="sm:col-span-2"
                />
              </FieldGrid>
            </ProfileSection>

            <ProfileSection title={t("education")} icon={<GraduationCap />}>
              {education.length === 0 ? (
                <EmptyText label={t("noInformation")} />
              ) : (
                <Timeline>
                  {education.map((record, index) => (
                    <TimelineItem
                      key={record._id ?? index}
                      title={record.school}
                      subtitle={`${record.school_type || "-"} / ${
                        record.major || "-"
                      }`}
                      period={`${formatDate(record.enrollment_date)} → ${formatDate(
                        record.graduation_date,
                      )}`}
                    />
                  ))}
                </Timeline>
              )}
            </ProfileSection>

            <ProfileSection
              title={t("employmentHistory")}
              icon={<Building2 />}
            >
              {employmentHistory.length === 0 ? (
                <EmptyText label={t("noInformation")} />
              ) : (
                <Timeline>
                  {employmentHistory.map((record, index) => (
                    <TimelineItem
                      key={record._id ?? index}
                      title={record.company_name}
                      subtitle={record.employment_type || "-"}
                      period={`${formatDate(record.start_date)} → ${formatDate(
                        record.end_date,
                      )}`}
                    />
                  ))}
                </Timeline>
              )}
            </ProfileSection>

            <ProfileSection title={t("additionalNotes")} icon={<FileText />}>
              <p
                className={`whitespace-pre-wrap text-[13px] leading-5 text-slate-700 ${wrap}`}
              >
                {profile.notes || "-"}
              </p>
            </ProfileSection>
          </div>

          {/* Side column */}
          <aside className="min-w-0 space-y-3 sm:space-y-4">
            <ProfileSection title={t("skills")} icon={<Sparkles />}>
              {profile.skills?.length ? (
                <ul className="flex flex-wrap gap-1.5">
                  {profile.skills.map((skill, index) => (
                    <li
                      key={`${skill}-${index}`}
                      className={`rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800 ring-1 ring-inset ring-emerald-100 ${wrap}`}
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[13px] font-medium">-</p>
              )}
            </ProfileSection>

            <ProfileSection title={t("jobPreferences")} icon={<Briefcase />}>
              <FieldGrid single>
                <ViewField
                  label={t("desiredJob")}
                  value={profile.desired_job}
                />
                <ViewField
                  label={t("desiredLocation")}
                  value={profile.desired_location}
                />
                <ViewField
                  label={t("availableFrom")}
                  value={formatDate(profile.available_from)}
                />
              </FieldGrid>
            </ProfileSection>

            <ProfileSection title={t("visaInformation")} icon={<Globe />}>
              <FieldGrid single>
                <ViewField label={t("visaType")} value={profile.visa_type} />
                <ViewField
                  label={t("visaExpiryDate")}
                  value={formatDate(profile.visa_expiry_date)}
                />
              </FieldGrid>
            </ProfileSection>

            <ProfileSection title={t("resume")} icon={<FileText />}>
              <div className="space-y-2.5">
                <div className={rowCard}>
                  <p className="min-w-0 text-[13px] font-medium">
                    {t("uploadedResume")}
                  </p>

                  {profile.resume_file ? (
                    <a
                      href={getFileUrl(profile.resume_file)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${btnSecondary} shrink-0`}
                    >
                      <FileText className="h-4 w-4" />
                      {t("view")}
                    </a>
                  ) : (
                    <span className="text-[13px] font-medium">-</span>
                  )}
                </div>

                <div className={rowCard}>
                  <p className="min-w-0 text-[13px] font-medium">
                    {t("autoGeneratedResume")}
                  </p>

                  {profile.generated_resume_file ? (
                    <button
                      type="button"
                      onClick={() => void viewGeneratedResume()}
                      className={`${btnSecondary} shrink-0`}
                    >
                      <FileText className="h-4 w-4" />
                      {t("view")}
                    </button>
                  ) : (
                    <span className="text-[13px] font-medium">-</span>
                  )}
                </div>
              </div>
            </ProfileSection>

            <ProfileSection
              title={t("additionalDocuments")}
              icon={<Upload />}
            >
              {profile.other_documents?.length ? (
                <div className="space-y-2.5">
                  {profile.other_documents.map((document) => (
                    <div
                      key={document._id || document.file_url}
                      className={rowCard}
                    >
                      <div className="min-w-0">
                        <p className={`text-[13px] font-semibold ${wrap}`}>
                          {document.name}
                        </p>
                        <p className={`mt-0.5 text-xs text-slate-500 ${wrap}`}>
                          {document.document_type || "other"}
                          {" - "}
                          {getDisplayFileName(document.file_url, t("document"))}
                        </p>
                      </div>

                      <a
                        href={getFileUrl(document.file_url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${btnSecondary} shrink-0`}
                      >
                        <FileText className="h-4 w-4" />
                        {t("view")}
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyText label={t("noAdditionalDocuments")} />
              )}
            </ProfileSection>
          </aside>
        </div>
      </main>
    </div>
  );
}

/* ---------- Building blocks ---------- */

function FactCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-lg border border-slate-200 bg-white px-3.5 py-3 shadow-sm">
      <span
        aria-hidden
        className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-emerald-50 text-emerald-700 [&>svg]:h-4 [&>svg]:w-4"
      >
        {icon}
      </span>

      <div className="min-w-0">
        <p className={labelCaps}>{label}</p>
        <p
          className="mt-0.5 truncate text-sm font-semibold"
          title={value || undefined}
        >
          {value || "-"}
        </p>
      </div>
    </div>
  );
}

function ProfileSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className={sectionCard}>
      <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-3">
        <span
          aria-hidden
          className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-emerald-50 text-emerald-700 [&>svg]:h-4 [&>svg]:w-4"
        >
          {icon}
        </span>

        <h2 className="text-base font-semibold">{title}</h2>
      </div>

      {children}
    </section>
  );
}

function FieldGrid({
  children,
  single = false,
}: {
  children: ReactNode;
  single?: boolean;
}) {
  return (
    <dl
      className={`grid gap-x-4 gap-y-3.5 ${single ? "" : "sm:grid-cols-2"}`}
    >
      {children}
    </dl>
  );
}

function ViewField({
  label,
  value,
  icon,
  className = "",
}: {
  label: string;
  value?: string | null;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`min-w-0 ${className}`}>
      <dt className="flex items-center gap-1 text-slate-500 [&>span>svg]:h-3 [&>span>svg]:w-3">
        <span className={`${labelCaps} inline-flex items-center gap-1`}>
          {label}
          {icon && <span aria-hidden>{icon}</span>}
        </span>
      </dt>

      <dd className={`mt-0.5 text-[13px] font-medium ${wrap}`}>
        {value || "-"}
      </dd>
    </div>
  );
}

function Timeline({ children }: { children: ReactNode }) {
  return (
    <ol className="relative ml-1.5 space-y-5 border-l border-emerald-200 pl-5">
      {children}
    </ol>
  );
}

function TimelineItem({
  title,
  subtitle,
  period,
}: {
  title: string;
  subtitle: string;
  period: string;
}) {
  return (
    <li className="relative">
      <span
        aria-hidden
        className="absolute -left-[1.6rem] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-600 ring-2 ring-emerald-100"
      />

      <h3 className={`text-[15px] font-semibold leading-snug ${wrap}`}>
        {title}
      </h3>

      <p className={`mt-0.5 text-[13px] text-slate-600 ${wrap}`}>{subtitle}</p>

      <p className="mt-1.5 inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium tabular-nums text-slate-600">
        {period}
      </p>
    </li>
  );
}

function EmptyText({ label }: { label: string }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center">
      <p className="text-[13px] leading-5 text-slate-600">{label}</p>
    </div>
  );
}