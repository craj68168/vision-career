"use client";

import {
  Briefcase,
  CalendarDays,
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

import type { AdminSeeker } from "./types";

type Props = {
  lang: string;

  seeker: AdminSeeker;

  isDownloading: boolean;

  onClose: () => void;

  onDownloadResume: () => void;

  onReview: () => void;
};

const text = (value: string | number | null | undefined) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return String(value);
};

const dateText = (value?: string | null) => {
  if (!value) return "-";

  return new Date(value).toLocaleDateString();
};

export default function ViewModal({
  seeker,
  isDownloading,
  onClose,
  onDownloadResume,
  onReview,
}: Props) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Job Seeker Details
            </p>

            <h2 className="mt-1 text-2xl font-bold">{seeker.name}</h2>

            <p className="text-sm text-slate-500">{seeker.seeker_id}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[82vh] overflow-y-auto p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Info icon={Mail} label="Email" value={seeker.email} />

            <Info icon={Phone} label="Phone" value={text(seeker.phone)} />

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
              value={dateText(seeker.date_of_birth)}
            />

            <Info
              icon={ShieldCheck}
              label="Visa Type"
              value={text(seeker.visa_type)}
            />

            <Info
              icon={CalendarDays}
              label="Visa Expiry"
              value={dateText(seeker.visa_expiry_date)}
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
              icon={CalendarDays}
              label="Available From"
              value={dateText(seeker.available_from)}
            />

            <Info
              icon={FileText}
              label="Applications"
              value={seeker.applications_count}
            />
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
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
                      {dateText(education.enrollment_date)}
                      {" — "}
                      {dateText(education.graduation_date)}
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
                      {dateText(employment.start_date)}
                      {" — "}
                      {dateText(employment.end_date)}
                    </p>
                  </div>
                ))
              )}
            </Section>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 p-5">
            <h3 className="font-semibold">Skills</h3>

            <div className="mt-3 flex flex-wrap gap-2">
              {seeker.skills.length > 0 ? (
                seeker.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-slate-100 px-3 py-1 text-sm"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <Empty />
              )}
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <StatusBox title="Approval" value={seeker.approval_status} />

            <StatusBox title="Account" value={seeker.account_status} />

            <StatusBox title="Placement" value={seeker.placement_status} />
          </div>

          <div className="mt-6 flex flex-wrap justify-end gap-3">
            {seeker.approval_status === "pending" && (
              <button
                type="button"
                onClick={onReview}
                className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white"
              >
                Review Registration
              </button>
            )}

            {(seeker.resume_file || seeker.generated_resume_file) && (
              <button
                type="button"
                disabled={isDownloading}
                onClick={onDownloadResume}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                Download Resume
              </button>
            )}
          </div>
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

          <p className="mt-1 text-sm font-medium text-slate-900">{value}</p>
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

function StatusBox({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase text-slate-400">{title}</p>

      <p className="mt-1 font-semibold capitalize">{value}</p>
    </div>
  );
}

function Empty() {
  return <p className="text-sm text-slate-400">No information available.</p>;
}
