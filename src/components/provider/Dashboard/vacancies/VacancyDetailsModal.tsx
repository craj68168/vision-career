"use client";

import { useEffect } from "react";
import type { ReactElement, ReactNode } from "react";

import dayjs from "dayjs";
import {
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CircleCheck,
  Clock,
  GraduationCap,
  JapaneseYen,
  Languages,
  Mail,
  MapPin,
  Pencil,
  User,
  Users,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";

import type { Vacancy } from "./types";

type Props = {
  vacancy: Vacancy | null;
  open: boolean;
  onClose: () => void;
  onEdit: (vacancy: Vacancy) => void;
  lang: string;
};

// Shared tokens: keep in sync with vacancies.tsx / provider-dashboard.tsx
const PANEL = "rounded-[14px] bg-white/70 ring-1 ring-black/5";

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-800/50 focus-visible:ring-offset-1";

const BTN = `inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-[12px] text-sm font-medium transition-colors ${FOCUS}`;

const railFor = (status: string) => {
  if (status === "published" || status === "approved") return "bg-emerald-600";
  if (status === "pending_review") return "bg-amber-600";
  if (status === "rejected") return "bg-red-700";
  return "bg-slate-400";
};

const labelToneFor = (status: string) => {
  if (status === "published" || status === "approved") return "text-emerald-700";
  if (status === "pending_review") return "text-amber-700";
  if (status === "rejected") return "text-red-700";
  return "text-slate-500";
};

export default function VacancyDetailsModal({
  vacancy,
  open,
  onClose,
  onEdit,
  lang,
}: Props) {
  const t = useTranslations("provider.vacancies.details");

  // Close on Escape while open
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open || !vacancy) {
    return null;
  }

  const status = String(vacancy.status ?? "").toLowerCase();

  const postedDate =
    vacancy.createdAt && dayjs(vacancy.createdAt).isValid()
      ? dayjs(vacancy.createdAt).format(
          lang === "ja" ? "YYYY/MM/DD" : "MMM D, YYYY",
        )
      : "-";

  const deadline =
    vacancy.applicationDeadline && dayjs(vacancy.applicationDeadline).isValid()
      ? dayjs(vacancy.applicationDeadline).format("YYYY-MM-DD")
      : "-";

  const salary = formatSalaryRange(vacancy.salaryMin, vacancy.salaryMax, lang);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/50 p-0 sm:p-6">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
        aria-label={t("close")}
        tabIndex={-1}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="vacancy-details-title"
        className="relative z-10 max-h-dvh w-full max-w-6xl overflow-y-auto bg-[#f4f5f8] text-[#1b1c21] shadow-2xl sm:max-h-[95vh] sm:rounded-[14px]"
      >
        {/* Header */}
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-black/[0.06] bg-white/85 px-5 py-3.5 backdrop-blur-md sm:px-6">
          <div className="min-w-0">
            <p className="text-xs text-slate-500">{t("title")}</p>
            <h2
              id="vacancy-details-title"
              className="truncate text-lg font-semibold leading-tight"
            >
              {vacancy.title}
            </h2>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => onEdit(vacancy)}
              className={`${BTN} bg-teal-800 px-3.5 text-white ring-1 ring-teal-800 hover:bg-teal-700`}
            >
              <Pencil className="h-4 w-4 shrink-0" aria-hidden="true" />
              {t("edit")}
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label={t("close")}
              className={`${BTN} w-9 bg-white/80 text-slate-600 ring-1 ring-black/10 hover:bg-white hover:text-slate-900`}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </header>

        <div className="space-y-8 p-5 sm:p-8">
          {/* Summary */}
          <section
            className={`relative overflow-hidden p-5 pl-6 sm:p-6 sm:pl-7 ${PANEL}`}
          >
            <span
              aria-hidden="true"
              className={`absolute inset-y-0 left-0 w-1.5 ${railFor(status)}`}
            />

            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <StatusLabel value={status} />
                  <span className="font-mono text-xs tabular-nums text-slate-500">
                    {vacancy.vacancyId}
                  </span>
                </div>

                <p className="text-sm font-medium text-slate-700">
                  {vacancy.companyName}
                </p>

                <h3 className="mt-1 break-words text-2xl font-semibold leading-tight md:text-3xl">
                  {vacancy.title}
                </h3>

                {vacancy.titleKana && (
                  <p className="mt-0.5 break-words text-sm text-slate-500">
                    {vacancy.titleKana}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  <Chip icon={<CircleCheck />} text={vacancy.employmentType} />
                  <Chip icon={<MapPin />} text={vacancy.workLocation} />
                </div>
              </div>

              <dl className="grid shrink-0 grid-cols-2 gap-x-8 gap-y-3 md:text-right">
                <div>
                  <dt className="text-xs text-slate-500">{t("fields.salary")}</dt>
                  <dd className="mt-0.5 font-mono text-base font-medium tabular-nums">
                    {salary}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs text-slate-500">{t("posted")}</dt>
                  <dd className="mt-0.5 font-mono text-base font-medium tabular-nums">
                    {postedDate}
                  </dd>
                </div>
              </dl>
            </div>
          </section>

          <DetailSection title={t("sections.overview")}>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              <DetailCard
                icon={<Building2 />}
                label={t("fields.companyName")}
                value={vacancy.companyName}
              />
              <DetailCard
                icon={<Building2 />}
                label={t("fields.companyNameKana")}
                value={vacancy.companyNameKana}
              />
              <DetailCard
                icon={<BriefcaseBusiness />}
                label={t("fields.jobTitle")}
                value={vacancy.title}
              />
              <DetailCard
                icon={<BriefcaseBusiness />}
                label={t("fields.jobTitleKana")}
                value={vacancy.titleKana}
              />
              <DetailCard
                icon={<CircleCheck />}
                label={t("fields.employmentType")}
                value={vacancy.employmentType}
              />
              <DetailCard
                icon={<Users />}
                label={t("fields.numberOfPeople")}
                value={String(vacancy.numberOfPeople)}
                mono
              />
              <DetailCard
                icon={<Languages />}
                label={t("fields.japaneseLevel")}
                value={vacancy.japaneseLevel}
              />
              <DetailCard
                icon={<MapPin />}
                label={t("fields.workLocation")}
                value={vacancy.workLocation}
              />
              <DetailCard
                icon={<MapPin />}
                label={t("fields.detailedLocation")}
                value={vacancy.workLocationDetail}
              />
              <DetailCard
                icon={<CircleCheck />}
                label={t("fields.remoteWork")}
                value={vacancy.remoteWork}
              />
              <DetailCard
                icon={<JapaneseYen />}
                label={t("fields.salary")}
                value={salary}
                mono
              />
              <DetailCard
                icon={<JapaneseYen />}
                label={t("fields.salaryNotes")}
                value={vacancy.salaryNote}
              />
            </div>
          </DetailSection>

          <DetailSection title={t("sections.jobDescription")}>
            <LongText
              label={t("fields.description")}
              value={vacancy.jobDescription}
            />
            <LongText
              label={t("fields.detailedResponsibilities")}
              value={vacancy.responsibilities}
            />
          </DetailSection>

          <DetailSection title={t("sections.requirements")}>
            <LongText
              label={t("fields.requiredSkills")}
              value={vacancy.requiredSkills}
            />
            <LongText
              label={t("fields.preferredSkills")}
              value={vacancy.preferredSkills}
            />

            <div className="grid gap-3 md:grid-cols-2">
              <DetailCard
                icon={<GraduationCap />}
                label={t("fields.education")}
                value={vacancy.requiredEducation}
              />
              <DetailCard
                icon={<Clock />}
                label={t("fields.experience")}
                value={vacancy.requiredExperience}
              />
            </div>
          </DetailSection>

          <DetailSection title={t("sections.workConditions")}>
            <div className="grid gap-3 md:grid-cols-2">
              <DetailCard
                icon={<Clock />}
                label={t("fields.workingHours")}
                value={vacancy.workHours}
              />
              <DetailCard
                icon={<Clock />}
                label={t("fields.breakTime")}
                value={vacancy.breakTime}
              />
              <DetailCard
                icon={<Clock />}
                label={t("fields.overtime")}
                value={vacancy.overtime}
              />
              <DetailCard
                icon={<CalendarDays />}
                label={t("fields.holidays")}
                value={vacancy.holidays}
              />
              <DetailCard
                icon={<Clock />}
                label={t("fields.trialPeriod")}
                value={vacancy.trialPeriod}
              />
            </div>
          </DetailSection>

          <DetailSection title={t("sections.benefitsInsurance")}>
            <TagSection label={t("fields.benefits")} values={vacancy.benefits} />
            <TagSection
              label={t("fields.socialInsurance")}
              values={vacancy.insurance}
            />
          </DetailSection>

          <DetailSection title={t("sections.applicationInformation")}>
            <div className="grid gap-3 md:grid-cols-2">
              <DetailCard
                icon={<CalendarDays />}
                label={t("fields.applicationDeadline")}
                value={deadline}
                mono
              />
              <DetailCard
                icon={<CalendarDays />}
                label={t("fields.startDate")}
                value={vacancy.startDate}
              />
            </div>

            <LongText
              label={t("fields.selectionProcess")}
              value={vacancy.selectionProcess}
            />
          </DetailSection>

          <DetailSection title={t("sections.contactPerson")}>
            <div className="grid gap-3 md:grid-cols-3">
              <DetailCard
                icon={<User />}
                label={t("fields.contactPerson")}
                value={vacancy.contactPerson}
              />
              <DetailCard
                icon={<User />}
                label={t("fields.contactPersonKana")}
                value={vacancy.contactPersonKana}
              />
              <DetailCard
                icon={<Mail />}
                label={t("fields.contactEmail")}
                value={vacancy.contactEmail}
              />
            </div>
          </DetailSection>
        </div>
      </div>
    </div>
  );
}

