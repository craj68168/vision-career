"use client";

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

import type { Vacancy } from "./types";

type Props = {
  vacancy: Vacancy | null;

  open: boolean;

  onClose: () => void;

  onEdit: (vacancy: Vacancy) => void;

  lang: string;
};

export default function VacancyDetailsModal({
  vacancy,
  open,
  onClose,
  onEdit,
  lang,
}: Props) {
  if (!open || !vacancy) {
    return null;
  }

  const postedDate =
    vacancy.createdAt && dayjs(vacancy.createdAt).isValid()
      ? dayjs(vacancy.createdAt).format("MMM D, YYYY")
      : "-";

  const salary =
    vacancy.salaryMin || vacancy.salaryMax
      ? `¥${formatNumber(vacancy.salaryMin)} - ¥${formatNumber(
          vacancy.salaryMax,
        )}`
      : "-";

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:p-6">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0"
        aria-label="Close"
      />

      <div className="relative z-10 max-h-[95vh] w-full max-w-6xl overflow-y-auto bg-white shadow-2xl sm:rounded-3xl">
        {/* HEADER */}

        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {lang === "ja" ? "求人詳細" : "Vacancy Details"}
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-950">
              {vacancy.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="space-y-8 p-6 sm:p-8">
          {/* HERO */}

          <section className="rounded-3xl bg-slate-950 p-6 text-white sm:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-slate-300">{vacancy.companyName}</p>

                <h1 className="mt-2 text-3xl font-bold">{vacancy.title}</h1>

                <div className="mt-5 flex flex-wrap gap-2">
                  <HeroBadge text={vacancy.employmentType} />

                  <HeroBadge text={vacancy.workLocation} />

                  <HeroBadge text={salary} />

                  <HeroBadge text={vacancy.status.replaceAll("_", " ")} />
                </div>
              </div>

              <div className="rounded-2xl bg-white/10 px-5 py-4">
                <p className="text-sm text-slate-300">Posted</p>

                <p className="mt-1 font-semibold">{postedDate}</p>
              </div>
            </div>
          </section>

          {/* EDIT */}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => onEdit(vacancy)}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
            >
              <Pencil className="h-4 w-4" />

              {lang === "ja" ? "求人を編集" : "Edit This Vacancy"}
            </button>
          </div>

          {/* OVERVIEW */}

          <DetailSection title="Overview">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <DetailCard
                icon={<Building2 />}
                label="Company Name"
                value={vacancy.companyName}
              />

              <DetailCard
                icon={<Building2 />}
                label="Company Name Kana"
                value={vacancy.companyNameKana}
              />

              <DetailCard
                icon={<BriefcaseBusiness />}
                label="Job Title"
                value={vacancy.title}
              />

              <DetailCard
                icon={<BriefcaseBusiness />}
                label="Job Title Kana"
                value={vacancy.titleKana}
              />

              <DetailCard
                icon={<CircleCheck />}
                label="Employment Type"
                value={vacancy.employmentType}
              />

              <DetailCard
                icon={<Users />}
                label="Number of People"
                value={String(vacancy.numberOfPeople)}
              />

              <DetailCard
                icon={<Languages />}
                label="Japanese Level"
                value={vacancy.japaneseLevel}
              />

              <DetailCard
                icon={<MapPin />}
                label="Work Location"
                value={vacancy.workLocation}
              />

              <DetailCard
                icon={<MapPin />}
                label="Detailed Location"
                value={vacancy.workLocationDetail}
              />

              <DetailCard
                icon={<CircleCheck />}
                label="Remote Work"
                value={vacancy.remoteWork}
              />

              <DetailCard
                icon={<JapaneseYen />}
                label="Salary"
                value={salary}
              />

              <DetailCard
                icon={<JapaneseYen />}
                label="Salary Notes"
                value={vacancy.salaryNote}
              />
            </div>
          </DetailSection>

          {/* DESCRIPTION */}

          <DetailSection title="Job Description">
            <LongText label="Description" value={vacancy.jobDescription} />

            <LongText
              label="Detailed Responsibilities"
              value={vacancy.responsibilities}
            />
          </DetailSection>

          {/* REQUIREMENTS */}

          <DetailSection title="Requirements">
            <LongText
              label="Required Skills & Experience"
              value={vacancy.requiredSkills}
            />

            <LongText
              label="Preferred Skills"
              value={vacancy.preferredSkills}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <DetailCard
                icon={<GraduationCap />}
                label="Education"
                value={vacancy.requiredEducation}
              />

              <DetailCard
                icon={<Clock />}
                label="Experience"
                value={vacancy.requiredExperience}
              />
            </div>
          </DetailSection>

          {/* WORK CONDITIONS */}

          <DetailSection title="Work Conditions">
            <div className="grid gap-4 md:grid-cols-2">
              <DetailCard
                icon={<Clock />}
                label="Working Hours"
                value={vacancy.workHours}
              />

              <DetailCard
                icon={<Clock />}
                label="Break Time"
                value={vacancy.breakTime}
              />

              <DetailCard
                icon={<Clock />}
                label="Overtime"
                value={vacancy.overtime}
              />

              <DetailCard
                icon={<CalendarDays />}
                label="Holidays"
                value={vacancy.holidays}
              />

              <DetailCard
                icon={<Clock />}
                label="Trial Period"
                value={vacancy.trialPeriod}
              />
            </div>
          </DetailSection>

          {/* BENEFITS */}

          <DetailSection title="Benefits & Insurance">
            <TagSection label="Benefits" values={vacancy.benefits} />

            <TagSection label="Social Insurance" values={vacancy.insurance} />
          </DetailSection>

          {/* APPLICATION */}

          <DetailSection title="Application Information">
            <div className="grid gap-4 md:grid-cols-2">
              <DetailCard
                icon={<CalendarDays />}
                label="Application Deadline"
                value={
                  vacancy.applicationDeadline
                    ? dayjs(vacancy.applicationDeadline).format("YYYY-MM-DD")
                    : "-"
                }
              />

              <DetailCard
                icon={<CalendarDays />}
                label="Start Date"
                value={vacancy.startDate}
              />
            </div>

            <LongText
              label="Selection Process"
              value={vacancy.selectionProcess}
            />
          </DetailSection>

          {/* PRIVATE CONTACT */}

          <DetailSection title="Contact Person">
            <div className="grid gap-4 md:grid-cols-3">
              <DetailCard
                icon={<User />}
                label="Contact Person"
                value={vacancy.contactPerson}
              />

              <DetailCard
                icon={<User />}
                label="Contact Person Kana"
                value={vacancy.contactPersonKana}
              />

              <DetailCard
                icon={<Mail />}
                label="Contact Email"
                value={vacancy.contactEmail}
              />
            </div>
          </DetailSection>
        </div>
      </div>
    </div>
  );
}

function formatNumber(value?: number | null) {
  if (value === null || value === undefined) {
    return "-";
  }

  return new Intl.NumberFormat("en-US").format(value);
}

function HeroBadge({ text }: { text?: string | null }) {
  return (
    <span className="rounded-full bg-white/10 px-4 py-1.5 text-sm">
      {text || "-"}
    </span>
  );
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="mb-5 text-xl font-semibold text-slate-900">{title}</h3>

      <div className="space-y-4">{children}</div>
    </section>
  );
}

function DetailCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactElement;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
        <span className="[&>svg]:h-4 [&>svg]:w-4">{icon}</span>

        {label}
      </div>

      <p className="mt-2 text-sm font-medium text-slate-800">{value || "-"}</p>
    </div>
  );
}

function LongText({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>

      <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">
        {value || "-"}
      </p>
    </div>
  );
}

function TagSection({ label, values }: { label: string; values?: string[] }) {
  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-slate-700">{label}</p>

      {values?.length ? (
        <div className="flex flex-wrap gap-2">
          {values.map((item) => (
            <span
              key={item}
              className="rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700"
            >
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500">-</p>
      )}
    </div>
  );
}
