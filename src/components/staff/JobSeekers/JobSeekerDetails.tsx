"use client";

import {
  AlertTriangle,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  Download,
  FileText,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

import {
  formatDate,
  getAccountClass,
  getApprovalClass,
  getPlacementLabel,
  getScreeningClass,
  getScreeningLabel,
} from "./helper";

import type { StaffSeeker } from "./types";

type Props = {
  seeker: StaffSeeker | null;

  canManage: boolean;

  isDownloading: boolean;

  onClose: () => void;

  onScreen: (seeker: StaffSeeker) => void;

  onDownloadResume: (seeker: StaffSeeker) => void;
};

const text = (value: string | number | null | undefined) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return String(value);
};

export default function JobSeekerDetails({
  seeker,
  canManage,
  isDownloading,
  onClose,
  onScreen,
  onDownloadResume,
}: Props) {
  if (!seeker) {
    return null;
  }

  const canScreen = canManage && seeker.approval_status === "pending";

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/50 p-4">
      <button type="button" className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* HEADER */}

        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
              {seeker.seeker_id}
            </p>

            <h2 className="mt-1 text-2xl font-bold">{seeker.name}</h2>

            <p className="mt-1 text-sm text-slate-500">
              {seeker.desired_job || "Job Seeker"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          <div className="space-y-7">
            {/* CONTACT */}

            <section>
              <h3 className="mb-4 text-lg font-bold">Profile Information</h3>

              <div className="grid gap-3 md:grid-cols-3">
                <Info icon={Mail} label="Email" value={seeker.email} />

                <Info icon={Phone} label="Phone" value={text(seeker.phone)} />

                <Info
                  icon={MapPin}
                  label="Address"
                  value={text(seeker.address)}
                />

                <Info
                  icon={MapPin}
                  label="Current Location"
                  value={text(seeker.current_location)}
                />

                <Info
                  icon={UserRound}
                  label="Nationality"
                  value={text(seeker.nationality)}
                />

                <Info
                  icon={CalendarDays}
                  label="Date of Birth"
                  value={formatDate(seeker.date_of_birth)}
                />

                <Info
                  icon={ShieldCheck}
                  label="Visa Type"
                  value={text(seeker.visa_type)}
                />

                <Info
                  icon={CalendarDays}
                  label="Visa Expiry"
                  value={formatDate(seeker.visa_expiry_date)}
                />

                <Info
                  icon={UserRound}
                  label="Japanese Level"
                  value={text(seeker.japanese_level)}
                />

                <Info
                  icon={Briefcase}
                  label="Desired Job"
                  value={text(seeker.desired_job)}
                />

                <Info
                  icon={MapPin}
                  label="Desired Location"
                  value={text(seeker.desired_location)}
                />

                <Info
                  icon={FileText}
                  label="Applications"
                  value={seeker.applications_count}
                />
              </div>
            </section>

            {/* EDUCATION / EMPLOYMENT */}

            <div className="grid gap-5 lg:grid-cols-2">
              <Section title="Education" icon={GraduationCap}>
                {seeker.education.length === 0 ? (
                  <Empty />
                ) : (
                  seeker.education.map((education, index) => (
                    <div
                      key={education._id || index}
                      className="border-b border-slate-100 py-3 last:border-0"
                    >
                      <p className="font-semibold">{education.school}</p>

                      <p className="text-sm text-slate-500">
                        {text(education.major)}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {formatDate(education.enrollment_date)}
                        {" — "}
                        {formatDate(education.graduation_date)}
                      </p>
                    </div>
                  ))
                )}
              </Section>

              <Section title="Employment History" icon={Briefcase}>
                {seeker.employment_history.length === 0 ? (
                  <Empty />
                ) : (
                  seeker.employment_history.map((employment, index) => (
                    <div
                      key={employment._id || index}
                      className="border-b border-slate-100 py-3 last:border-0"
                    >
                      <p className="font-semibold">{employment.company_name}</p>

                      <p className="text-sm text-slate-500">
                        {text(employment.employment_type)}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {formatDate(employment.start_date)}
                        {" — "}
                        {formatDate(employment.end_date)}
                      </p>
                    </div>
                  ))
                )}
              </Section>
            </div>

            {/* SKILLS */}

            <section className="rounded-2xl border border-slate-200 p-5">
              <h3 className="font-semibold">Skills</h3>

              <div className="mt-3 flex flex-wrap gap-2">
                {seeker.skills.length > 0 ? (
                  seeker.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-700"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <Empty />
                )}
              </div>
            </section>

            {/* STATUSES */}

            <section>
              <h3 className="mb-4 text-lg font-bold">Current Status</h3>

              <div className="grid gap-3 sm:grid-cols-3">
                <Status
                  label="Approval"
                  value={seeker.approval_status}
                  className={getApprovalClass(seeker.approval_status)}
                />

                <Status
                  label="Account"
                  value={seeker.account_status}
                  className={getAccountClass(seeker.account_status)}
                />

                <Status
                  label="Placement"
                  value={getPlacementLabel(seeker.placement_status)}
                  className="border-slate-200 bg-slate-50 text-slate-700"
                />
              </div>
            </section>

            {/* STAFF SCREENING */}

            <section>
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-lg font-bold">Staff Screening</h3>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${getScreeningClass(
                    seeker.staffScreening.status,
                  )}`}
                >
                  {getScreeningLabel(seeker.staffScreening.status)}
                </span>
              </div>

              {seeker.staffScreening.status === "NOT_SCREENED" && (
                <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />

                  <p className="text-sm text-amber-700">
                    This Job Seeker has not been screened by Staff yet.
                  </p>
                </div>
              )}

              {seeker.staffScreening.status === "SCREENED" && (
                <div className="flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />

                  <p className="text-sm text-emerald-700">
                    Staff screening has been completed. The registration is
                    ready for Admin review.
                  </p>
                </div>
              )}

              {seeker.staffScreening.status === "NEEDS_ATTENTION" && (
                <div className="flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-red-600" />

                  <p className="text-sm text-red-700">
                    Staff marked this registration as needing Admin attention.
                  </p>
                </div>
              )}

              {seeker.staffScreening.status !== "NOT_SCREENED" && (
                <>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <Detail
                      label="Screened By"
                      value={seeker.staffScreening.screenedByStaffId}
                    />

                    <Detail
                      label="Screened At"
                      value={formatDate(seeker.staffScreening.screenedAt)}
                    />
                  </div>

                  {seeker.staffScreening.note && (
                    <div className="mt-3 rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase text-slate-500">
                        Screening Note
                      </p>

                      <p className="mt-2 whitespace-pre-wrap text-sm">
                        {seeker.staffScreening.note}
                      </p>
                    </div>
                  )}
                </>
              )}

              <div className="mt-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
                Staff screening is advisory. Final Job Seeker registration
                approval remains with Admin.
              </div>
            </section>
          </div>
        </div>

        {/* FOOTER */}

        <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 px-6 py-4">
          {(seeker.resume_file || seeker.generated_resume_file) && (
            <button
              type="button"
              disabled={isDownloading}
              onClick={() => onDownloadResume(seeker)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold"
            >
              <Download className="h-4 w-4" />

              {isDownloading ? "Downloading..." : "Download Resume"}
            </button>
          )}

          {canScreen && (
            <button
              type="button"
              onClick={() => onScreen(seeker)}
              className="rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white"
            >
              {seeker.staffScreening.status === "NOT_SCREENED"
                ? "Screen Job Seeker"
                : "Edit Screening"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Info({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;

  label: string;

  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 p-4">
      <div className="flex gap-3">
        <Icon className="mt-0.5 h-4 w-4 text-slate-400" />

        <div>
          <p className="text-xs font-semibold uppercase text-slate-400">
            {label}
          </p>

          <p className="mt-1 break-words text-sm font-medium">{value}</p>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;

  icon: typeof Briefcase;

  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 p-5">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-slate-500" />

        <h3 className="font-semibold">{title}</h3>
      </div>

      <div className="mt-3">{children}</div>
    </div>
  );
}

function Status({
  label,
  value,
  className,
}: {
  label: string;

  value: string;

  className: string;
}) {
  return (
    <div className={`rounded-2xl border p-4 ${className}`}>
      <p className="text-xs font-semibold uppercase opacity-70">{label}</p>

      <p className="mt-1 font-semibold capitalize">{value}</p>
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;

  value?: string | null;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>

      <p className="mt-1 text-sm font-semibold">{value || "-"}</p>
    </div>
  );
}

function Empty() {
  return <p className="text-sm text-slate-400">No information available.</p>;
}
