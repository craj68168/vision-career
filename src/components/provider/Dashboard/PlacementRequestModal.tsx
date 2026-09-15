"use client";

import { useEffect, useState } from "react";

import axios from "axios";
import toast from "react-hot-toast";

import { Loader2, X } from "lucide-react";

import { createProviderVacancy } from "./api";

import { getProviderProfile } from "../Profile/api";

import type { ApiErrorResponse, CreateVacancyPayload } from "./types";

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
  "N1 (Business level)",
  "N2 (Daily conversation level)",
  "N3 (Basic conversation level)",
  "N4 or below (Not required)",
];

const REMOTE_WORK_OPTIONS = [
  "Fully remote",
  "2-3 days in office per week",
  "Primarily in-office (remote possible depending on situation)",
  "No remote work",
];

const BENEFITS = [
  "Full social insurance",
  "Commuting allowance",
  "Housing allowance",
  "Family allowance",
  "Certification support",
  "Employee cafeteria",
  "On-site daycare",
  "Refresh vacation",
];

const INSURANCE = [
  "Health insurance",
  "Employees' pension insurance",
  "Employment insurance",
  "Workers' compensation insurance",
];

// ======================================================
// INITIAL FORM
// ======================================================

const createInitialForm = (): CreateVacancyPayload => ({
  companyName: "",
  companyNameKana: "",

  title: "",
  titleKana: "",

  employmentType: "",
  numberOfPeople: 1,

  jobDescription: "",
  responsibilities: "",

  requiredSkills: "",
  preferredSkills: "",

  requiredEducation: "",
  requiredExperience: "",

  japaneseLevel: "",

  workLocation: "",
  workLocationDetail: "",

  remoteWork: "",

  salaryMin: null,
  salaryMax: null,

  salaryNote: "",

  workHours: "9:00 - 18:00",
  breakTime: "12:00 - 13:00",

  overtime: "",

  holidays:
    "Weekends and public holidays, summer vacation, and year-end/New Year holidays",

  benefits: [],
  insurance: [],

  trialPeriod: "",

  applicationDeadline: "",

  startDate: "",

  selectionProcess:
    "Document screening → First interview → Final interview → Job offer",

  contactPerson: "",
  contactPersonKana: "",

  contactEmail: "",
});

// ======================================================
// PROPS
// ======================================================

type PostVacancyModalProps = {
  open: boolean;

  onClose: () => void;

  onSuccess: () => void | Promise<void>;

  lang: string;
};

// ======================================================
// COMPONENT
// ======================================================

