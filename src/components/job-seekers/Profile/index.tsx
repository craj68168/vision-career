"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import {
  User,
  Phone,
  MapPin,
  Calendar,
  Users,
  Globe,
  Clock,
  Briefcase,
  MapPinIcon,
  FileText,
  Upload,
  AlertCircle,
  Edit2,
  Save,
  X,
  Loader2,
  Cake,
  Flag,
  Languages,
  BookLock,
  ArrowLeft,
  CheckCircle2,
  Plus,
  Trash2,
  GraduationCap,
  Building2,
} from "lucide-react";

import { useJobSeekerProfile } from "./hook";

const MISSING_FIELD_LABELS: Record<
  string,
  {
    ja: string;
    en: string;
  }
> = {
  phone: {
    ja: "電話番号",
    en: "Phone Number",
  },
  address: {
    ja: "住所",
    en: "Address",
  },
  nationality: {
    ja: "国籍",
    en: "Nationality",
  },
  visa_type: {
    ja: "ビザ種類",
    en: "Visa Type",
  },
  japanese_level: {
    ja: "日本語レベル",
    en: "Japanese Level",
  },
  desired_job: {
    ja: "希望職種",
    en: "Desired Job",
  },
  desired_location: {
    ja: "希望勤務地",
    en: "Desired Location",
  },
  available_from: {
    ja: "就業可能日",
    en: "Available From",
  },
  resume_file: {
    ja: "履歴書",
    en: "Resume File",
  },
  education: {
    ja: "学歴",
    en: "Educational Background",
  },
  employment_history: {
    ja: "職歴",
    en: "Employment History",
  },
};

const GENDERS = {
  ja: ["男性", "女性", "その他", "回答しない"],
  en: ["Male", "Female", "Other", "Prefer not to say"],
};

const JAPANESE_LEVELS = {
  ja: [
    "ネイティブ",
    "N1 (ビジネスレベル)",
    "N2 (日常会話レベル)",
    "N3 (基本的なコミュニケーション)",
    "N4 (初級)",
    "N5 (入門)",
    "学習中",
  ],

  en: [
    "Native",
    "N1 (Business Level)",
    "N2 (Daily Conversation)",
    "N3 (Basic Communication)",
    "N4 (Elementary)",
    "N5 (Beginner)",
    "Currently Learning",
  ],
};

const VISA_TYPES = {
  ja: [
    "永住者",
    "日本人の配偶者等",
    "永住者の配偶者等",
    "定住者",
    "技術・人文知識・国際業務",
    "特定技能",
    "技能実習",
    "留学",
    "ワーキングホリデー",
    "その他",
    "就労ビザ不要",
  ],

  en: [
    "Permanent Resident",
    "Spouse of Japanese National",
    "Spouse of Permanent Resident",
    "Long-Term Resident",
    "Engineer/Humanities/International Services",
    "Specified Skilled Worker",
    "Technical Intern Training",
    "Student",
    "Working Holiday",
    "Other",
    "No Work Visa Required",
  ],
};

const NATIONALITIES = {
  ja: [
    "日本",
    "中国",
    "韓国",
    "ベトナム",
    "ネパール",
    "インドネシア",
    "フィリピン",
    "タイ",
    "ミャンマー",
    "インド",
    "アメリカ",
    "イギリス",
    "カナダ",
    "オーストラリア",
    "その他",
  ],

  en: [
    "Japan",
    "China",
    "South Korea",
    "Vietnam",
    "Nepal",
    "Indonesia",
    "Philippines",
    "Thailand",
    "Myanmar",
    "India",
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "Other",
  ],
};

const SCHOOL_TYPES = {
  ja: ["高校", "専門学校", "短期大学", "大学", "大学院", "その他"],

  en: [
    "High School",
    "Vocational School",
    "Junior College",
    "University",
    "Graduate School",
    "Other",
  ],
};

const EMPLOYMENT_TYPES = {
  ja: [
    "正社員",
    "契約社員",
    "派遣社員",
    "パート・アルバイト",
    "インターン",
    "その他",
  ],

  en: [
    "Full-time",
    "Contract",
    "Temporary",
    "Part-time",
    "Internship",
    "Other",
  ],
};

