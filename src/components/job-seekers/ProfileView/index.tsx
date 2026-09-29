"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import {
  AlertCircle,
  ArrowLeft,
  Briefcase,
  Building2,
  Edit2,
  FileText,
  GraduationCap,
  Loader2,
  MapPin,
  Phone,
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
const recordCard = "rounded-md border border-slate-200 bg-slate-50 p-3.5";
const labelCaps =
  "text-[10px] font-medium uppercase tracking-wider text-slate-500";
const wrap = "[overflow-wrap:anywhere]";

export default function JobSeekerProfileView() {
  const t = useTranslations("jobSeeker.profile");
  const {
    profile,
    education,
    employmentHistory,
    isComplete,
    completionPercentage,
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

  return (
    <div className={`min-h-dvh ${pageBg}`}>
      <header className="border-b border-slate-200 bg-white">
        <div
          className={`${container} flex flex-col gap-4 py-5 lg:flex-row lg:items-center lg:justify-between`}
        >
          <div className="min-w-0">
            <p className="text-xs font-medium text-emerald-700">
              {t("pageLabel")}
            </p>

            <h1
              className={`mt-1 text-balance text-xl font-semibold tracking-tight sm:text-2xl lg:text-[1.75rem] ${wrap}`}
            >
              {profile.name}
            </h1>

            <p className={`mt-1 text-sm leading-6 text-slate-600 ${wrap}`}>
              {profile.email}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap lg:shrink-0">
            <button
              type="button"
              onClick={backToDashboard}
              className={btnSecondary}
            >
              <ArrowLeft className="h-4 w-4" />
              {t("dashboard")}
            </button>

            <button type="button" onClick={editProfile} className={btnPrimary}>
              <Edit2 className="h-4 w-4" />
              {t("editProfile")}
            </button>
          </div>
        </div>
      </header>

      <main className={`${container} py-5 sm:py-6`}>
        {!isComplete && (
          <section className="mb-4 flex flex-col gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <span
                aria-hidden
                className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-amber-500 text-white"
              >
                <AlertCircle className="h-4 w-4" />
              </span>

              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-amber-950">
                  {t("profileIncomplete")}
                </h2>

                <p className="mt-0.5 text-[13px] tabular-nums leading-5 text-amber-900/80">
                  {completionPercentage}%
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={editProfile}
              className={`${btnWarning} w-full shrink-0 sm:w-auto`}
            >
              {t("completeProfile")}
            </button>
          </section>
        )}

        <div className="space-y-3 sm:space-y-4">
          <ProfileSection title={t("basicInformation")} icon={<User />}>
            <FieldGrid>
              <ViewField
                label={t("phone")}
                value={profile.phone}
                icon={<Phone />}
              />
              <ViewField label={t("placementStatus")} value={placementStatus} />
              <ViewField
                label={t("address")}
                value={profile.address}
                icon={<MapPin />}
              />
              <ViewField
                label={t("dateOfBirth")}
                value={formatDate(profile.date_of_birth)}
              />
              <ViewField label={t("gender")} value={profile.gender} />
              <ViewField label={t("nationality")} value={profile.nationality} />
              <ViewField
                label={t("japaneseLevel")}
                value={profile.japanese_level}
              />
              <ViewField
                label={t("skills")}
                value={profile.skills?.length ? profile.skills.join(", ") : "-"}
                className="sm:col-span-2"
              />
            </FieldGrid>
          </ProfileSection>

          <ProfileSection title={t("visaInformation")} icon={<FileText />}>
            <FieldGrid>
              <ViewField label={t("visaType")} value={profile.visa_type} />
              <ViewField
                label={t("visaExpiryDate")}
                value={formatDate(profile.visa_expiry_date)}
              />
            </FieldGrid>
          </ProfileSection>

          <ProfileSection title={t("jobPreferences")} icon={<Briefcase />}>
            <FieldGrid>
              <ViewField label={t("desiredJob")} value={profile.desired_job} />
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

          <ProfileSection title={t("resume")} icon={<FileText />}>
            <FieldGrid>
              <ViewField
                label={t("uploadedResume")}
                value={profile.resume_file ? t("available") : "-"}
              />

              <div className="min-w-0">
                <dt className={labelCaps}>{t("autoGeneratedResume")}</dt>

                <dd className="mt-1">
                  {profile.generated_resume_file ? (
                    <button
                      type="button"
                      onClick={() => void viewGeneratedResume()}
                      className={btnSecondary}
                    >
                      <FileText className="h-4 w-4" />
                      {t("view")}
                    </button>
                  ) : (
                    <span className="text-[13px] font-medium">-</span>
                  )}
                </dd>
              </div>
            </FieldGrid>
          </ProfileSection>

          <ProfileSection title={t("education")} icon={<GraduationCap />}>
            {education.length === 0 ? (
              <EmptyText label={t("noInformation")} />
            ) : (
              <div className="space-y-3">
                {education.map((record, index) => (
                  <div key={record._id ?? index} className={recordCard}>
                    <h3
                      className={`text-[15px] font-semibold leading-snug ${wrap}`}
                    >
                      {record.school}
                    </h3>

                    <p className={`mt-0.5 text-[13px] text-slate-600 ${wrap}`}>
                      {record.school_type || "-"}
                      {" / "}
                      {record.major || "-"}
                    </p>

                    <p className="mt-2 text-xs text-slate-500">
                      {formatDate(record.enrollment_date)}
                      {" -> "}
                      {formatDate(record.graduation_date)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </ProfileSection>

          <ProfileSection title={t("employmentHistory")} icon={<Building2 />}>
            {employmentHistory.length === 0 ? (
              <EmptyText label={t("noInformation")} />
            ) : (
              <div className="space-y-3">
                {employmentHistory.map((record, index) => (
                  <div key={record._id ?? index} className={recordCard}>
                    <h3
                      className={`text-[15px] font-semibold leading-snug ${wrap}`}
                    >
                      {record.company_name}
                    </h3>

                    <p className="mt-0.5 text-[13px] text-slate-600">
                      {record.employment_type || "-"}
                    </p>

                    <p className="mt-2 text-xs text-slate-500">
                      {formatDate(record.start_date)}
                      {" -> "}
                      {formatDate(record.end_date)}
                    </p>
                  </div>
                ))}
              </div>
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
      </main>
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
      <div className="mb-4 flex items-center gap-3">
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

function FieldGrid({ children }: { children: ReactNode }) {
  return (
    <dl className="grid gap-x-3 gap-y-3 sm:grid-cols-2 sm:gap-x-4">
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

function EmptyText({ label }: { label: string }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center">
      <p className="text-[13px] leading-5 text-slate-600">{label}</p>
    </div>
  );
}