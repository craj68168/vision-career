"use client";

import {
  AlertCircle,
  ArrowLeft,
  Briefcase,
  Building2,
  CheckCircle2,
  Edit2,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  User,
  X,
} from "lucide-react";

import { useRouter } from "next/navigation";

import { useProviderProfile } from "./hook";

const INDUSTRIES = {
  ja: [
    "IT・情報通信",
    "製造業",
    "小売・卸売",
    "サービス業",
    "金融・保険",
    "建設・不動産",
    "医療・福祉",
    "教育",
    "運輸・物流",
    "ホスピタリティ・観光",
    "その他",
  ],

  en: [
    "IT & Telecommunications",
    "Manufacturing",
    "Retail & Wholesale",
    "Services",
    "Finance & Insurance",
    "Construction & Real Estate",
    "Healthcare & Welfare",
    "Education",
    "Transportation & Logistics",
    "Hospitality & Tourism",
    "Other",
  ],
};

export default function ProviderProfile() {
  const router = useRouter();

  const {
    lang,

    profile,
    profileStatus,

    formData,

    loading,
    saving,

    isEditing,
    setIsEditing,

    handleInputChange,
    handleBlur,

    saveProfile,
    cancelEdit,

    getFieldError,
    isFieldMissing,
  } = useProviderProfile();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-slate-400" />

          <p className="mt-4 text-sm text-slate-600">
            {lang === "ja"
              ? "会社情報を読み込み中..."
              : "Loading company profile..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* HEADER */}

        <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <Building2 className="h-5 w-5" />

                {lang === "ja" ? "会社プロフィール" : "Company Profile"}
              </div>

              <h1 className="mt-2 text-3xl font-bold text-slate-900">
                {profile?.companyName ||
                  (lang === "ja" ? "会社情報" : "Company Information")}
              </h1>

              <p className="mt-2 text-sm text-slate-600">
                {lang === "ja"
                  ? "会社情報と採用担当者情報を管理します。"
                  : "Manage your company and recruitment contact information."}
              </p>
            </div>

            {!isEditing ? (
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      lang === "ja"
                        ? "/provider-dashboard"
                        : "/en/provider-dashboard",
                    )
                  }
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-medium"
                >
                  <ArrowLeft className="h-4 w-4" />

                  {lang === "ja" ? "ダッシュボード" : "Dashboard"}
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white"
                >
                  <Edit2 className="h-4 w-4" />

                  {lang === "ja" ? "編集" : "Edit Profile"}
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={cancelEdit}
                  disabled={saving}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-medium"
                >
                  <X className="h-4 w-4" />

                  {lang === "ja" ? "キャンセル" : "Cancel"}
                </button>

                <button
                  type="button"
                  onClick={() => void saveProfile()}
                  disabled={saving}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}

                  {saving
                    ? lang === "ja"
                      ? "保存中..."
                      : "Saving..."
                    : lang === "ja"
                      ? "保存"
                      : "Save Changes"}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* COMPLETION */}

        {!profileStatus.isComplete ? (
          <section className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600" />

              <div>
                <p className="font-semibold text-amber-800">
                  {lang === "ja"
                    ? "会社プロフィール未完了"
                    : "Company profile incomplete"}
                </p>

                <p className="mt-1 text-sm text-amber-700">
                  {profileStatus.completionPercentage}%{" "}
                  {lang === "ja" ? "完了" : "complete"}
                </p>
              </div>
            </div>
          </section>
        ) : (
          <section className="mb-8 rounded-2xl border border-green-200 bg-green-50 p-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />

              <p className="font-semibold text-green-800">
                {lang === "ja"
                  ? "会社プロフィール完了"
                  : "Company profile complete"}
              </p>
            </div>
          </section>
        )}

        <div className="space-y-8">
          {/* BASIC COMPANY */}

          <Section
            title={lang === "ja" ? "会社情報" : "Company Information"}
            icon={<Building2 className="h-5 w-5" />}
          >
            <div className="mb-6 rounded-xl bg-slate-50 p-4">
              <div className="grid gap-6 md:grid-cols-2">
                <ViewField
                  label={lang === "ja" ? "登録担当者" : "Registered User"}
                  value={profile?.name}
                />

                <ViewField label="Email" value={profile?.email} />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <TextField
                label={lang === "ja" ? "会社名" : "Company Name"}
                name="companyName"
                value={formData.companyName}
                isEditing={isEditing}
                required
                icon={<Building2 className="h-4 w-4" />}
                error={getFieldError("companyName")}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />

              <TextField
                label={lang === "ja" ? "電話番号" : "Phone"}
                name="phone"
                value={formData.phone}
                isEditing={isEditing}
                required
                icon={<Phone className="h-4 w-4" />}
                error={getFieldError("phone")}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />

              <TextField
                label={lang === "ja" ? "住所" : "Address"}
                name="address"
                value={formData.address}
                isEditing={isEditing}
                required
                icon={<MapPin className="h-4 w-4" />}
                error={getFieldError("address")}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />

              <TextField
                label={lang === "ja" ? "ウェブサイト" : "Website"}
                name="website"
                value={formData.website}
                isEditing={isEditing}
                icon={<Globe className="h-4 w-4" />}
                error={getFieldError("website")}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  {lang === "ja" ? "業種" : "Industry"}

                  <span className="text-red-500">*</span>
                </label>

                <select
                  name="industry"
                  value={formData.industry}
                  disabled={!isEditing}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm disabled:bg-slate-50"
                >
                  <option value="">
                    {lang === "ja" ? "選択してください" : "Select industry"}
                  </option>

                  {INDUSTRIES[lang as keyof typeof INDUSTRIES].map(
                    (industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ),
                  )}
                </select>
              </div>
            </div>
          </Section>

          {/* CONTACT */}

          <Section
            title={lang === "ja" ? "採用担当者" : "Recruitment Contact"}
            icon={<User className="h-5 w-5" />}
          >
            <div className="grid gap-6 md:grid-cols-2">
              <TextField
                label={lang === "ja" ? "担当者名" : "Contact Person"}
                name="contact_person"
                value={formData.contact_person}
                isEditing={isEditing}
                required
                icon={<User className="h-4 w-4" />}
                error={getFieldError("contact_person")}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />

              <TextField
                label={lang === "ja" ? "担当者電話番号" : "Contact Phone"}
                name="contact_person_phone"
                value={formData.contact_person_phone}
                isEditing={isEditing}
                required
                icon={<Phone className="h-4 w-4" />}
                error={getFieldError("contact_person_phone")}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />

              <TextField
                label={lang === "ja" ? "担当者メール" : "Contact Email"}
                name="contact_person_email"
                value={formData.contact_person_email}
                isEditing={isEditing}
                required
                icon={<Mail className="h-4 w-4" />}
                error={getFieldError("contact_person_email")}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
            </div>
          </Section>

          {/* HIRING */}

          <Section
            title={lang === "ja" ? "採用情報" : "Hiring Information"}
            icon={<Briefcase className="h-5 w-5" />}
          >
            <div className="space-y-6">
              <TextField
                label={lang === "ja" ? "採用ニーズ" : "Hiring Needs"}
                name="hiring_needs"
                value={formData.hiring_needs}
                isEditing={isEditing}
                rows={4}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />

              <TextField
                label={lang === "ja" ? "備考" : "Notes"}
                name="notes"
                value={formData.notes}
                isEditing={isEditing}
                rows={4}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({
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

        <h2 className="text-xl font-semibold">{title}</h2>
      </div>

      {children}
    </section>
  );
}

type TextFieldProps = {
  label: string;

  name: string;

  value: string;

  isEditing: boolean;

  required?: boolean;

  icon?: React.ReactNode;

  error?: string;

  rows?: number;

  onChange: (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;

  onBlur?: (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
};

function TextField({
  label,
  name,
  value,
  isEditing,
  required,
  icon,
  error,
  rows,
  onChange,
  onBlur,
}: TextFieldProps) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
        {icon}

        {label}

        {required && <span className="text-red-500">*</span>}
      </label>

      {rows ? (
        <textarea
          name={name}
          value={value}
          rows={rows}
          disabled={!isEditing}
          onChange={onChange}
          onBlur={onBlur}
          className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none disabled:bg-slate-50"
        />
      ) : (
        <input
          name={name}
          value={value}
          disabled={!isEditing}
          onChange={onChange}
          onBlur={onBlur}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none disabled:bg-slate-50"
        />
      )}

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function ViewField({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-500">{label}</p>

      <p className="mt-1 text-sm text-slate-900">{value || "-"}</p>
    </div>
  );
}