export default function PostVacancyModal({
  open,
  onClose,
  onSuccess,
  lang,
}: PostVacancyModalProps) {
  const [form, setForm] = useState<CreateVacancyPayload>(createInitialForm());

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

        if (response.status !== "success") {
          return;
        }

        setForm((previous) => ({
          ...previous,

          companyName: response.profile.companyName || "",

          contactPerson:
            response.profile.contact_person || response.profile.name || "",

          contactEmail:
            response.profile.contact_person_email ||
            response.profile.email ||
            "",
        }));
      } catch (error: unknown) {
        console.error("Provider profile prefill error:", error);
      } finally {
        setLoadingProfile(false);
      }
    };

    void loadProviderProfile();
  }, [open]);

  if (!open) {
    return null;
  }

  // ======================================================
  // FIELD UPDATE
  // ======================================================

  const updateField = <K extends keyof CreateVacancyPayload>(
    field: K,
    value: CreateVacancyPayload[K],
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // ======================================================
  // CHECKBOX UPDATE
  // ======================================================

  const toggleArrayValue = (field: "benefits" | "insurance", value: string) => {
    setForm((previous) => {
      const currentValues = previous[field];

      const exists = currentValues.includes(value);

      return {
        ...previous,

        [field]: exists
          ? currentValues.filter((item) => item !== value)
          : [...currentValues, value],
      };
    });
  };

  // ======================================================
  // RESET
  // ======================================================

  const handleReset = async () => {
    const emptyForm = createInitialForm();

    try {
      const response = await getProviderProfile();

      setForm({
        ...emptyForm,

        companyName: response.profile.companyName || "",

        contactPerson:
          response.profile.contact_person || response.profile.name || "",

        contactEmail:
          response.profile.contact_person_email || response.profile.email || "",
      });
    } catch {
      setForm(emptyForm);
    }
  };

  // ======================================================
  // VALIDATION
  // ======================================================

  const validateForm = () => {
    if (!form.title.trim()) {
      return lang === "ja"
        ? "求人タイトルを入力してください"
        : "Job title is required.";
    }

    if (!form.employmentType) {
      return lang === "ja"
        ? "雇用形態を選択してください"
        : "Employment type is required.";
    }

    if (form.numberOfPeople < 1) {
      return lang === "ja"
        ? "募集人数は1名以上必要です"
        : "Number of openings must be at least 1.";
    }

    if (!form.jobDescription.trim()) {
      return lang === "ja"
        ? "仕事内容を入力してください"
        : "Job description is required.";
    }

    if (!form.workLocation.trim()) {
      return lang === "ja"
        ? "勤務地を入力してください"
        : "Work location is required.";
    }

    if (!form.contactPerson.trim()) {
      return lang === "ja"
        ? "担当者名を入力してください"
        : "Contact person is required.";
    }

    if (!form.contactEmail.trim()) {
      return lang === "ja"
        ? "担当者メールを入力してください"
        : "Contact email is required.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(form.contactEmail)) {
      return lang === "ja"
        ? "有効なメールアドレスを入力してください"
        : "Please enter a valid contact email.";
    }

    if (
      form.salaryMin !== null &&
      form.salaryMax !== null &&
      form.salaryMin > form.salaryMax
    ) {
      return lang === "ja"
        ? "最低給与は最高給与以下にしてください"
        : "Minimum salary cannot be greater than maximum salary.";
    }

    return null;
  };

  // ======================================================
  // SUBMIT
  // ======================================================

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      toast.error(validationError);

      return;
    }

    try {
      setSubmitting(true);

      const response = await createProviderVacancy(form);

      toast.success(
        response.message ||
          (lang === "ja"
            ? "求人を送信しました"
            : "Vacancy submitted successfully."),
      );

      await handleReset();

      await onSuccess();
    } catch (error: unknown) {
      console.error("Create vacancy error:", error);

      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        toast.error(
          error.response?.data?.message || "Failed to create vacancy.",
        );

        return;
      }

      toast.error(
        lang === "ja"
          ? "求人の登録に失敗しました"
          : "Failed to create vacancy.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:p-4">
      {/* BACKDROP */}

      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0"
      />

      {/* MODAL */}

      <div className="relative z-10 h-full w-full overflow-y-auto bg-white sm:max-h-[96vh] sm:max-w-6xl sm:rounded-3xl sm:shadow-2xl">
        {/* HEADER */}

        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-7">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
              {lang === "ja" ? "求人追加" : "Add Vacancy"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-full p-2 transition hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {/* INTRO */}

        <div className="border-b border-slate-200 px-5 py-7 sm:px-8">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
            Vacancy Form
          </span>

          <h2 className="mt-4 text-3xl font-bold text-slate-950">
            {lang === "ja" ? "求人を登録" : "Register Job Vacancy"}
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            {lang === "ja"
              ? "求人情報を入力してください。送信後、管理者による審査が行われます。"
              : "Please fill out the form below. After submission, the vacancy will be reviewed by Admin."}
          </p>
        </div>

        {/* PROFILE LOADING */}

        {loadingProfile ? (
          <div className="flex min-h-[500px] items-center justify-center">
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
              description="e.g. Sample Co., Ltd."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <InputField
                  label={lang === "ja" ? "会社名" : "Company Name"}
                  required
                  value={form.companyName}
                  disabled
                  placeholder="e.g. Sample Co., Ltd."
                  onChange={(value) => updateField("companyName", value)}
                />

                <InputField
                  label={
                    lang === "ja" ? "会社名（カナ）" : "Company Name (Kana)"
                  }
                  value={form.companyNameKana}
                  placeholder="e.g. Kabushiki Gaisha Sample"
                  onChange={(value) => updateField("companyNameKana", value)}
                />
              </div>
            </FormSection>

            {/* ================================================= */}
            {/* POSITION */}
            {/* ================================================= */}

            <FormSection
              title={lang === "ja" ? "募集職種" : "Position Details"}
              description="e.g. Software Engineer"
            >
              <div className="grid gap-5 md:grid-cols-2">
                <InputField
                  label={lang === "ja" ? "職種" : "Job Title"}
                  required
                  value={form.title}
                  placeholder="e.g. Software Engineer"
                  onChange={(value) => updateField("title", value)}
                />

                <InputField
                  label={lang === "ja" ? "職種（カナ）" : "Job Title (Kana)"}
                  value={form.titleKana}
                  placeholder="e.g. Software Enjinia"
                  onChange={(value) => updateField("titleKana", value)}
                />

                <SelectField
                  label={lang === "ja" ? "雇用形態" : "Employment Type"}
                  required
                  value={form.employmentType}
                  options={EMPLOYMENT_TYPES}
                  onChange={(value) => updateField("employmentType", value)}
                />

                <InputField
                  label={lang === "ja" ? "募集人数" : "Number of Openings"}
                  type="number"
                  min={1}
                  value={String(form.numberOfPeople)}
                  onChange={(value) =>
                    updateField(
                      "numberOfPeople",
                      Math.max(1, Number(value) || 1),
                    )
                  }
                />
              </div>
            </FormSection>

            {/* ================================================= */}
            {/* JOB DESCRIPTION */}
            {/* ================================================= */}

            <FormSection
              title={lang === "ja" ? "仕事内容" : "Job Description"}
              description="Please describe the specific job responsibilities"
            >
              <div className="space-y-5">
                <TextareaField
                  label={lang === "ja" ? "仕事内容" : "Job Description"}
                  required
                  value={form.jobDescription}
                  placeholder="Please describe the specific job responsibilities"
                  onChange={(value) => updateField("jobDescription", value)}
                />

                <TextareaField
                  label={
                    lang === "ja" ? "詳細業務" : "Detailed Responsibilities"
                  }
                  value={form.responsibilities}
                  placeholder="Please describe day-to-day tasks in detail"
                  onChange={(value) => updateField("responsibilities", value)}
                />
              </div>
            </FormSection>

            {/* ================================================= */}
            {/* REQUIREMENTS */}
            {/* ================================================= */}

            <FormSection
              title={lang === "ja" ? "応募条件" : "Requirements"}
              description="Required skills, experience and language level"
            >
              <div className="space-y-5">
                <TextareaField
                  label={
                    lang === "ja"
                      ? "必須スキル・経験"
                      : "Required Skills & Experience"
                  }
                  value={form.requiredSkills}
                  placeholder="e.g. 3+ years of JavaScript/TypeScript experience"
                  onChange={(value) => updateField("requiredSkills", value)}
                />

                <TextareaField
                  label={lang === "ja" ? "歓迎スキル" : "Preferred Skills"}
                  value={form.preferredSkills}
                  placeholder="e.g. React or Next.js experience"
                  onChange={(value) => updateField("preferredSkills", value)}
                />

                <div className="grid gap-5 md:grid-cols-2">
                  <InputField
                    label={lang === "ja" ? "学歴" : "Education Requirements"}
                    value={form.requiredEducation}
                    placeholder="e.g. University degree or above"
                    onChange={(value) =>
                      updateField("requiredEducation", value)
                    }
                  />

                  <InputField
                    label={lang === "ja" ? "経験年数" : "Years of Experience"}
                    value={form.requiredExperience}
                    placeholder="e.g. 3+ years / Entry level welcome"
                    onChange={(value) =>
                      updateField("requiredExperience", value)
                    }
                  />

                  <SelectField
                    label={lang === "ja" ? "日本語レベル" : "Japanese Level"}
                    value={form.japaneseLevel}
                    options={JAPANESE_LEVELS}
                    onChange={(value) => updateField("japaneseLevel", value)}
                  />
                </div>
              </div>
            </FormSection>

            {/* ================================================= */}
            {/* LOCATION + SALARY */}
            {/* ================================================= */}

            <FormSection
              title={
                lang === "ja"
                  ? "勤務地・労働条件"
                  : "Location & Work Conditions"
              }
              description="e.g. Chiyoda-ku, Tokyo"
            >
              <div className="grid gap-5 md:grid-cols-2">
                <InputField
                  label={lang === "ja" ? "勤務地" : "Work Location"}
                  required
                  value={form.workLocation}
                  placeholder="e.g. Chiyoda-ku, Tokyo"
                  onChange={(value) => updateField("workLocation", value)}
                />

                <InputField
                  label={lang === "ja" ? "詳細勤務地" : "Detailed Location"}
                  value={form.workLocationDetail}
                  placeholder="e.g. 5-minute walk from Tokyo Station"
                  onChange={(value) => updateField("workLocationDetail", value)}
                />

                <SelectField
                  label={lang === "ja" ? "リモート勤務" : "Remote Work Policy"}
                  value={form.remoteWork}
                  options={REMOTE_WORK_OPTIONS}
                  onChange={(value) => updateField("remoteWork", value)}
                />

                <InputField
                  label={lang === "ja" ? "給与備考" : "Salary Notes"}
                  value={form.salaryNote}
                  placeholder="e.g. Bonus twice a year"
                  onChange={(value) => updateField("salaryNote", value)}
                />
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  {lang === "ja"
                    ? "年収（最低）/ 年収（最高）"
                    : "Annual Salary (Min) / Annual Salary (Max)"}
                </label>

                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={0}
                    value={form.salaryMin ?? ""}
                    onChange={(event) =>
                      updateField(
                        "salaryMin",
                        event.target.value ? Number(event.target.value) : null,
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400"
                  />

                  <span className="text-slate-400">~</span>

                  <input
                    type="number"
                    min={0}
                    value={form.salaryMax ?? ""}
                    onChange={(event) =>
                      updateField(
                        "salaryMax",
                        event.target.value ? Number(event.target.value) : null,
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400"
                  />

                  <span className="shrink-0 text-sm text-slate-500">万円</span>
                </div>
              </div>
            </FormSection>

            {/* ================================================= */}
            {/* SCHEDULE */}
            {/* ================================================= */}

            <FormSection
              title={
                lang === "ja" ? "勤務時間・休日" : "Work Schedule & Holidays"
              }
              description="e.g. 9:00 AM - 6:00 PM"
            >
              <div className="grid gap-5 md:grid-cols-2">
                <InputField
                  label={lang === "ja" ? "勤務時間" : "Working Hours"}
                  value={form.workHours}
                  onChange={(value) => updateField("workHours", value)}
                />

                <InputField
                  label={lang === "ja" ? "休憩時間" : "Break Time"}
                  value={form.breakTime}
                  onChange={(value) => updateField("breakTime", value)}
                />

                <InputField
                  label={lang === "ja" ? "残業" : "Overtime"}
                  value={form.overtime}
                  placeholder="About 20 hours per month on average"
                  onChange={(value) => updateField("overtime", value)}
                />

                <InputField
                  label={lang === "ja" ? "休日・休暇" : "Holidays & Leave"}
                  value={form.holidays}
                  onChange={(value) => updateField("holidays", value)}
                />
              </div>
            </FormSection>

            {/* ================================================= */}
            {/* BENEFITS */}
            {/* ================================================= */}

            <FormSection
              title={lang === "ja" ? "福利厚生" : "Benefits & Welfare"}
            >
              <CheckboxGroup
                label={lang === "ja" ? "福利厚生" : "Benefits"}
                options={BENEFITS}
                selected={form.benefits}
                onToggle={(value) => toggleArrayValue("benefits", value)}
              />

              <div className="mt-6">
                <CheckboxGroup
                  label={lang === "ja" ? "社会保険" : "Social Insurance"}
                  options={INSURANCE}
                  selected={form.insurance}
                  onToggle={(value) => toggleArrayValue("insurance", value)}
                />
              </div>

              <div className="mt-6 max-w-md">
                <InputField
                  label={lang === "ja" ? "試用期間" : "Trial Period"}
                  value={form.trialPeriod}
                  placeholder="e.g. Three months"
                  onChange={(value) => updateField("trialPeriod", value)}
                />
              </div>
            </FormSection>

            {/* ================================================= */}
            {/* APPLICATION */}
            {/* ================================================= */}

            <FormSection
              title={lang === "ja" ? "応募情報" : "Application Information"}
              description="Document screening → First interview → Final interview → Offer"
            >
              <div className="grid gap-5 md:grid-cols-2">
                <InputField
                  label={lang === "ja" ? "応募締切" : "Application Deadline"}
                  type="date"
                  value={form.applicationDeadline}
                  onChange={(value) =>
                    updateField("applicationDeadline", value)
                  }
                />

                <InputField
                  label={lang === "ja" ? "勤務開始日" : "Start Date"}
                  value={form.startDate}
                  placeholder="e.g. Immediately / April 2027"
                  onChange={(value) => updateField("startDate", value)}
                />
              </div>

              <div className="mt-5">
                <InputField
                  label={lang === "ja" ? "選考プロセス" : "Selection Process"}
                  value={form.selectionProcess}
                  onChange={(value) => updateField("selectionProcess", value)}
                />
              </div>
            </FormSection>

            {/* ================================================= */}
            {/* CONTACT */}
            {/* ================================================= */}

            <FormSection
              title={lang === "ja" ? "担当者" : "Contact Person"}
              description="Job-related contact information"
            >
              <div className="grid gap-5 md:grid-cols-2">
                <InputField
                  label={lang === "ja" ? "担当者名" : "Contact Person Name"}
                  required
                  value={form.contactPerson}
                  placeholder="e.g. Taro Yamada"
                  onChange={(value) => updateField("contactPerson", value)}
                />

                <InputField
                  label={
                    lang === "ja"
                      ? "担当者名（カナ）"
                      : "Contact Person Name (Kana)"
                  }
                  value={form.contactPersonKana}
                  placeholder="e.g. Yamada Taro"
                  onChange={(value) => updateField("contactPersonKana", value)}
                />

                <div className="md:col-span-2">
                  <InputField
                    label={lang === "ja" ? "メールアドレス" : "Email Address"}
                    type="email"
                    required
                    value={form.contactEmail}
                    placeholder="example@company.com"
                    onChange={(value) => updateField("contactEmail", value)}
                  />
                </div>
              </div>
            </FormSection>

            {/* ================================================= */}
            {/* FOOTER */}
            {/* ================================================= */}

            <div className="flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-xl text-xs leading-5 text-slate-500">
                {lang === "ja"
                  ? "送信された情報は、求人掲載および採用支援の目的で使用されます。"
                  : "The information you submit will only be used for job posting and recruitment support purposes."}
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => void handleReset()}
                  className="cursor-pointer rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 disabled:opacity-50"
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
                      ? "送信中..."
                      : "Posting..."
                    : lang === "ja"
                      ? "求人を掲載"
                      : "Post Job Vacancy"}
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
// SECTION
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
// INPUT
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
        disabled={disabled}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
      />
    </label>
  );
}

// ======================================================
// TEXTAREA
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
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}

// ======================================================
// SELECT
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
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      >
        <option value="">{required ? "Please select" : "Please select"}</option>

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
// CHECKBOX
// ======================================================

function CheckboxGroup({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;

  options: string[];

  selected: string[];

  onToggle: (value: string) => void;
}) {
  return (
    <div>
      <p className="mb-3 text-sm font-medium text-slate-700">{label}</p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {options.map((option) => (
          <label
            key={option}
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50"
          >
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => onToggle(option)}
              className="h-4 w-4"
            />

            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