function formatNumber(value: number, lang: string) {
  return new Intl.NumberFormat(lang === "ja" ? "ja-JP" : "en-US").format(value);
}

/** "¥min - ¥max", or a single value when only one side is set. */
function formatSalaryRange(
  min: number | null | undefined,
  max: number | null | undefined,
  lang = "en",
) {
  const hasMin = min !== null && min !== undefined;
  const hasMax = max !== null && max !== undefined;

  if (hasMin && hasMax) {
    return min === max
      ? `¥${formatNumber(min, lang)}`
      : `¥${formatNumber(min, lang)} ~ ¥${formatNumber(max, lang)}`;
  }
  if (hasMin) return `¥${formatNumber(min, lang)} ~`;
  if (hasMax) return `~ ¥${formatNumber(max as number, lang)}`;
  return "-";
}

function StatusLabel({ value }: { value: string }) {
  const t = useTranslations("provider.vacancies.list.statuses");
  const key = value === "pending_review" ? "pendingReview" : value;

  return (
    <span
      className={`text-xs font-medium uppercase tracking-[0.15em] ${labelToneFor(value)}`}
    >
      {t(key)}
    </span>
  );
}

function Chip({ icon, text }: { icon: ReactElement; text?: string | null }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-800/5 px-3 py-1 text-sm text-teal-900 ring-1 ring-teal-800/10">
      <span aria-hidden="true" className="text-teal-800/70 [&>svg]:h-3.5 [&>svg]:w-3.5">
        {icon}
      </span>
      {text || "-"}
    </span>
  );
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h3 className="mb-3 text-base font-semibold">{title}</h3>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function DetailCard({
  icon,
  label,
  value,
  mono = false,
}: {
  icon: ReactElement;
  label: string;
  value?: string | null;
  mono?: boolean;
}) {
  return (
    <div className={`${PANEL} p-4`}>
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span aria-hidden="true" className="[&>svg]:h-4 [&>svg]:w-4">
          {icon}
        </span>
        {label}
      </div>

      <p
        className={`mt-1.5 break-words text-sm font-medium ${
          mono ? "font-mono tabular-nums" : ""
        }`}
      >
        {value || "-"}
      </p>
    </div>
  );
}

function LongText({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className={`${PANEL} p-4 sm:p-5`}>
      <p className="text-xs text-slate-500">{label}</p>

      <p className="mt-2 max-w-[75ch] whitespace-pre-wrap break-words text-sm leading-7 text-slate-700">
        {value || "-"}
      </p>
    </div>
  );
}

function TagSection({ label, values }: { label: string; values?: string[] }) {
  return (
    <div className={`${PANEL} p-4 sm:p-5`}>
      <p className="mb-3 text-xs text-slate-500">{label}</p>

      {values?.length ? (
        <ul className="flex flex-wrap gap-2">
          {values.map((item) => (
            <li
              key={item}
              className="rounded-full bg-teal-800/5 px-3 py-1 text-sm text-teal-900 ring-1 ring-teal-800/10"
            >
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-500">-</p>
      )}
    </div>
  );
}