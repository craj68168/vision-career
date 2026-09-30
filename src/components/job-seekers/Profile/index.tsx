"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

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
  Plus,
  Trash2,
  GraduationCap,
  Building2,
} from "lucide-react";

import { useJobSeekerProfile } from "./hook";

/*
  Design tokens (same as job seeker dashboard, Tailwind only)
  - page      oklch(0.975 0.008 150)   text emerald-950   muted slate-600
  - primary   emerald-700 (hover 800)  soft emerald-50
  - warning   amber (incomplete / missing)   danger red
  - weights   headings semibold, labels/body medium or normal (no bold)
  - density   compact: 40px controls, 16px card padding, 12px gaps
*/

const pageBg = "bg-[oklch(0.975_0.008_150)] text-emerald-950";
const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700";
const btnBase = `inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-md px-3.5 py-2 text-[13px] font-semibold transition active:translate-y-px disabled:cursor-not-allowed disabled:opacity-55 ${focusRing}`;
const btnPrimary = `${btnBase} bg-emerald-700 text-white hover:bg-emerald-800`;
const btnSecondary = `${btnBase} border border-slate-200 bg-white text-emerald-950 hover:border-slate-300 hover:bg-slate-100`;
const btnTinted = `${btnBase} border border-emerald-200 bg-white text-emerald-800 hover:border-emerald-300 hover:bg-emerald-100`;
const btnDanger = `${btnBase} border border-red-200 bg-white text-red-700 hover:bg-red-50`;

const container = "mx-auto w-full max-w-[90rem] px-4 sm:px-6 lg:px-10";
const sectionCard =
  "min-w-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm";
const recordCard =
  "relative rounded-md border border-slate-200 bg-slate-50 p-3.5";
const labelCaps =
  "text-[10px] font-medium uppercase tracking-wider text-slate-500";
const fieldLabel =
  "flex items-center gap-1.5 text-[13px] font-medium text-slate-700";
const readText = "min-h-10 py-2.5 text-[13px] text-slate-900 [overflow-wrap:anywhere]";
const wrap = "[overflow-wrap:anywhere]";
const dashedAction = `inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-dashed border-slate-300 bg-white px-4 py-2 text-[13px] font-medium text-slate-700 transition ${focusRing}`;
const dashedEnabled =
  "cursor-pointer hover:border-emerald-700 hover:bg-emerald-50";
const dashedDisabled = "cursor-not-allowed opacity-55";

const controlBase =
  "w-full rounded-md text-base outline-none transition placeholder:text-slate-400 focus:ring-2 sm:text-sm";

function controlClass(isEditing: boolean, error?: string) {
  const border = error
    ? "border border-red-400 focus:border-red-500 focus:ring-red-500/25"
    : isEditing
      ? "border border-slate-300 hover:border-slate-400 focus:border-emerald-700 focus:ring-emerald-700/25"
      : "border border-slate-200 focus:border-emerald-700 focus:ring-emerald-700/25";

  const tone = isEditing
    ? "bg-white text-slate-900"
    : "cursor-not-allowed bg-slate-50 text-slate-500";

  return `${controlBase} ${border} ${tone}`;
}

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

const GENDERS = {
  ja: ["\u7537\u6027", "\u5973\u6027", "\u305d\u306e\u4ed6", "\u56de\u7b54\u3057\u306a\u3044"],
  en: ["Male", "Female", "Other", "Prefer not to say"],
};

