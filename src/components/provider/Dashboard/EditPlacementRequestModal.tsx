"use client";

import { type FormEvent, useState } from "react";

import { Loader2, Save, X } from "lucide-react";

import type { CreatePlacementRequestPayload, PlacementRequest } from "./types";

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
// PROPS
// ======================================================

type Props = {
  open: boolean;

  request: PlacementRequest | null;

  loading: boolean;

  lang: string;

  onClose: () => void;

  onSubmit: (payload: CreatePlacementRequestPayload) => void | Promise<void>;
};

// ======================================================
// OUTER COMPONENT
// ======================================================
//
// IMPORTANT:
//
// We do NOT use useEffect() to copy request data into
// form state.
//
// The form component is created only when:
// - modal is open
// - request exists
//
// The key causes React to create a fresh form whenever
// another placement request is opened.
//
// ======================================================

export default function EditPlacementRequestModal({
  open,
  request,
  loading,
  lang,
  onClose,
  onSubmit,
}: Props) {
  if (!open || !request) {
    return null;
  }

  return (
    <PlacementRequestEditForm
      key={`${request.recruitId}-${request.updatedAt ?? ""}`}
      request={request}
      loading={loading}
      lang={lang}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
}

// ======================================================
// INNER FORM
// ======================================================

type FormProps = {
  request: PlacementRequest;

  loading: boolean;

  lang: string;

  onClose: () => void;

  onSubmit: (payload: CreatePlacementRequestPayload) => void | Promise<void>;
};

function PlacementRequestEditForm({
  request,
  loading,
  lang,
  onClose,
  onSubmit,
}: FormProps) {
  // ====================================================
  // INITIAL FORM
  // ====================================================

  const [form, setForm] = useState<CreatePlacementRequestPayload>(() => ({
    job_title: request.job_title,

    job_category: request.job_category,

    employment_type: request.employment_type,

    number_of_positions: request.number_of_positions,

    work_location: request.work_location,

    job_description: request.job_description,

    requirements: request.requirements,

    japanese_level_required: request.japanese_level_required,

    visa_type_required: request.visa_type_required,

    salary_type: request.salary_type,

    salary_amount: request.salary_amount,

    working_hours: request.working_hours,

    days_off: request.days_off,

    start_date: request.start_date,
  }));

  // ====================================================
  // UPDATE FIELD
  // ====================================================

  const updateField = <K extends keyof CreatePlacementRequestPayload>(
    field: K,
    value: CreatePlacementRequestPayload[K],
  ) => {
    setForm((previous) => ({
      ...previous,

      [field]: value,
    }));
  };

  // ====================================================
  // VALIDATION
  // ====================================================

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

  // ====================================================
  // SUBMIT
  // ====================================================

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      window.alert(validationError);

      return;
    }

    await onSubmit(form);
  };

  // ====================================================
  // UI
  // ====================================================

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      {/* BACKDROP */}

      <button
        type="button"
        aria-label="Close"
        onClick={() => {
          if (!loading) {
            onClose();
          }
        }}
        className="absolute inset-0"
      />

      {/* MODAL */}

      <div className="relative z-10 max-h-[94vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <header className="sticky top-0 z-20 flex items-start justify-between border-b border-slate-200 bg-white px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              {request.recruitId}
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-950">
              {lang === "ja" ? "採用依頼を編集" : "Edit Placement Request"}
            </h2>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="rounded-full p-2 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {/* ================================================= */}
        {/* FORM */}
        {/* ================================================= */}

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* =============================================== */}
          {/* POSITION */}
          {/* =============================================== */}

          <FormSection title={lang === "ja" ? "募集内容" : "Position"}>
            <div className="grid gap-5 md:grid-cols-2">
              <Input
                label={lang === "ja" ? "職種" : "Job Title"}
                required
                value={form.job_title}
                onChange={(value) => updateField("job_title", value)}
              />

              <Input
                label={lang === "ja" ? "職種カテゴリー" : "Job Category"}
                value={form.job_category}
                onChange={(value) => updateField("job_category", value)}
              />

              <Select
                label={lang === "ja" ? "雇用形態" : "Employment Type"}
                value={form.employment_type}
                options={EMPLOYMENT_TYPES}
                onChange={(value) => updateField("employment_type", value)}
              />

              <Input
                label={lang === "ja" ? "募集人数" : "Number of Positions"}
                type="number"
                required
                min={1}
                value={String(form.number_of_positions)}
                onChange={(value) =>
                  updateField(
                    "number_of_positions",
                    Math.max(1, Number(value) || 1),
                  )
                }
              />

              <Input
                label={lang === "ja" ? "勤務地" : "Work Location"}
                required
                value={form.work_location}
                onChange={(value) => updateField("work_location", value)}
              />
            </div>
          </FormSection>

          {/* =============================================== */}
          {/* CANDIDATE REQUIREMENTS */}
          {/* =============================================== */}

          <FormSection
            title={lang === "ja" ? "候補者条件" : "Candidate Requirements"}
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Select
                label={lang === "ja" ? "日本語レベル" : "Japanese Level"}
                value={form.japanese_level_required}
                options={JAPANESE_LEVELS}
                onChange={(value) =>
                  updateField("japanese_level_required", value)
                }
              />

              <Select
                label={lang === "ja" ? "必要な在留資格" : "Visa Type"}
                value={form.visa_type_required}
                options={VISA_TYPES}
                onChange={(value) => updateField("visa_type_required", value)}
              />
            </div>
          </FormSection>

          {/* =============================================== */}
          {/* SALARY / WORK CONDITIONS */}
          {/* =============================================== */}

          <FormSection
            title={
              lang === "ja" ? "給与・勤務条件" : "Salary & Work Conditions"
            }
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Select
                label={lang === "ja" ? "給与形態" : "Salary Type"}
                value={form.salary_type}
                options={SALARY_TYPES}
                onChange={(value) => updateField("salary_type", value)}
              />

              <Input
                label={lang === "ja" ? "給与額" : "Salary Amount"}
                type="number"
                min={0}
                value={String(form.salary_amount)}
                onChange={(value) =>
                  updateField("salary_amount", Math.max(0, Number(value) || 0))
                }
              />

              <Input
                label={lang === "ja" ? "勤務時間" : "Working Hours"}
                value={form.working_hours}
                onChange={(value) => updateField("working_hours", value)}
              />

              <Input
                label={lang === "ja" ? "休日" : "Days Off"}
                value={form.days_off}
                onChange={(value) => updateField("days_off", value)}
              />

              <Input
                label={lang === "ja" ? "勤務開始日" : "Start Date"}
                type="date"
                value={form.start_date}
                onChange={(value) => updateField("start_date", value)}
              />
            </div>
          </FormSection>

          {/* =============================================== */}
          {/* JOB DETAILS */}
          {/* =============================================== */}

          <FormSection title={lang === "ja" ? "仕事内容" : "Job Information"}>
            <Textarea
              label={lang === "ja" ? "仕事内容" : "Job Description"}
              required
              value={form.job_description}
              onChange={(value) => updateField("job_description", value)}
            />

            <div className="mt-5">
              <Textarea
                label={lang === "ja" ? "応募条件" : "Requirements"}
                value={form.requirements}
                onChange={(value) => updateField("requirements", value)}
              />
            </div>
          </FormSection>

          {/* =============================================== */}
          {/* REJECTION REASON */}
          {/* =============================================== */}

          {request.status === "rejected" && request.rejection_reason && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
              <p className="text-sm font-semibold text-red-700">
                {lang === "ja"
                  ? "管理者からの却下理由"
                  : "Admin Rejection Reason"}
              </p>

              <p className="mt-2 whitespace-pre-wrap text-sm text-red-700">
                {request.rejection_reason}
              </p>

              <p className="mt-3 text-xs text-red-600">
                {lang === "ja"
                  ? "内容を修正して保存した後、再度審査へ送信できます。"
                  : "Update the request, save your changes, then resubmit it for Admin review."}
              </p>
            </div>
          )}

          {/* =============================================== */}
          {/* FOOTER */}
          {/* =============================================== */}

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              {lang === "ja" ? "キャンセル" : "Cancel"}
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}

              {lang === "ja" ? "変更を保存" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ======================================================
// FORM SECTION
// ======================================================

function FormSection({
  title,
  children,
}: {
  title: string;

  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="mb-4 font-semibold text-slate-900">{title}</h3>

      {children}
    </section>
  );
}

// ======================================================
// INPUT
// ======================================================

function Input({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  min,
}: {
  label: string;

  value: string;

  onChange: (value: string) => void;

  type?: React.HTMLInputTypeAttribute;

  required?: boolean;

  min?: number;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </span>

      <input
        type={type}
        min={min}
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}

// ======================================================
// SELECT
// ======================================================

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;

  value: string;

  options: string[];

  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
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

// ======================================================
// TEXTAREA
// ======================================================

function Textarea({
  label,
  value,
  onChange,
  required = false,
}: {
  label: string;

  value: string;

  onChange: (value: string) => void;

  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </span>

      <textarea
        rows={4}
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}