type InputFieldProps = {
  label: string;
  name: string;
  value: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  icon?: React.ReactNode;
  rows?: number;
  isEditing: boolean;
  error?: string;

  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;

  onBlur?: (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;

  maxLength?: number;
  autoComplete?: string;
};

function InputField({
  label,
  name,
  value,
  type = "text",
  placeholder,
  required = false,
  icon,
  rows,
  isEditing,
  error,
  onChange,
  onBlur,
  maxLength,
  autoComplete = "off",
}: InputFieldProps) {
  const charCount = rows && typeof value === "string" ? value.length : 0;

  const commonClasses = `w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 ${
    !isEditing
      ? "cursor-not-allowed bg-slate-50 text-slate-500"
      : "hover:border-slate-300"
  } ${
    error
      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
      : "border-slate-200"
  }`;

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
        {icon && <span className="text-slate-400">{icon}</span>}

        {label}

        {required && <span className="text-red-500">*</span>}
      </label>

      {rows ? (
        <>
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={!isEditing}
            rows={rows}
            maxLength={maxLength}
            autoComplete={autoComplete}
            placeholder={placeholder}
            className={`${commonClasses} resize-none`}
          />

          {maxLength && (
            <div className="text-right text-xs text-slate-400">
              {charCount}/{maxLength}
            </div>
          )}
        </>
      ) : (
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={!isEditing}
          maxLength={maxLength}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={commonClasses}
        />
      )}

      {error && (
        <div className="flex items-center gap-1 text-xs text-red-500">
          <AlertCircle className="h-3 w-3" />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}

type SectionHeaderProps = {
  title: string;
  icon: React.ReactNode;
  description?: string;
};

function SectionHeader({ title, icon, description }: SectionHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-slate-100 p-2 text-slate-700">{icon}</div>

        <div>
          <h2 className="text-xl font-semibold text-slate-900">{title}</h2>

          {description && (
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function JobSeekerProfilePage() {
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const profilePhotoInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  const [documentName, setDocumentName] = useState("");
  const [documentType, setDocumentType] = useState("other");
  const [selectedDocumentFile, setSelectedDocumentFile] = useState<File | null>(
    null,
  );

  const {
    lang,

    profile,
    profileStatus,

    education,
    employmentHistory,

    formData,

    loading,
    saving,
    uploadingResume,
    uploadingProfilePhoto,
    uploadingDocument,
    removingDocumentId,
    isEditing,

    setIsEditing,

    handleInputChange,
    handleBlur,

    addEducationRecord,
    removeEducationRecord,
    updateEducationRecord,

    addEmploymentRecord,
    removeEmploymentRecord,
    updateEmploymentRecord,

    saveProfile,
    cancelEdit,

    handleProfilePhotoUpload,
    handleResumeUpload,
    handleDocumentUpload,
    handleRemoveDocument,

    getFieldError,
    isFieldMissing,
  } = useJobSeekerProfile();

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

      const decoded = decodeURIComponent(lastPart);

      return decoded.replace(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-/i,
        "",
      );
    } catch {
      return fallback;
    }
  };

  const uploadSelectedDocument = async () => {
    const uploaded = await handleDocumentUpload({
      file: selectedDocumentFile,
      name: documentName,
      documentType,
    });

    if (!uploaded) {
      return;
    }

    setDocumentName("");
    setDocumentType("other");
    setSelectedDocumentFile(null);

    if (documentInputRef.current) {
      documentInputRef.current.value = "";
    }
  };

  const getMissingFieldLabel = (field: string, backendLabel: string) => {
    const labels = MISSING_FIELD_LABELS[field];

    if (!labels) {
      return backendLabel;
    }

    return lang === "ja" ? labels.ja : labels.en;
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-slate-400" />

          <p className="mt-4 text-sm text-slate-600">
            {lang === "ja"
              ? "プロフィールを読み込み中..."
              : "Loading profile..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <User className="h-6 w-6 text-slate-500" />

                <p className="text-sm font-medium text-slate-500">
                  {lang === "ja" ? "求職者プロフィール" : "Job Seeker Profile"}
                </p>
              </div>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                {profile?.name ||
                  (lang === "ja" ? "プロフィール設定" : "Profile Setup")}
              </h1>

              <p className="mt-2 text-sm text-slate-600">
                {lang === "ja"
                  ? "あなたの基本情報や就職希望条件を管理します。"
                  : "Manage your basic information and job preferences."}
              </p>
            </div>

            {!isEditing ? (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      lang === "ja" ? "/job-seekers/" : "/en/job-seekers/",
                    )
                  }
                  className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <ArrowLeft className="h-4 w-4" />

                  {lang === "ja" ? "戻る" : "Back to Dashboard"}
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  <Edit2 className="h-4 w-4" />

                  {lang === "ja" ? "プロフィールを編集" : "Edit Profile"}
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={cancelEdit}
                  disabled={saving}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  <X className="h-4 w-4" />

                  {lang === "ja" ? "キャンセル" : "Cancel"}
                </button>

                <button
                  type="button"
                  onClick={saveProfile}
                  disabled={saving}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
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
                      ? "保存する"
                      : "Save Changes"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Completion status */}
        {!profileStatus.isComplete && (
          <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

                <div>
                  <h3 className="font-semibold text-blue-800">
                    {lang === "ja"
                      ? "プロフィール完成度"
                      : "Profile Completion"}
                  </h3>

                  <p className="mt-1 text-sm text-blue-700">
                    {lang === "ja"
                      ? `あなたのプロフィールは ${profileStatus.completionPercentage}% 完了しています。以下の項目を入力してください:`
                      : `Your profile is ${profileStatus.completionPercentage}% complete. Please fill in the following fields:`}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {profileStatus.missingFields.map((field) => (
                      <span
                        key={field.field}
                        className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700"
                      >
                        {getMissingFieldLabel(field.field, field.label)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-100">
                <span className="text-lg font-bold text-blue-700">
                  {profileStatus.completionPercentage}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Complete */}
        {profileStatus.isComplete && !isEditing && (
          <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />

              <div>
                <h3 className="font-semibold text-green-800">
                  {lang === "ja" ? "プロフィール完了" : "Profile Complete"}
                </h3>

                <p className="mt-1 text-sm text-green-700">
                  {lang === "ja"
                    ? "あなたのプロフィールは完了しています。"
                    : "Your profile is complete."}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {/* Basic Information */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader
              title={lang === "ja" ? "基本情報" : "Basic Information"}
              icon={<User className="h-5 w-5" />}
              description={
                lang === "ja" ? "あなたの基本情報" : "Your basic information"
              }
            />

            <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white">
                  {profile?.profile_photo ? (
                    <img
                      src={getFileUrl(profile.profile_photo)}
                      alt={profile.name || "Profile"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-12 w-12 text-slate-300" />
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {lang === "ja" ? "プロフィール写真" : "Profile Photo"}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {lang === "ja"
                      ? "JPG、PNG、WEBP形式。最大5MB。"
                      : "JPG, PNG or WEBP. Maximum 5MB."}
                  </p>

                  {isEditing && (
                    <div className="mt-4">
                      <input
                        ref={profilePhotoInputRef}
                        id="profile-photo-upload"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        disabled={uploadingProfilePhoto}
                        className="hidden"
                        onChange={async (event) => {
                          const file = event.target.files?.[0];

                          if (!file) {
                            return;
                          }

                          await handleProfilePhotoUpload(file);

                          if (profilePhotoInputRef.current) {
                            profilePhotoInputRef.current.value = "";
                          }
                        }}
                      />

                      <label
                        htmlFor="profile-photo-upload"
                        className={`inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition ${
                          uploadingProfilePhoto
                            ? "cursor-not-allowed opacity-50"
                            : "cursor-pointer hover:border-slate-400 hover:bg-slate-50"
                        }`}
                      >
                        {uploadingProfilePhoto ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4" />
                        )}

                        {uploadingProfilePhoto
                          ? lang === "ja"
                            ? "アップロード中..."
                            : "Uploading..."
                          : profile?.profile_photo
                            ? lang === "ja"
                              ? "写真を変更"
                              : "Change Photo"
                            : lang === "ja"
                              ? "写真をアップロード"
                              : "Upload Photo"}
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      {lang === "ja" ? "氏名" : "Full Name"}
                    </label>

                    <p className="text-sm text-slate-900">
                      {profile?.name || "-"}
                    </p>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      {lang === "ja" ? "メールアドレス" : "Email Address"}
                    </label>

                    <p className="text-sm text-slate-900">
                      {profile?.email || "-"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <InputField
                    label={lang === "ja" ? "電話番号" : "Phone Number"}
                    name="phone"
                    value={formData.phone}
                    type="tel"
                    placeholder={
                      lang === "ja"
                        ? "例：090-1234-5678"
                        : "e.g., +81 90-1234-5678"
                    }
                    icon={<Phone className="h-4 w-4" />}
                    isEditing={isEditing}
                    error={getFieldError("phone")}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    autoComplete="tel"
                  />

                  {isFieldMissing("phone") && (
                    <MissingFieldMessage lang={lang} />
                  )}
                </div>

                <div className="space-y-2">
                  <InputField
                    label={lang === "ja" ? "住所" : "Address"}
                    name="address"
                    value={formData.address}
                    placeholder={
                      lang === "ja"
                        ? "例：東京都渋谷区神南1-1-1"
                        : "e.g., Shibuya-ku, Tokyo"
                    }
                    icon={<MapPin className="h-4 w-4" />}
                    isEditing={isEditing}
                    error={getFieldError("address")}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    autoComplete="street-address"
                  />

                  {isFieldMissing("address") && (
                    <MissingFieldMessage lang={lang} />
                  )}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <InputField
                  label={lang === "ja" ? "生年月日" : "Date of Birth"}
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  type="date"
                  icon={<Cake className="h-4 w-4" />}
                  isEditing={isEditing}
                  error={getFieldError("date_of_birth")}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                />

                <SelectField
                  label={lang === "ja" ? "性別" : "Gender"}
                  name="gender"
                  value={formData.gender}
                  options={GENDERS[lang as keyof typeof GENDERS] || GENDERS.en}
                  placeholder={
                    lang === "ja" ? "選択してください" : "Select gender"
                  }
                  icon={<Users className="h-4 w-4" />}
                  isEditing={isEditing}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <SelectField
                    label={lang === "ja" ? "国籍" : "Nationality"}
                    name="nationality"
                    value={formData.nationality}
                    options={
                      NATIONALITIES[lang as keyof typeof NATIONALITIES] ||
                      NATIONALITIES.en
                    }
                    placeholder={
                      lang === "ja" ? "選択してください" : "Select nationality"
                    }
                    icon={<Flag className="h-4 w-4" />}
                    isEditing={isEditing}
                    onChange={handleInputChange}
                    required
                    error={getFieldError("nationality")}
                  />

                  {isFieldMissing("nationality") &&
                    !getFieldError("nationality") && (
                      <MissingFieldMessage lang={lang} />
                    )}
                </div>

                <div>
                  <SelectField
                    label={lang === "ja" ? "日本語レベル" : "Japanese Level"}
                    name="japanese_level"
                    value={formData.japanese_level}
                    options={
                      JAPANESE_LEVELS[lang as keyof typeof JAPANESE_LEVELS] ||
                      JAPANESE_LEVELS.en
                    }
                    placeholder={
                      lang === "ja"
                        ? "選択してください"
                        : "Select Japanese level"
                    }
                    icon={<Languages className="h-4 w-4" />}
                    isEditing={isEditing}
                    onChange={handleInputChange}
                    required
                    error={getFieldError("japanese_level")}
                  />

                  {isFieldMissing("japanese_level") &&
                    !getFieldError("japanese_level") && (
                      <MissingFieldMessage lang={lang} />
                    )}
                </div>
              </div>
            </div>
          </section>

          {/* Education */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader
              title={lang === "ja" ? "学歴" : "Education"}
              icon={<GraduationCap className="h-5 w-5" />}
              description={
                lang === "ja"
                  ? "あなたの学歴情報（必須）"
                  : "Your educational background (required)"
              }
            />

            {isFieldMissing("education") && (
              <div className="mb-4 flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-700">
                <AlertCircle className="h-4 w-4" />

                <p>
                  {lang === "ja"
                    ? "少なくとも1つの学歴を追加してください。"
                    : "Please add at least one education record."}
                </p>
              </div>
            )}

            <div className="space-y-6">
              {!isEditing && education.length === 0 && (
                <p className="py-4 text-center text-sm text-slate-500">
                  {lang === "ja"
                    ? "学歴情報はまだ登録されていません"
                    : "No education records added yet"}
                </p>
              )}

              {education.map((record, index) => (
                <div
                  key={record._id || index}
                  className="relative rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => removeEducationRecord(index)}
                      className="absolute right-3 top-3 cursor-pointer text-slate-400 transition hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        {lang === "ja" ? "学校名" : "School Name"}

                        <span className="text-red-500">*</span>
                      </label>

                      {isEditing ? (
                        <input
                          type="text"
                          value={record.school}
                          onChange={(event) =>
                            updateEducationRecord(
                              index,
                              "school",
                              event.target.value,
                            )
                          }
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        />
                      ) : (
                        <p className="py-3 text-sm text-slate-900">
                          {record.school || "-"}
                        </p>
                      )}
                    </div>

                    <RecordDateField
                      label={lang === "ja" ? "入学日" : "Enrollment Date"}
                      value={record.enrollment_date}
                      isEditing={isEditing}
                      onChange={(value) =>
                        updateEducationRecord(index, "enrollment_date", value)
                      }
                    />

                    <RecordDateField
                      label={lang === "ja" ? "卒業日" : "Graduation Date"}
                      value={record.graduation_date}
                      isEditing={isEditing}
                      onChange={(value) =>
                        updateEducationRecord(index, "graduation_date", value)
                      }
                    />

                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        {lang === "ja" ? "学校種別" : "School Type"}
                      </label>

                      {isEditing ? (
                        <select
                          value={record.school_type || ""}
                          onChange={(event) =>
                            updateEducationRecord(
                              index,
                              "school_type",
                              event.target.value,
                            )
                          }
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
                        >
                          <option value="">
                            {lang === "ja" ? "選択してください" : "Select type"}
                          </option>

                          {(
                            SCHOOL_TYPES[lang as keyof typeof SCHOOL_TYPES] ||
                            SCHOOL_TYPES.en
                          ).map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p className="py-3 text-sm text-slate-900">
                          {record.school_type || "-"}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        {lang === "ja" ? "専攻" : "Major"}
                      </label>

                      {isEditing ? (
                        <input
                          type="text"
                          value={record.major || ""}
                          onChange={(event) =>
                            updateEducationRecord(
                              index,
                              "major",
                              event.target.value,
                            )
                          }
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
                        />
                      ) : (
                        <p className="py-3 text-sm text-slate-900">
                          {record.major || "-"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isEditing && (
                <button
                  type="button"
                  onClick={addEducationRecord}
                  className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-white px-6 py-4 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  <Plus className="h-4 w-4" />

                  {lang === "ja" ? "学歴を追加" : "Add Education"}
                </button>
              )}
            </div>
          </section>

          {/* Employment */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader
              title={lang === "ja" ? "職歴" : "Employment History"}
              icon={<Building2 className="h-5 w-5" />}
              description={
                lang === "ja"
                  ? "あなたの職歴情報（任意）"
                  : "Your employment history (optional)"
              }
            />

            <div className="space-y-6">
              {!isEditing && employmentHistory.length === 0 && (
                <p className="py-4 text-center text-sm text-slate-500">
                  {lang === "ja"
                    ? "職歴情報はまだ登録されていません"
                    : "No employment records added yet"}
                </p>
              )}

              {employmentHistory.map((record, index) => (
                <div
                  key={record._id || index}
                  className="relative rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => removeEmploymentRecord(index)}
                      className="absolute right-3 top-3 cursor-pointer text-slate-400 transition hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        {lang === "ja" ? "会社名" : "Company Name"}

                        <span className="text-red-500">*</span>
                      </label>

                      {isEditing ? (
                        <input
                          type="text"
                          value={record.company_name}
                          onChange={(event) =>
                            updateEmploymentRecord(
                              index,
                              "company_name",
                              event.target.value,
                            )
                          }
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
                        />
                      ) : (
                        <p className="py-3 text-sm text-slate-900">
                          {record.company_name || "-"}
                        </p>
                      )}
                    </div>

                    <RecordDateField
                      label={lang === "ja" ? "入社日" : "Start Date"}
                      value={record.start_date}
                      isEditing={isEditing}
                      onChange={(value) =>
                        updateEmploymentRecord(index, "start_date", value)
                      }
                    />

                    <RecordDateField
                      label={lang === "ja" ? "退社日" : "End Date"}
                      value={record.end_date}
                      isEditing={isEditing}
                      onChange={(value) =>
                        updateEmploymentRecord(index, "end_date", value)
                      }
                    />

                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        {lang === "ja" ? "雇用形態" : "Employment Type"}
                      </label>

                      {isEditing ? (
                        <select
                          value={record.employment_type || ""}
                          onChange={(event) =>
                            updateEmploymentRecord(
                              index,
                              "employment_type",
                              event.target.value,
                            )
                          }
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
                        >
                          <option value="">
                            {lang === "ja" ? "選択してください" : "Select type"}
                          </option>

                          {(
                            EMPLOYMENT_TYPES[
                              lang as keyof typeof EMPLOYMENT_TYPES
                            ] || EMPLOYMENT_TYPES.en
                          ).map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p className="py-3 text-sm text-slate-900">
                          {record.employment_type || "-"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isEditing && (
                <button
                  type="button"
                  onClick={addEmploymentRecord}
                  className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-white px-6 py-4 text-sm font-medium text-slate-700"
                >
                  <Plus className="h-4 w-4" />

                  {lang === "ja" ? "職歴を追加" : "Add Employment"}
                </button>
              )}
            </div>
          </section>

          {/* Visa */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader
              title={lang === "ja" ? "ビザ情報" : "Visa Information"}
              icon={<BookLock className="h-5 w-5" />}
              description={
                lang === "ja"
                  ? "現在のビザステータス"
                  : "Your current visa status"
              }
            />

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <SelectField
                  label={lang === "ja" ? "ビザ種類" : "Visa Type"}
                  name="visa_type"
                  value={formData.visa_type}
                  options={
                    VISA_TYPES[lang as keyof typeof VISA_TYPES] || VISA_TYPES.en
                  }
                  placeholder={
                    lang === "ja" ? "選択してください" : "Select visa type"
                  }
                  icon={<Globe className="h-4 w-4" />}
                  isEditing={isEditing}
                  onChange={handleInputChange}
                  required
                  error={getFieldError("visa_type")}
                />

                {isFieldMissing("visa_type") && !getFieldError("visa_type") && (
                  <MissingFieldMessage lang={lang} />
                )}
              </div>

              <InputField
                label={lang === "ja" ? "ビザ有効期限" : "Visa Expiry Date"}
                name="visa_expiry_date"
                value={formData.visa_expiry_date}
                type="date"
                icon={<Calendar className="h-4 w-4" />}
                isEditing={isEditing}
                error={getFieldError("visa_expiry_date")}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
            </div>
          </section>

          {/* Job preferences */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader
              title={lang === "ja" ? "就職希望" : "Job Preferences"}
              icon={<Briefcase className="h-5 w-5" />}
              description={
                lang === "ja"
                  ? "あなたの希望する職種や勤務地"
                  : "Your desired job type and location"
              }
            />

            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <InputField
                    label={lang === "ja" ? "希望職種" : "Desired Job"}
                    name="desired_job"
                    value={formData.desired_job}
                    placeholder={
                      lang === "ja"
                        ? "例：ソフトウェアエンジニア"
                        : "e.g., Software Engineer"
                    }
                    icon={<Briefcase className="h-4 w-4" />}
                    isEditing={isEditing}
                    error={getFieldError("desired_job")}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    required
                  />

                  {isFieldMissing("desired_job") && (
                    <MissingFieldMessage lang={lang} />
                  )}
                </div>

                <div>
                  <InputField
                    label={lang === "ja" ? "希望勤務地" : "Desired Location"}
                    name="desired_location"
                    value={formData.desired_location}
                    placeholder={lang === "ja" ? "例：東京都" : "e.g., Tokyo"}
                    icon={<MapPinIcon className="h-4 w-4" />}
                    isEditing={isEditing}
                    error={getFieldError("desired_location")}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    required
                  />

                  {isFieldMissing("desired_location") && (
                    <MissingFieldMessage lang={lang} />
                  )}
                </div>
              </div>

              <div>
                <InputField
                  label={lang === "ja" ? "就業可能日" : "Available From"}
                  name="available_from"
                  value={formData.available_from}
                  type="date"
                  icon={<Clock className="h-4 w-4" />}
                  isEditing={isEditing}
                  error={getFieldError("available_from")}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                />

                {isFieldMissing("available_from") && (
                  <MissingFieldMessage lang={lang} />
                )}
              </div>
            </div>
          </section>

          {/* Resume */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader
              title={lang === "ja" ? "履歴書" : "Resume/CV"}
              icon={<FileText className="h-5 w-5" />}
              description={
                lang === "ja"
                  ? "履歴書のアップロード（必須）"
                  : "Upload your resume (required)"
              }
            />

            {isFieldMissing("resume_file") && (
              <div className="mb-4 flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-700">
                <AlertCircle className="h-4 w-4" />

                <p>
                  {lang === "ja"
                    ? "履歴書のアップロードは必須です。"
                    : "Resume upload is required for profile completion."}
                </p>
              </div>
            )}

            <div className="space-y-4">
              {profile?.resume_file && (
                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-slate-500" />

                    <span className="text-sm text-slate-700">
                      {getDisplayFileName(profile.resume_file, "Resume/CV")}
                    </span>
                  </div>

                  <a
                    href={getFileUrl(profile.resume_file)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    {lang === "ja" ? "表示" : "View"}
                  </a>
                </div>
              )}

              {isEditing && (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    disabled={uploadingResume}
                    className="hidden"
                    id="resume-upload"
                    onChange={async (event) => {
                      const file = event.target.files?.[0];

                      if (!file) {
                        return;
                      }

                      await handleResumeUpload(file);

                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                  />

                  <label
                    htmlFor="resume-upload"
                    className={`inline-flex items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-white px-6 py-4 text-sm font-medium text-slate-700 transition ${
                      uploadingResume
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer hover:border-slate-400 hover:bg-slate-50"
                    }`}
                  >
                    {uploadingResume ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}

                    {uploadingResume
                      ? lang === "ja"
                        ? "アップロード中..."
                        : "Uploading..."
                      : lang === "ja"
                        ? "新しい履歴書をアップロード"
                        : "Upload New Resume"}
                  </label>

                  <p className="mt-2 text-xs text-slate-500">
                    {lang === "ja"
                      ? "対応形式: PDF, DOC, DOCX (最大5MB)"
                      : "Supported formats: PDF, DOC, DOCX (Max 5MB)"}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Additional Documents */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader
              title={lang === "ja" ? "追加書類" : "Additional Documents"}
              icon={<FileText className="h-5 w-5" />}
              description={
                lang === "ja"
                  ? "パスポート、在留カード、証明書などの書類を管理します"
                  : "Manage passport, residence card, certificates and other supporting documents"
              }
            />

            <div className="space-y-4">
              {profile?.other_documents?.length ? (
                profile.other_documents.map((document) => (
                  <div
                    key={document._id || document.file_url}
                    className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-white p-2 text-slate-500">
                          <FileText className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {document.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {document.document_type || "other"}
                            {" · "}
                            {getDisplayFileName(
                              document.file_url,
                              lang === "ja" ? "書類" : "Document",
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <a
                        href={getFileUrl(document.file_url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-slate-100"
                      >
                        {lang === "ja" ? "表示" : "View"}
                      </a>

                      {isEditing && document._id && (
                        <button
                          type="button"
                          onClick={() => handleRemoveDocument(document)}
                          disabled={removingDocumentId === document._id}
                          className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {removingDocumentId === document._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}

                          {lang === "ja" ? "削除" : "Remove"}
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center">
                  <FileText className="mx-auto h-7 w-7 text-slate-300" />

                  <p className="mt-2 text-sm text-slate-500">
                    {lang === "ja"
                      ? "追加書類はまだアップロードされていません"
                      : "No additional documents uploaded yet"}
                  </p>
                </div>
              )}

              {isEditing && (
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {lang === "ja" ? "書類を追加" : "Add Document"}
                  </h3>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        {lang === "ja" ? "書類名" : "Document Name"}
                      </label>

                      <input
                        type="text"
                        value={documentName}
                        onChange={(event) =>
                          setDocumentName(event.target.value)
                        }
                        placeholder={
                          lang === "ja" ? "例：パスポート" : "e.g., Passport"
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        {lang === "ja" ? "書類種類" : "Document Type"}
                      </label>

                      <select
                        value={documentType}
                        onChange={(event) =>
                          setDocumentType(event.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="passport">
                          {lang === "ja" ? "パスポート" : "Passport"}
                        </option>
                        <option value="residence_card">
                          {lang === "ja" ? "在留カード" : "Residence Card"}
                        </option>
                        <option value="visa">
                          {lang === "ja" ? "ビザ関連書類" : "Visa Document"}
                        </option>
                        <option value="certificate">
                          {lang === "ja" ? "証明書" : "Certificate"}
                        </option>
                        <option value="jlpt">
                          {lang === "ja"
                            ? "日本語証明"
                            : "JLPT / Japanese Certificate"}
                        </option>
                        <option value="education">
                          {lang === "ja" ? "学歴書類" : "Education Document"}
                        </option>
                        <option value="other">
                          {lang === "ja" ? "その他" : "Other"}
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <input
                      ref={documentInputRef}
                      id="other-document-upload"
                      type="file"
                      accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx"
                      disabled={uploadingDocument}
                      className="hidden"
                      onChange={(event) => {
                        setSelectedDocumentFile(
                          event.target.files?.[0] || null,
                        );
                      }}
                    />

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <label
                        htmlFor="other-document-upload"
                        className={`inline-flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition ${
                          uploadingDocument
                            ? "cursor-not-allowed opacity-50"
                            : "cursor-pointer hover:border-slate-400 hover:bg-slate-50"
                        }`}
                      >
                        <Upload className="h-4 w-4" />

                        {selectedDocumentFile
                          ? lang === "ja"
                            ? "別のファイルを選択"
                            : "Choose Another File"
                          : lang === "ja"
                            ? "ファイルを選択"
                            : "Choose File"}
                      </label>

                      {selectedDocumentFile && (
                        <p className="min-w-0 truncate text-sm text-slate-600">
                          {selectedDocumentFile.name}
                        </p>
                      )}
                    </div>

                    <p className="mt-2 text-xs text-slate-500">
                      {lang === "ja"
                        ? "対応形式: JPG, PNG, GIF, WEBP, PDF, DOC, DOCX (最大10MB)"
                        : "Supported formats: JPG, PNG, GIF, WEBP, PDF, DOC, DOCX (Max 10MB)"}
                    </p>
                  </div>

                  <div className="mt-5 flex justify-end">
                    <button
                      type="button"
                      onClick={uploadSelectedDocument}
                      disabled={uploadingDocument}
                      className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {uploadingDocument ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}

                      {uploadingDocument
                        ? lang === "ja"
                          ? "アップロード中..."
                          : "Uploading..."
                        : lang === "ja"
                          ? "書類をアップロード"
                          : "Upload Document"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Notes */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader
              title={lang === "ja" ? "備考・メモ" : "Additional Notes"}
              icon={<FileText className="h-5 w-5" />}
            />

            <InputField
              label={lang === "ja" ? "その他の情報" : "Other Information"}
              name="notes"
              value={formData.notes}
              rows={4}
              placeholder={
                lang === "ja"
                  ? "その他、採用担当者に伝えたい情報があれば記載してください"
                  : "Any additional information you'd like to share"
              }
              isEditing={isEditing}
              error={getFieldError("notes")}
              onChange={handleInputChange}
              onBlur={handleBlur}
              maxLength={500}
            />
          </section>
        </div>
      </div>
    </div>
  );
}

type SelectFieldProps = {
  label: string;
  name: string;
  value: string;
  options: string[];
  placeholder: string;
  icon?: React.ReactNode;
  required?: boolean;
  isEditing: boolean;
  error?: string;

  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

function SelectField({
  label,
  name,
  value,
  options,
  placeholder,
  icon,
  required,
  isEditing,
  error,
  onChange,
}: SelectFieldProps) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
        {icon && <span className="text-slate-400">{icon}</span>}

        {label}

        {required && <span className="text-red-500">*</span>}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={!isEditing}
        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 ${
          !isEditing
            ? "cursor-not-allowed bg-slate-50 text-slate-500"
            : "hover:border-slate-300"
        } ${error ? "border-red-300" : "border-slate-200"}`}
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function MissingFieldMessage({ lang }: { lang: string }) {
  return (
    <p className="mt-2 flex items-center gap-1 text-xs text-blue-600">
      <AlertCircle className="h-3 w-3" />

      {lang === "ja"
        ? "この項目は必須です"
        : "This field is required for profile completion"}
    </p>
  );
}

function RecordDateField({
  label,
  value,
  isEditing,
  onChange,
}: {
  label: string;
  value: string | null;
  isEditing: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>

      {isEditing ? (
        <input
          type="date"
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
      ) : (
        <p className="py-3 text-sm text-slate-900">{value || "-"}</p>
      )}
    </div>
  );
}
