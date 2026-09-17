"use client";

import { type FormEvent, useEffect, useState } from "react";

import axios from "axios";
import toast from "react-hot-toast";

import { BriefcaseBusiness, Loader2, X } from "lucide-react";

import { createProviderPlacementRequest } from "./api";

import { getProviderProfile } from "../Profile/api";

import type { ApiErrorResponse, CreatePlacementRequestPayload } from "./types";

// ======================================================
// OPTIONS
// ======================================================

const EMPLOYMENT_TYPES = [
  "Full-time Employee",
  "Contract Employee",
  "Temporary Staff",
  "Part-time",
  "Freelance/Contract",
  "Intern",
];

const JAPANESE_LEVELS = [
  "Native",
  "N1",
  "N2",
  "N3",
  "N4",
  "N5",
  "Not Required",
];

const VISA_TYPES = [
  "Engineer / Specialist in Humanities / International Services",
  "Specified Skilled Worker",
  "Permanent Resident",
  "Spouse of Japanese National",
  "Long-Term Resident",
  "Student",
  "Dependent",
  "Any Visa",
];

const SALARY_TYPES = ["Hourly", "Daily", "Monthly", "Annual"];

// ======================================================
// INITIAL FORM
// ======================================================

const createInitialForm = (): CreatePlacementRequestPayload => ({
  job_title: "",

  job_category: "",

  employment_type: "",

  number_of_positions: 1,

  work_location: "",

  job_description: "",

  requirements: "",

  japanese_level_required: "",

  visa_type_required: "",

  salary_type: "Monthly",

  salary_amount: 0,

  working_hours: "",

  days_off: "",

  start_date: "",
});

// ======================================================
// PROPS
// ======================================================

type PlacementRequestModalProps = {
  open: boolean;

  onClose: () => void;

  onSuccess: () => void | Promise<void>;

  lang: string;
};

// ======================================================
// COMPONENT
// ======================================================

