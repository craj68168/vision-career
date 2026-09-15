"use client";

import {
  ArrowLeft,
  Briefcase,
  Building2,
  CheckCircle2,
  Edit2,
  FileText,
  GraduationCap,
  Loader2,
  MapPin,
  Phone,
  User,
} from "lucide-react";

import { useJobSeekerProfileView } from "./hook";

export default function JobSeekerProfileView() {
  const {
    lang,
    profile,
    education,
    employmentHistory,
    isComplete,
    completionPercentage,
    loading,
    formatDate,
    editProfile,
    backToDashboard,
  } = useJobSeekerProfileView();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <User className="h-5 w-5" />
                {lang === "ja" ? "求職者プロフィール" : "Job Seeker Profile"}
              </div>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">
                {profile.name}
              </h1>
              <p className="mt-1 text-sm text-slate-500">{profile.email}</p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={backToDashboard}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700"
              >
                <ArrowLeft className="h-4 w-4" />
                {lang === "ja" ? "戻る" : "Dashboard"}
              </button>
              <button
                type="button"
                onClick={editProfile}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white"
              >
                <Edit2 className="h-4 w-4" />
                {lang === "ja" ? "編集する" : "Edit Profile"}
              </button>
            </div>
          </div>
        </section>

        {/* Completion */}
        <section
          className={`mb-8 rounded-2xl border p-4 ${
            isComplete
              ? "border-green-200 bg-green-50"
              : "border-amber-200 bg-amber-50"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5" />
              <div>
                <p className="font-semibold">
                  {isComplete
                    ? lang === "ja"
                      ? "プロフィール完了"
                      : "Profile Complete"
                    : lang === "ja"
                      ? "プロフィール未完了"
                      : "Profile Incomplete"}
                </p>
                <p className="text-sm">{completionPercentage}%</p>
              </div>
            </div>
            {!isComplete && (
              <button
                type="button"
                onClick={editProfile}
                className="rounded-xl bg-amber-600 px-4 py-2 text-sm font-medium text-white"
              >
                {lang === "ja" ? "プロフィールを完成する" : "Complete Profile"}
              </button>
            )}
          </div>
        </section>

        <div className="space-y-8">
          {/* Basic Information */}
          <ProfileSection
            title={lang === "ja" ? "基本情報" : "Basic Information"}
            icon={<User className="h-5 w-5" />}
          >
            <div className="grid gap-6 md:grid-cols-2">
              <ViewField
                label="Phone"
                value={profile.phone}
                icon={<Phone className="h-4 w-4" />}
              />

              <ViewField
                label="Address"
                value={profile.address}
                icon={<MapPin className="h-4 w-4" />}
              />

              <ViewField
                label="Date of Birth"
                value={formatDate(profile.date_of_birth)}
              />

              <ViewField label="Gender" value={profile.gender} />

              <ViewField label="Nationality" value={profile.nationality} />

              <ViewField
                label="Japanese Level"
                value={profile.japanese_level}
              />
            </div>
          </ProfileSection>

          {/* Visa */}
          <ProfileSection
            title={lang === "ja" ? "ビザ情報" : "Visa Information"}
            icon={<FileText className="h-5 w-5" />}
          >
            <div className="grid gap-6 md:grid-cols-2">
              <ViewField label="Visa Type" value={profile.visa_type} />

              <ViewField
                label="Visa Expiry Date"
                value={formatDate(profile.visa_expiry_date)}
              />
            </div>
          </ProfileSection>

          {/* Preferences */}
          <ProfileSection
            title={lang === "ja" ? "就職希望" : "Job Preferences"}
            icon={<Briefcase className="h-5 w-5" />}
          >
            <div className="grid gap-6 md:grid-cols-2">
              <ViewField label="Desired Job" value={profile.desired_job} />

              <ViewField
                label="Desired Location"
                value={profile.desired_location}
              />

              <ViewField
                label="Available From"
                value={formatDate(profile.available_from)}
              />
            </div>
          </ProfileSection>

          {/* Education */}
          <ProfileSection
            title={lang === "ja" ? "学歴" : "Education"}
            icon={<GraduationCap className="h-5 w-5" />}
          >
            {education.length === 0 ? (
              <EmptyText />
            ) : (
              <div className="space-y-4">
                {education.map((record, index) => (
                  <div
                    key={record._id ?? index}
                    className="rounded-2xl bg-slate-50 p-5"
                  >
                    <h3 className="font-semibold text-slate-900">
                      {record.school}
                    </h3>

                    <p className="mt-1 text-sm text-slate-600">
                      {record.school_type || "-"}
                      {" • "}
                      {record.major || "-"}
                    </p>

                    <p className="mt-2 text-xs text-slate-500">
                      {formatDate(record.enrollment_date)}
                      {" → "}
                      {formatDate(record.graduation_date)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </ProfileSection>

          {/* Employment */}
          <ProfileSection
            title={lang === "ja" ? "職歴" : "Employment History"}
            icon={<Building2 className="h-5 w-5" />}
          >
            {employmentHistory.length === 0 ? (
              <EmptyText />
            ) : (
              <div className="space-y-4">
                {employmentHistory.map((record, index) => (
                  <div
                    key={record._id ?? index}
                    className="rounded-2xl bg-slate-50 p-5"
                  >
                    <h3 className="font-semibold">{record.company_name}</h3>

                    <p className="mt-1 text-sm text-slate-600">
                      {record.employment_type || "-"}
                    </p>

                    <p className="mt-2 text-xs text-slate-500">
                      {formatDate(record.start_date)}
                      {" → "}
                      {formatDate(record.end_date)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </ProfileSection>

          {/* Notes */}
          <ProfileSection
            title={lang === "ja" ? "備考" : "Additional Notes"}
            icon={<FileText className="h-5 w-5" />}
          >
            <p className="whitespace-pre-wrap text-sm text-slate-700">
              {profile.notes || "-"}
            </p>
          </ProfileSection>
        </div>
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
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-slate-100 p-2">{icon}</div>

        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
      </div>

      {children}
    </section>
  );
}

function ViewField({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string | null;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
        {icon}

        {label}
      </div>

      <p className="mt-2 text-sm font-medium text-slate-900">{value || "-"}</p>
    </div>
  );
}

function EmptyText() {
  return <p className="text-sm text-slate-500">No information added.</p>;
}