const JAPANESE_LEVELS = {
  ja: [
    "\u30cd\u30a4\u30c6\u30a3\u30d6",
    "N1 (\u30d3\u30b8\u30cd\u30b9\u30ec\u30d9\u30eb)",
    "N2 (\u65e5\u5e38\u4f1a\u8a71\u30ec\u30d9\u30eb)",
    "N3 (\u57fa\u672c\u7684\u306a\u30b3\u30df\u30e5\u30cb\u30b1\u30fc\u30b7\u30e7\u30f3)",
    "N4 (\u521d\u7d1a)",
    "N5 (\u5165\u9580)",
    "\u5b66\u7fd2\u4e2d",
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
    "\u6c38\u4f4f\u8005",
    "\u65e5\u672c\u4eba\u306e\u914d\u5076\u8005\u7b49",
    "\u6c38\u4f4f\u8005\u306e\u914d\u5076\u8005\u7b49",
    "\u5b9a\u4f4f\u8005",
    "\u6280\u8853\u30fb\u4eba\u6587\u77e5\u8b58\u30fb\u56fd\u969b\u696d\u52d9",
    "\u7279\u5b9a\u6280\u80fd",
    "\u6280\u80fd\u5b9f\u7fd2",
    "\u7559\u5b66",
    "\u30ef\u30fc\u30ad\u30f3\u30b0\u30db\u30ea\u30c7\u30fc",
    "\u305d\u306e\u4ed6",
    "\u5c31\u52b4\u30d3\u30b6\u4e0d\u8981",
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
    "\u65e5\u672c",
    "\u4e2d\u56fd",
    "\u97d3\u56fd",
    "\u30d9\u30c8\u30ca\u30e0",
    "\u30cd\u30d1\u30fc\u30eb",
    "\u30a4\u30f3\u30c9\u30cd\u30b7\u30a2",
    "\u30d5\u30a3\u30ea\u30d4\u30f3",
    "\u30bf\u30a4",
    "\u30df\u30e3\u30f3\u30de\u30fc",
    "\u30a4\u30f3\u30c9",
    "\u30a2\u30e1\u30ea\u30ab",
    "\u30a4\u30ae\u30ea\u30b9",
    "\u30ab\u30ca\u30c0",
    "\u30aa\u30fc\u30b9\u30c8\u30e9\u30ea\u30a2",
    "\u305d\u306e\u4ed6",
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
  ja: ["\u9ad8\u6821", "\u5c02\u9580\u5b66\u6821", "\u77ed\u671f\u5927\u5b66", "\u5927\u5b66", "\u5927\u5b66\u9662", "\u305d\u306e\u4ed6"],
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
  ja: ["\u6b63\u793e\u54e1", "\u5951\u7d04\u793e\u54e1", "\u6d3e\u9063\u793e\u54e1", "\u30d1\u30fc\u30c8\u30fb\u30a2\u30eb\u30d0\u30a4\u30c8", "\u30a4\u30f3\u30bf\u30fc\u30f3", "\u305d\u306e\u4ed6"],
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
  const commonClasses = controlClass(isEditing, error);

  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className={fieldLabel}>
        {icon && (
          <span aria-hidden className="text-slate-400 [&>svg]:h-4 [&>svg]:w-4">
            {icon}
          </span>
        )}

        {label}

        {required && <span className="text-red-600">*</span>}
      </label>

      {rows ? (
        <>
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={!isEditing}
            rows={rows}
            maxLength={maxLength}
            autoComplete={autoComplete}
            placeholder={placeholder}
            aria-invalid={Boolean(error)}
            className={`${commonClasses} resize-none px-3 py-2`}
          />

          {maxLength && (
            <div className="text-right text-xs tabular-nums text-slate-500">
              {charCount}/{maxLength}
            </div>
          )}
        </>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={!isEditing}
          maxLength={maxLength}
          autoComplete={autoComplete}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          className={`${commonClasses} h-10 px-3`}
        />
      )}

      {error && (
        <div className="flex items-center gap-1 text-xs text-red-600">
          <AlertCircle className="h-3 w-3 shrink-0" />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}

type SkillsFieldProps = {
  label: string;
  name: string;
  value: string;
  placeholder?: string;
  icon?: React.ReactNode;
  isEditing: boolean;
  error?: string;
  maxLength?: number;
  addSkillLabel: string;
  removeSkillLabel: (skill: string) => string;
  onChange: (value: string) => void;
};

const parseSkills = (value: string) =>
  value
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

const formatSkills = (skills: string[]) => skills.join(", ");

function SkillsField({
  label,
  name,
  value,
  placeholder,
  icon,
  isEditing,
  error,
  maxLength = 500,
  addSkillLabel,
  removeSkillLabel,
  onChange,
}: SkillsFieldProps) {
  const [draft, setDraft] = useState("");
  const skills = parseSkills(value);
  const commonClasses = controlClass(isEditing, error);

  const getUniqueSkills = (nextSkills: string[]) =>
    nextSkills.reduce<string[]>((result, skill) => {
      const trimmed = skill.trim();

      if (
        trimmed &&
        !result.some(
          (existing) => existing.toLowerCase() === trimmed.toLowerCase(),
        )
      ) {
        result.push(trimmed);
      }

      return result;
    }, []);

  const updateSkills = (nextSkills: string[]) => {
    const uniqueSkills = getUniqueSkills(nextSkills);

    onChange(formatSkills(uniqueSkills));
  };

  const addDraftSkills = (rawValue = draft) => {
    const nextSkills = parseSkills(rawValue);

    if (!nextSkills.length) {
      setDraft("");
      return;
    }

    const uniqueSkills = getUniqueSkills([...skills, ...nextSkills]);
    const nextValue = formatSkills(uniqueSkills);

    if (nextValue.length > maxLength) {
      setDraft(rawValue);
      return;
    }

    onChange(nextValue);
    setDraft("");
  };

  const removeSkill = (skillToRemove: string) => {
    updateSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === "Tab") {
      if (draft.trim()) {
        event.preventDefault();
        addDraftSkills();
      }
    }

    if (event.key === "Backspace" && !draft && skills.length) {
      removeSkill(skills[skills.length - 1]);
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = event.clipboardData.getData("text");

    if (pasted.includes(",")) {
      event.preventDefault();
      addDraftSkills(pasted);
    }
  };

  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className={fieldLabel}>
        {icon && (
          <span aria-hidden className="text-slate-400 [&>svg]:h-4 [&>svg]:w-4">
            {icon}
          </span>
        )}

        {label}
      </label>

      <div
        className={`${commonClasses} min-h-10 px-2 py-2 ${
          isEditing ? "" : "cursor-default"
        }`}
      >
        <div className="flex flex-wrap items-center gap-1.5">
          {skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex max-w-full items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-900"
            >
              <span className={wrap}>{skill}</span>

              {isEditing && (
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  aria-label={removeSkillLabel(skill)}
                  className={`grid h-5 w-5 shrink-0 cursor-pointer place-items-center rounded-full text-emerald-700 transition hover:bg-emerald-100 hover:text-emerald-950 ${focusRing}`}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </span>
          ))}

          {isEditing && (
            <div className="flex min-w-[12rem] flex-1 items-center gap-1">
              <input
                id={name}
                type="text"
                value={draft}
                maxLength={maxLength}
                placeholder={skills.length ? "" : placeholder}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                onBlur={() => addDraftSkills()}
                className="h-7 min-w-0 flex-1 border-0 bg-transparent px-1 text-base text-slate-900 outline-none placeholder:text-slate-400 sm:text-sm"
              />

              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => addDraftSkills()}
                disabled={!draft.trim()}
                aria-label={addSkillLabel}
                className={`grid h-7 w-7 shrink-0 cursor-pointer place-items-center rounded-md bg-emerald-700 text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-45 ${focusRing}`}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          )}

          {!isEditing && !skills.length && (
            <span className="px-1 text-[13px] text-slate-500">-</span>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="flex justify-end">
          <span className="text-xs tabular-nums text-slate-500">
            {value.length}/{maxLength}
          </span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1 text-xs text-red-600">
          <AlertCircle className="h-3 w-3 shrink-0" />
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
    <div className="mb-4 flex items-start gap-3">
      <span
        aria-hidden
        className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-emerald-50 text-emerald-700 [&>svg]:h-4 [&>svg]:w-4"
      >
        {icon}
      </span>

      <div className="min-w-0">
        <h2 className="text-base font-semibold">{title}</h2>

        {description && (
          <p className="mt-0.5 text-[13px] leading-5 text-slate-600">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

export default function JobSeekerProfilePage() {
  const router = useRouter();
  const t = useTranslations("jobSeeker.profile");

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
    generatingResume,
    viewingGeneratedResume,
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
    handleGenerateResume,
    handleViewGeneratedResume,
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

  const getPlacementStatusLabel = (status?: string | null) => {
    const labels: Record<string, string> = {
      unplaced: t("placementUnplaced"),
      matching: t("placementMatching"),
      interview: t("placementInterview"),
      selected: t("placementSelected"),
      placed: t("placementPlaced"),
    };

    const normalized = status || "unplaced";

    return labels[normalized] || normalized;
  };

  const generatedResumeName = profile?.generated_resume_file
    ? getDisplayFileName(
        profile.generated_resume_file,
        t("autoGeneratedResume"),
      )
    : null;

  if (loading) {
    return (
      <div
        className={`flex min-h-dvh items-center justify-center ${pageBg}`}
        role="status"
        aria-busy="true"
      >
        <div className="text-center">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-emerald-700" />

          <p className="mt-3 text-[13px] text-slate-600">
            {t("loadingProfile")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-dvh ${pageBg}`}>
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div
          className={`${container} flex flex-col gap-4 py-5 lg:flex-row lg:items-center lg:justify-between`}
        >
          <div className="min-w-0">
            <p className="text-xs font-medium text-emerald-700">
              {t("pageLabel")}
            </p>

            <h1 className="mt-1 text-balance text-xl font-semibold tracking-tight sm:text-2xl lg:text-[1.75rem]">
              {profile?.name || t("profileSetup")}
            </h1>

            <p className="mt-1 max-w-2xl text-pretty text-sm leading-6 text-slate-600">
              {t("profileDescription")}
            </p>
          </div>

          {!isEditing ? (
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap lg:shrink-0">
              <button
                type="button"
                onClick={() =>
                  router.push(
                    lang === "ja" ? "/job-seekers/" : "/en/job-seekers/",
                  )
                }
                className={btnSecondary}
              >
                <ArrowLeft className="h-4 w-4" />

                {t("backToDashboard")}
              </button>

              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className={btnPrimary}
              >
                <Edit2 className="h-4 w-4" />

                {t("editProfile")}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap lg:shrink-0">
              <button
                type="button"
                onClick={cancelEdit}
                disabled={saving}
                className={btnSecondary}
              >
                <X className="h-4 w-4" />

                {t("cancel")}
              </button>

              <button
                type="button"
                onClick={saveProfile}
                disabled={saving}
                className={btnPrimary}
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}

                {saving ? t("saving") : t("saveChanges")}
              </button>
            </div>
          )}
        </div>
      </header>

      <main className={`${container} py-5 sm:py-6`}>
        {/* Completion status */}
        {!profileStatus.isComplete && (
          <section className="mb-4 flex items-start justify-between gap-4 rounded-lg border border-amber-200 bg-amber-50 p-3.5">
            <div className="flex min-w-0 items-start gap-3">
              <span
                aria-hidden
                className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-amber-500 text-white"
              >
                <AlertCircle className="h-4 w-4" />
              </span>

              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-amber-950">
                  {t("profileCompletion")}
                </h2>

                <p className="mt-0.5 text-[13px] leading-5 text-amber-900/80">
                  {t("profileCompletionDescription", {
                    percentage: profileStatus.completionPercentage,
                  })}
                </p>

                <div className="mt-2 flex flex-wrap gap-1.5">
                  {profileStatus.missingFields.map((field) => (
                    <span
                      key={field.field}
                      className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-900"
                    >
                      {getMissingFieldLabel(field.field, field.label)}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <span className="shrink-0 text-xl font-semibold tabular-nums text-amber-900">
              {profileStatus.completionPercentage}%
            </span>
          </section>
        )}

        <div className="space-y-3 sm:space-y-4">
          {/* Basic Information */}
          <section className={sectionCard}>
            <SectionHeader
              title={t("basicInformation")}
              icon={<User />}
              description={t("basicInformationDescription")}
            />

            <div className="mb-4 rounded-md border border-slate-200 bg-slate-50 p-3.5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white">
                  {profile?.profile_photo ? (
                    <img
                      src={getFileUrl(profile.profile_photo)}
                      alt={profile.name || "Profile"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-8 w-8 text-slate-300" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-[13px] font-semibold">
                    {t("profilePhoto")}
                  </h3>

                  <p className="mt-0.5 text-[13px] leading-5 text-slate-600">
                    {t("profilePhotoHelp")}
                  </p>

                  {isEditing && (
                    <div className="mt-3">
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
                        className={`${btnBase} border border-slate-200 bg-white text-emerald-950 ${
                          uploadingProfilePhoto
                            ? "cursor-not-allowed opacity-55"
                            : "hover:border-slate-300 hover:bg-slate-100"
                        }`}
                      >
                        {uploadingProfilePhoto ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4" />
                        )}

                        {uploadingProfilePhoto
                          ? t("uploading")
                          : profile?.profile_photo
                            ? t("changePhoto")
                            : t("uploadPhoto")}
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <dl className="grid gap-x-3 gap-y-2.5 rounded-md bg-slate-50 p-3.5 sm:grid-cols-2 lg:grid-cols-3">
                <div className="min-w-0">
                  <dt className={labelCaps}>{t("fullName")}</dt>

                  <dd className={`mt-0.5 text-[13px] font-medium ${wrap}`}>
                    {profile?.name || "-"}
                  </dd>
                </div>

                <div className="min-w-0">
                  <dt className={labelCaps}>{t("emailAddress")}</dt>

                  <dd className={`mt-0.5 text-[13px] font-medium ${wrap}`}>
                    {profile?.email || "-"}
                  </dd>
                </div>

                <div className="min-w-0">
                  <dt className={labelCaps}>{t("placementStatus")}</dt>

                  <dd className="mt-0.5">
                    <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-800">
                      {getPlacementStatusLabel(profile?.placement_status)}
                    </span>
                  </dd>
                </div>
              </dl>

              <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                <div>
                  <InputField
                    label={t("phoneNumber")}
                    name="phone"
                    value={formData.phone}
                    type="tel"
                    placeholder={t("phonePlaceholder")}
                    icon={<Phone />}
                    isEditing={isEditing}
                    error={getFieldError("phone")}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    autoComplete="tel"
                  />

                  {isFieldMissing("phone") && (
                    <MissingFieldMessage label={t("fieldRequiredForProfile")} />
                  )}
                </div>

                <div>
                  <InputField
                    label={t("address")}
                    name="address"
                    value={formData.address}
                    placeholder={t("addressPlaceholder")}
                    icon={<MapPin />}
                    isEditing={isEditing}
                    error={getFieldError("address")}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    autoComplete="street-address"
                  />

                  {isFieldMissing("address") && (
                    <MissingFieldMessage label={t("fieldRequiredForProfile")} />
                  )}
                </div>
              </div>

              <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                <InputField
                  label={t("dateOfBirth")}
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  type="date"
                  icon={<Cake />}
                  isEditing={isEditing}
                  error={getFieldError("date_of_birth")}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                />

                <SelectField
                  label={t("gender")}
                  name="gender"
                  value={formData.gender}
                  options={GENDERS[lang as keyof typeof GENDERS] || GENDERS.en}
                  placeholder={t("selectGender")}
                  icon={<Users />}
                  isEditing={isEditing}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                <div>
                  <SelectField
                    label={t("nationality")}
                    name="nationality"
                    value={formData.nationality}
                    options={
                      NATIONALITIES[lang as keyof typeof NATIONALITIES] ||
                      NATIONALITIES.en
                    }
                    placeholder={t("selectNationality")}
                    icon={<Flag />}
                    isEditing={isEditing}
                    onChange={handleInputChange}
                    required
                    error={getFieldError("nationality")}
                  />

                  {isFieldMissing("nationality") &&
                    !getFieldError("nationality") && (
                      <MissingFieldMessage label={t("fieldRequiredForProfile")} />
                    )}
                </div>

                <div>
                  <SelectField
                    label={t("japaneseLevel")}
                    name="japanese_level"
                    value={formData.japanese_level}
                    options={
                      JAPANESE_LEVELS[lang as keyof typeof JAPANESE_LEVELS] ||
                      JAPANESE_LEVELS.en
                    }
                    placeholder={t("selectJapaneseLevel")}
                    icon={<Languages />}
                    isEditing={isEditing}
                    onChange={handleInputChange}
                    required
                    error={getFieldError("japanese_level")}
                  />

                  {isFieldMissing("japanese_level") &&
                    !getFieldError("japanese_level") && (
                      <MissingFieldMessage label={t("fieldRequiredForProfile")} />
                    )}
                </div>
              </div>

              <SkillsField
                label={t("skills")}
                name="skills"
                value={formData.skills}
                placeholder={t("skillsPlaceholder")}
                icon={<BookLock />}
                maxLength={500}
                isEditing={isEditing}
                error={getFieldError("skills")}
                addSkillLabel={t("addSkill")}
                removeSkillLabel={(skill) => t("removeSkill", { skill })}
                onChange={(nextValue) =>
                  handleInputChange({
                    target: {
                      name: "skills",
                      value: nextValue,
                    },
                  } as React.ChangeEvent<HTMLInputElement>)
                }
              />
            </div>
          </section>

          {/* Education */}
          <section className={sectionCard}>
            <SectionHeader
              title={t("education")}
              icon={<GraduationCap />}
              description={t("educationDescription")}
            />

            {isFieldMissing("education") && (
              <RequiredNotice text={t("educationRequired")} />
            )}

            <div className="space-y-3">
              {!isEditing && education.length === 0 && (
                <EmptyBox text={t("noEducationRecords")} />
              )}

              {education.map((record, index) => (
                <div key={record._id || index} className={recordCard}>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => removeEducationRecord(index)}
                      aria-label={t("remove")}
                      className={`absolute right-2 top-2 grid h-8 w-8 cursor-pointer place-items-center rounded-md text-slate-400 transition hover:bg-red-50 hover:text-red-600 ${focusRing}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}

                  <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label className={`${fieldLabel} mb-1.5 ${isEditing ? "pr-8" : ""}`}>
                        {t("schoolName")}

                        <span className="text-red-600">*</span>
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
                          className={`${controlClass(true)} h-10 px-3`}
                        />
                      ) : (
                        <p className={readText}>{record.school || "-"}</p>
                      )}
                    </div>

                    <RecordDateField
                      label={t("enrollmentDate")}
                      value={record.enrollment_date}
                      isEditing={isEditing}
                      onChange={(value) =>
                        updateEducationRecord(index, "enrollment_date", value)
                      }
                    />

                    <RecordDateField
                      label={t("graduationDate")}
                      value={record.graduation_date}
                      isEditing={isEditing}
                      onChange={(value) =>
                        updateEducationRecord(index, "graduation_date", value)
                      }
                    />

                    <div>
                      <label className={`${fieldLabel} mb-1.5`}>
                        {t("schoolType")}
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
                          className={`${controlClass(true)} h-10 px-3`}
                        >
                          <option value="">{t("selectType")}</option>

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
                        <p className={readText}>{record.school_type || "-"}</p>
                      )}
                    </div>

                    <div>
                      <label className={`${fieldLabel} mb-1.5`}>
                        {t("major")}
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
                          className={`${controlClass(true)} h-10 px-3`}
                        />
                      ) : (
                        <p className={readText}>{record.major || "-"}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isEditing && (
                <button
                  type="button"
                  onClick={addEducationRecord}
                  className={`${dashedAction} ${dashedEnabled} w-full`}
                >
                  <Plus className="h-4 w-4" />

                  {t("addEducation")}
                </button>
              )}
            </div>
          </section>

          {/* Employment */}
          <section className={sectionCard}>
            <SectionHeader
              title={t("employmentHistory")}
              icon={<Building2 />}
              description={t("employmentHistoryDescription")}
            />

            <div className="space-y-3">
              {!isEditing && employmentHistory.length === 0 && (
                <EmptyBox text={t("noEmploymentRecords")} />
              )}

              {employmentHistory.map((record, index) => (
                <div key={record._id || index} className={recordCard}>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => removeEmploymentRecord(index)}
                      aria-label={t("remove")}
                      className={`absolute right-2 top-2 grid h-8 w-8 cursor-pointer place-items-center rounded-md text-slate-400 transition hover:bg-red-50 hover:text-red-600 ${focusRing}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}

                  <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label className={`${fieldLabel} mb-1.5 ${isEditing ? "pr-8" : ""}`}>
                        {t("companyName")}

                        <span className="text-red-600">*</span>
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
                          className={`${controlClass(true)} h-10 px-3`}
                        />
                      ) : (
                        <p className={readText}>{record.company_name || "-"}</p>
                      )}
                    </div>

                    <RecordDateField
                      label={t("startDate")}
                      value={record.start_date}
                      isEditing={isEditing}
                      onChange={(value) =>
                        updateEmploymentRecord(index, "start_date", value)
                      }
                    />

                    <RecordDateField
                      label={t("endDate")}
                      value={record.end_date}
                      isEditing={isEditing}
                      onChange={(value) =>
                        updateEmploymentRecord(index, "end_date", value)
                      }
                    />

                    <div>
                      <label className={`${fieldLabel} mb-1.5`}>
                        {t("employmentType")}
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
                          className={`${controlClass(true)} h-10 px-3`}
                        >
                          <option value="">{t("selectType")}</option>

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
                        <p className={readText}>
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
                  className={`${dashedAction} ${dashedEnabled} w-full`}
                >
                  <Plus className="h-4 w-4" />

                  {t("addEmployment")}
                </button>
              )}
            </div>
          </section>

          {/* Visa */}
          <section className={sectionCard}>
            <SectionHeader
              title={t("visaInformation")}
              icon={<BookLock />}
              description={t("visaInformationDescription")}
            />

            <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
              <div>
                <SelectField
                  label={t("visaType")}
                  name="visa_type"
                  value={formData.visa_type}
                  options={
                    VISA_TYPES[lang as keyof typeof VISA_TYPES] || VISA_TYPES.en
                  }
                  placeholder={t("selectVisaType")}
                  icon={<Globe />}
                  isEditing={isEditing}
                  onChange={handleInputChange}
                  required
                  error={getFieldError("visa_type")}
                />

                {isFieldMissing("visa_type") && !getFieldError("visa_type") && (
                  <MissingFieldMessage label={t("fieldRequiredForProfile")} />
                )}
              </div>

              <InputField
                label={t("visaExpiryDate")}
                name="visa_expiry_date"
                value={formData.visa_expiry_date}
                type="date"
                icon={<Calendar />}
                isEditing={isEditing}
                error={getFieldError("visa_expiry_date")}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
            </div>
          </section>

          {/* Job preferences */}
          <section className={sectionCard}>
            <SectionHeader
              title={t("jobPreferences")}
              icon={<Briefcase />}
              description={t("jobPreferencesDescription")}
            />

            <div className="space-y-4">
              <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                <div>
                  <InputField
                    label={t("desiredJob")}
                    name="desired_job"
                    value={formData.desired_job}
                    placeholder={t("desiredJobPlaceholder")}
                    icon={<Briefcase />}
                    isEditing={isEditing}
                    error={getFieldError("desired_job")}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    required
                  />

                  {isFieldMissing("desired_job") && (
                    <MissingFieldMessage label={t("fieldRequiredForProfile")} />
                  )}
                </div>

                <div>
                  <InputField
                    label={t("desiredLocation")}
                    name="desired_location"
                    value={formData.desired_location}
                    placeholder={t("desiredLocationPlaceholder")}
                    icon={<MapPinIcon />}
                    isEditing={isEditing}
                    error={getFieldError("desired_location")}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    required
                  />

                  {isFieldMissing("desired_location") && (
                    <MissingFieldMessage label={t("fieldRequiredForProfile")} />
                  )}
                </div>
              </div>

              <div className="md:max-w-[calc(50%-0.5rem)]">
                <InputField
                  label={t("availableFrom")}
                  name="available_from"
                  value={formData.available_from}
                  type="date"
                  icon={<Clock />}
                  isEditing={isEditing}
                  error={getFieldError("available_from")}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                />

                {isFieldMissing("available_from") && (
                  <MissingFieldMessage label={t("fieldRequiredForProfile")} />
                )}
              </div>
            </div>
          </section>

          {/* Resume */}
          <section className={sectionCard}>
            <SectionHeader
              title={t("resume")}
              icon={<FileText />}
              description={t("resumeDescription")}
            />

            {isFieldMissing("resume_file") && (
              <RequiredNotice text={t("resumeRequired")} />
            )}

            <div className="space-y-3">
              {profile?.resume_file && (
                <div className="flex items-center justify-between gap-3 rounded-md bg-slate-50 p-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <FileText className="h-4 w-4 shrink-0 text-slate-500" />

                    <span className={`text-[13px] text-slate-700 ${wrap}`}>
                      {getDisplayFileName(profile.resume_file, "Resume/CV")}
                    </span>
                  </div>

                  <a
                    href={getFileUrl(profile.resume_file)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`shrink-0 rounded text-[13px] font-medium text-emerald-700 underline-offset-2 hover:text-emerald-900 hover:underline ${focusRing}`}
                  >
                    {t("view")}
                  </a>
                </div>
              )}

              <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-start gap-2.5">
                    <FileText className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />

                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-emerald-950">
                        {t("autoGeneratedResume")}
                      </p>

                      <p className="mt-0.5 truncate text-xs leading-5 text-emerald-900/80">
                        {generatedResumeName || t("notGeneratedYet")}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                    {profile?.generated_resume_file && (
                      <button
                        type="button"
                        onClick={() => void handleViewGeneratedResume()}
                        disabled={viewingGeneratedResume}
                        className={btnTinted}
                      >
                        {viewingGeneratedResume && (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        )}
                        {t("view")}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => void handleGenerateResume()}
                      disabled={generatingResume}
                      className={btnPrimary}
                    >
                      {generatingResume ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <FileText className="h-4 w-4" />
                      )}

                      {generatingResume
                        ? t("generating")
                        : profile?.generated_resume_file
                          ? t("regenerate")
                          : t("generate")}
                    </button>
                  </div>
                </div>
              </div>

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
                    className={`${dashedAction} ${
                      uploadingResume ? dashedDisabled : dashedEnabled
                    }`}
                  >
                    {uploadingResume ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}

                    {uploadingResume ? t("uploading") : t("uploadNewResume")}
                  </label>

                  <p className="mt-1.5 text-xs text-slate-500">
                    {t("resumeFormatHelp")}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Additional Documents */}
          <section className={sectionCard}>
            <SectionHeader
              title={t("additionalDocuments")}
              icon={<FileText />}
              description={t("additionalDocumentsDescription")}
            />

            <div className="space-y-3">
              {profile?.other_documents?.length ? (
                profile.other_documents.map((document) => (
                  <div
                    key={document._id || document.file_url}
                    className="flex flex-col gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        aria-hidden
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-slate-200 bg-white text-emerald-700"
                      >
                        <FileText className="h-4 w-4" />
                      </span>

                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-semibold">
                          {document.name}
                        </p>

                        <p className="mt-0.5 truncate text-xs text-slate-500">
                          {document.document_type || "other"}
                          {" Â· "}
                          {getDisplayFileName(document.file_url, t("document"))}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <a
                        href={getFileUrl(document.file_url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={btnSecondary}
                      >
                        {t("view")}
                      </a>

                      {isEditing && document._id && (
                        <button
                          type="button"
                          onClick={() => handleRemoveDocument(document)}
                          disabled={removingDocumentId === document._id}
                          className={btnDanger}
                        >
                          {removingDocumentId === document._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}

                          {t("remove")}
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <EmptyBox
                  text={t("noAdditionalDocuments")}
                  icon={<FileText className="h-4 w-4" />}
                />
              )}

              {isEditing && (
                <div className="rounded-md border border-slate-200 bg-slate-50 p-3.5">
                  <h3 className="text-[13px] font-semibold">
                    {t("addDocument")}
                  </h3>

                  <div className="mt-3 grid gap-3 sm:gap-4 md:grid-cols-2">
                    <div>
                      <label className={`${fieldLabel} mb-1.5`}>
                        {t("documentName")}
                      </label>

                      <input
                        type="text"
                        value={documentName}
                        onChange={(event) => setDocumentName(event.target.value)}
                        placeholder={t("documentNamePlaceholder")}
                        className={`${controlClass(true)} h-10 px-3`}
                      />
                    </div>

                    <div>
                      <label className={`${fieldLabel} mb-1.5`}>
                        {t("documentType")}
                      </label>

                      <select
                        value={documentType}
                        onChange={(event) => setDocumentType(event.target.value)}
                        className={`${controlClass(true)} h-10 px-3`}
                      >
                        <option value="passport">
                          {t("documentTypePassport")}
                        </option>
                        <option value="residence_card">
                          {t("documentTypeResidenceCard")}
                        </option>
                        <option value="visa">{t("documentTypeVisa")}</option>
                        <option value="certificate">
                          {t("documentTypeCertificate")}
                        </option>
                        <option value="jlpt">{t("documentTypeJlpt")}</option>
                        <option value="education">
                          {t("documentTypeEducation")}
                        </option>
                        <option value="other">{t("documentTypeOther")}</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-3">
                    <input
                      ref={documentInputRef}
                      id="other-document-upload"
                      type="file"
                      accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx"
                      disabled={uploadingDocument}
                      className="hidden"
                      onChange={(event) => {
                        setSelectedDocumentFile(event.target.files?.[0] || null);
                      }}
                    />

                    <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
                      <label
                        htmlFor="other-document-upload"
                        className={`${dashedAction} ${
                          uploadingDocument ? dashedDisabled : dashedEnabled
                        }`}
                      >
                        <Upload className="h-4 w-4" />

                        {selectedDocumentFile
                          ? t("chooseAnotherFile")
                          : t("chooseFile")}
                      </label>

                      {selectedDocumentFile && (
                        <p className="min-w-0 truncate text-[13px] text-slate-600">
                          {selectedDocumentFile.name}
                        </p>
                      )}
                    </div>

                    <p className="mt-1.5 text-xs text-slate-500">
                      {t("documentFormatHelp")}
                    </p>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={uploadSelectedDocument}
                      disabled={uploadingDocument}
                      className={`${btnPrimary} w-full sm:w-auto`}
                    >
                      {uploadingDocument ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}

                      {uploadingDocument ? t("uploading") : t("uploadDocument")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Notes */}
          <section className={sectionCard}>
            <SectionHeader
              title={t("additionalNotes")}
              icon={<FileText />}
            />

            <InputField
              label={t("otherInformation")}
              name="notes"
              value={formData.notes}
              rows={4}
              placeholder={t("otherInformationPlaceholder")}
              isEditing={isEditing}
              error={getFieldError("notes")}
              onChange={handleInputChange}
              onBlur={handleBlur}
              maxLength={500}
            />
          </section>
        </div>
      </main>
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
    <div className="space-y-1.5">
      <label htmlFor={name} className={fieldLabel}>
        {icon && (
          <span aria-hidden className="text-slate-400 [&>svg]:h-4 [&>svg]:w-4">
            {icon}
          </span>
        )}

        {label}

        {required && <span className="text-red-600">*</span>}
      </label>

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={!isEditing}
        aria-invalid={Boolean(error)}
        className={`${controlClass(isEditing, error)} h-10 px-3`}
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

function MissingFieldMessage({ label }: { label: string }) {
  return (
    <p className="mt-1.5 flex items-center gap-1 text-xs text-amber-700">
      <AlertCircle className="h-3 w-3 shrink-0" />

      {label}
    </p>
  );
}

function RequiredNotice({ text }: { text: string }) {
  return (
    <div className="mb-3 flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2.5 text-[13px] text-amber-900">
      <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />

      <p>{text}</p>
    </div>
  );
}

function EmptyBox({ text, icon }: { text: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
      <span
        aria-hidden
        className="mx-auto grid h-9 w-9 place-items-center rounded-full bg-emerald-50 text-emerald-700 [&>svg]:h-4 [&>svg]:w-4"
      >
        {icon || <Plus />}
      </span>

      <p className="mx-auto mt-2 max-w-sm text-[13px] leading-5 text-slate-600">
        {text}
      </p>
    </div>
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
      <label className={`${fieldLabel} mb-1.5`}>{label}</label>

      {isEditing ? (
        <input
          type="date"
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
          className={`${controlClass(true)} h-10 px-3`}
        />
      ) : (
        <p className={readText}>{value || "-"}</p>
      )}
    </div>
  );
}