export default function PlacementRequestModal({
  open,
  onClose,
  onSuccess,
  lang,
}: PlacementRequestModalProps) {
  const [form, setForm] =
    useState<CreatePlacementRequestPayload>(createInitialForm());

  const [companyName, setCompanyName] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const [loadingProfile, setLoadingProfile] = useState(false);

  // ======================================================
  // LOAD PROVIDER PROFILE
  // ======================================================

  useEffect(() => {
    if (!open) {
      return;
    }

    const loadProviderProfile = async () => {
      try {
        setLoadingProfile(true);

        const response = await getProviderProfile();

        setCompanyName(response.profile.companyName || "");
      } catch (error: unknown) {
        console.error("Placement request provider profile error:", error);
      } finally {
        setLoadingProfile(false);
      }
    };

    void loadProviderProfile();
  }, [open]);

  // ======================================================
  // UPDATE FIELD
  // ======================================================

  const updateField = <K extends keyof CreatePlacementRequestPayload>(
    field: K,
    value: CreatePlacementRequestPayload[K],
  ) => {
    setForm((previous) => ({
      ...previous,

      [field]: value,
    }));
  };

  // ======================================================
  // RESET
  // ======================================================

  const resetForm = () => {
    setForm(createInitialForm());
  };

  // ======================================================
  // CLOSE
  // ======================================================

  const handleClose = () => {
    if (submitting) {
      return;
    }

    resetForm();

    onClose();
  };

  // ======================================================
  // VALIDATION
  // ======================================================

  const validateForm = () => {
    if (!form.job_title.trim()) {
      return lang === "ja"
        ? "職種を入力してください。"
        : "Job title is required.";
    }

    if (!form.employment_type) {
      return lang === "ja"
        ? "雇用形態を選択してください。"
        : "Employment type is required.";
    }

    if (form.number_of_positions < 1) {
      return lang === "ja"
        ? "募集人数は1名以上必要です。"
        : "Number of positions must be at least 1.";
    }

    if (!form.work_location.trim()) {
      return lang === "ja"
        ? "勤務地を入力してください。"
        : "Work location is required.";
    }

    if (!form.job_description.trim()) {
      return lang === "ja"
        ? "仕事内容を入力してください。"
        : "Job description is required.";
    }

    if (form.salary_amount < 0) {
      return lang === "ja"
        ? "給与額を確認してください。"
        : "Salary amount cannot be negative.";
    }

    return null;
  };

  // ======================================================
  // SUBMIT
  // ======================================================

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      toast.error(validationError);

      return;
    }

    try {
      setSubmitting(true);

      const response = await createProviderPlacementRequest(form);

      toast.success(
        response.message ||
          (lang === "ja"
            ? "採用依頼を作成しました。"
            : "Placement request created successfully."),
      );

      resetForm();

      await onSuccess();

      onClose();
    } catch (error: unknown) {
      console.error("Create placement request error:", error);

      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        toast.error(
          error.response?.data?.message ||
            (lang === "ja"
              ? "採用依頼の作成に失敗しました。"
              : "Failed to create placement request."),
        );

        return;
      }

      toast.error(
        lang === "ja"
          ? "採用依頼の作成に失敗しました。"
          : "Failed to create placement request.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ======================================================
  // DO NOT RENDER WHEN CLOSED
  // ======================================================

  if (!open) {
    return null;
  }

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:p-4">
      {/* ================================================= */}
      {/* BACKDROP */}
      {/* ================================================= */}

      <button
        type="button"
        aria-label="Close placement request modal"
        onClick={handleClose}
        className="absolute inset-0"
      />

      {/* ================================================= */}
      {/* MODAL */}
      {/* ================================================= */}

      <div className="relative z-10 h-full w-full overflow-y-auto bg-white sm:max-h-[95vh] sm:max-w-5xl sm:rounded-3xl sm:shadow-2xl">
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
              <BriefcaseBusiness className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                {lang === "ja" ? "採用依頼" : "Placement Request"}
              </p>

              {companyName && (
                <p className="mt-1 text-xs text-slate-400">{companyName}</p>
              )}
            </div>
          </div>

          <button
            type="button"
            disabled={submitting}
            onClick={handleClose}
            className="cursor-pointer rounded-full p-2 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {/* ================================================= */}
        {/* INTRO */}
        {/* ================================================= */}

        <div className="border-b border-slate-200 px-5 py-7 sm:px-8">
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-indigo-600">
            Recruitment Request Form
          </span>

          <h2 className="mt-4 text-3xl font-bold text-slate-950">
            {lang === "ja" ? "新しい採用依頼" : "New Placement Request"}
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            {lang === "ja"
              ? "希望する人材の条件を入力してください。管理者が内容を確認し、候補者の紹介を行います。"
              : "Tell Admin what kind of candidate your company needs. This request is used for candidate sourcing and placement support."}
          </p>
        </div>

        {/* ================================================= */}
        {/* PROFILE LOADING */}
        {/* ================================================= */}

        {loadingProfile ? (
          <div className="flex min-h-[450px] items-center justify-center">
            <div className="text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-slate-400" />

              <p className="mt-3 text-sm text-slate-500">
                {lang === "ja"
                  ? "会社情報を読み込み中..."
                  : "Loading company information..."}
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-8">
            {/* ================================================= */}
            {/* COMPANY */}
            {/* ================================================= */}

            <FormSection
              title={lang === "ja" ? "会社情報" : "Company Information"}
            >
              <InputField
                label={lang === "ja" ? "会社名" : "Company Name"}
                value={companyName}
                disabled
                onChange={() => {
                  // Company comes from authenticated Provider.
                }}
              />

              <p className="mt-2 text-xs text-slate-500">
                {lang === "ja"
                  ? "会社はログイン中のプロバイダーから自動的に設定されます。"
                  : "The company is automatically determined from the logged-in Provider account."}
              </p>
            </FormSection>

            {/* ================================================= */}
            {/* POSITION */}
            {/* ================================================= */}

            <FormSection
              title={lang === "ja" ? "募集内容" : "Position"}
              description={
                lang === "ja"
                  ? "必要な職種と募集人数を入力してください。"
                  : "Describe the position and number of candidates required."
              }
            >
              <div className="grid gap-5 md:grid-cols-2">
                <InputField
                  label={lang === "ja" ? "職種" : "Job Title"}
                  required
                  value={form.job_title}
                  placeholder="e.g. Software Engineer"
                  onChange={(value) => updateField("job_title", value)}
                />

                <InputField
                  label={lang === "ja" ? "職種カテゴリー" : "Job Category"}
                  value={form.job_category}
                  placeholder="e.g. IT / Engineering"
                  onChange={(value) => updateField("job_category", value)}
                />

                <SelectField
                  label={lang === "ja" ? "雇用形態" : "Employment Type"}
                  required
                  value={form.employment_type}
                  options={EMPLOYMENT_TYPES}
                  onChange={(value) => updateField("employment_type", value)}
                />

                <InputField
                  label={lang === "ja" ? "募集人数" : "Number of Positions"}
                  required
                  type="number"
                  min={1}
                  value={String(form.number_of_positions)}
                  onChange={(value) =>
                    updateField(
                      "number_of_positions",
                      Math.max(1, Number(value) || 1),
                    )
                  }
                />
              </div>
            </FormSection>

            {/* ================================================= */}
            {/* JOB INFORMATION */}
            {/* ================================================= */}

            <FormSection
              title={
                lang === "ja" ? "仕事内容・勤務地" : "Job Details & Location"
              }
            >
              <InputField
                label={lang === "ja" ? "勤務地" : "Work Location"}
                required
                value={form.work_location}
                placeholder="e.g. Tokyo"
                onChange={(value) => updateField("work_location", value)}
              />

              <div className="mt-5">
                <TextareaField
                  label={lang === "ja" ? "仕事内容" : "Job Description"}
                  required
                  value={form.job_description}
                  placeholder="Describe the role, responsibilities and expected work..."
                  onChange={(value) => updateField("job_description", value)}
                />
              </div>

              <div className="mt-5">
                <TextareaField
                  label={lang === "ja" ? "応募条件・必要経験" : "Requirements"}
                  value={form.requirements}
                  placeholder="Experience, education, certifications, technical skills..."
                  onChange={(value) => updateField("requirements", value)}
                />
              </div>
            </FormSection>

            {/* ================================================= */}
            {/* CANDIDATE REQUIREMENTS */}
            {/* ================================================= */}

            <FormSection
              title={lang === "ja" ? "候補者条件" : "Candidate Requirements"}
              description={
                lang === "ja"
                  ? "紹介する候補者に必要な条件です。"
                  : "Requirements Admin should use when sourcing candidates."
              }
            >
              <div className="grid gap-5 md:grid-cols-2">
                <SelectField
                  label={
                    lang === "ja"
                      ? "必要な日本語レベル"
                      : "Japanese Level Required"
                  }
                  value={form.japanese_level_required}
                  options={JAPANESE_LEVELS}
                  onChange={(value) =>
                    updateField("japanese_level_required", value)
                  }
                />

                <SelectField
                  label={
                    lang === "ja" ? "必要な在留資格" : "Visa Type Required"
                  }
                  value={form.visa_type_required}
                  options={VISA_TYPES}
                  onChange={(value) => updateField("visa_type_required", value)}
                />
              </div>
            </FormSection>

            {/* ================================================= */}
            {/* SALARY */}
            {/* ================================================= */}

            <FormSection title={lang === "ja" ? "給与" : "Salary"}>
              <div className="grid gap-5 md:grid-cols-2">
                <SelectField
                  label={lang === "ja" ? "給与形態" : "Salary Type"}
                  value={form.salary_type}
                  options={SALARY_TYPES}
                  onChange={(value) => updateField("salary_type", value)}
                />

                <InputField
                  label={lang === "ja" ? "給与額" : "Salary Amount"}
                  type="number"
                  min={0}
                  value={
                    form.salary_amount === 0 ? "" : String(form.salary_amount)
                  }
                  placeholder="e.g. 300000"
                  onChange={(value) =>
                    updateField("salary_amount", Number(value) || 0)
                  }
                />
              </div>

              <p className="mt-3 text-xs text-slate-500">
                {lang === "ja"
                  ? "例：月給 300,000 円の場合、Monthly と 300000 を入力します。"
                  : "Example: for ¥300,000 per month, choose Monthly and enter 300000."}
              </p>
            </FormSection>

            {/* ================================================= */}
            {/* WORK CONDITIONS */}
            {/* ================================================= */}

            <FormSection title={lang === "ja" ? "勤務条件" : "Work Conditions"}>
              <div className="grid gap-5 md:grid-cols-2">
                <InputField
                  label={lang === "ja" ? "勤務時間" : "Working Hours"}
                  value={form.working_hours}
                  placeholder="e.g. 9:00 - 18:00"
                  onChange={(value) => updateField("working_hours", value)}
                />

                <InputField
                  label={lang === "ja" ? "休日" : "Days Off"}
                  value={form.days_off}
                  placeholder="e.g. Saturday, Sunday and public holidays"
                  onChange={(value) => updateField("days_off", value)}
                />

                <InputField
                  label={lang === "ja" ? "勤務開始日" : "Start Date"}
                  type="date"
                  value={form.start_date}
                  onChange={(value) => updateField("start_date", value)}
                />
              </div>
            </FormSection>

            {/* ================================================= */}
            {/* IMPORTANT INFORMATION */}
            {/* ================================================= */}

            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
              <p className="font-semibold text-blue-900">
                {lang === "ja"
                  ? "求人掲載との違い"
                  : "Placement Request vs Vacancy"}
              </p>

              <p className="mt-2 text-sm leading-6 text-blue-800">
                {lang === "ja"
                  ? "これは公開求人ではありません。会社が管理者に対して、条件に合う候補者の紹介を依頼するための採用依頼です。"
                  : "This is not a public job vacancy. It is a request for Admin to source and recommend suitable candidates directly to your company."}
              </p>
            </div>

            {/* ================================================= */}
            {/* FOOTER */}
            {/* ================================================= */}

            <div className="flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-xl text-xs leading-5 text-slate-500">
                {lang === "ja"
                  ? "最初は下書きとして保存されます。次に管理者審査へ送信します。"
                  : "The request will first be created as a draft. You can then submit it for Admin review."}
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={resetForm}
                  className="cursor-pointer rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  {lang === "ja" ? "リセット" : "Reset"}
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}

                  {submitting
                    ? lang === "ja"
                      ? "作成中..."
                      : "Creating..."
                    : lang === "ja"
                      ? "採用依頼を作成"
                      : "Create Placement Request"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ======================================================
// FORM SECTION
// ======================================================

function FormSection({
  title,
  description,
  children,
}: {
  title: string;

  description?: string;

  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-slate-50/40 p-5 sm:p-6">
      <div className="mb-5 border-b border-slate-200 pb-4">
        <h3 className="text-lg font-semibold text-slate-950">{title}</h3>

        {description && (
          <p className="mt-1 text-xs text-slate-500">{description}</p>
        )}
      </div>

      {children}
    </section>
  );
}

// ======================================================
// INPUT FIELD
// ======================================================

type InputFieldProps = {
  label: string;

  value: string;

  onChange: (value: string) => void;

  placeholder?: string;

  type?: React.HTMLInputTypeAttribute;

  required?: boolean;

  disabled?: boolean;

  min?: number;
};

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  disabled = false,
  min,
}: InputFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}

        {required && (
          <span className="ml-2 rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-red-600">
            Required
          </span>
        )}
      </span>

      <input
        type={type}
        value={value}
        min={min}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
      />
    </label>
  );
}

// ======================================================
// TEXTAREA FIELD
// ======================================================

function TextareaField({
  label,
  value,
  onChange,
  placeholder,
  required = false,
}: {
  label: string;

  value: string;

  onChange: (value: string) => void;

  placeholder?: string;

  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}

        {required && (
          <span className="ml-2 rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-red-600">
            Required
          </span>
        )}
      </span>

      <textarea
        rows={4}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}

// ======================================================
// SELECT FIELD
// ======================================================

function SelectField({
  label,
  value,
  options,
  onChange,
  required = false,
}: {
  label: string;

  value: string;

  options: string[];

  onChange: (value: string) => void;

  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}

        {required && (
          <span className="ml-2 rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-red-600">
            Required
          </span>
        )}
      </span>

      <select
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      >
        <option value="">Please select</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
