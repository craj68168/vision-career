"use client";
import { useEffect, useState, type FormEvent } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader2, X } from "lucide-react";
import { getProviderProfile } from "../Profile/api";
import { createProviderVacancy, updateProviderVacancy } from "./api";

import type { ApiErrorResponse, CreateVacancyPayload, Vacancy } from "./types";

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
// INITIAL
// ======================================================

const createEmptyForm = (): CreateVacancyPayload => ({
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

  holidays: "",

  benefits: [],
  insurance: [],

  trialPeriod: "",

  applicationDeadline: "",

  startDate: "",

  selectionProcess: "",

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

  mode?: "create" | "edit";

  vacancy?: Vacancy | null;
};

// ======================================================
// COMPONENT
// ======================================================
const vacancyToForm = (vacancy: Vacancy): CreateVacancyPayload => ({
  companyName: vacancy.companyName || "",
  companyNameKana: vacancy.companyNameKana || "",

  title: vacancy.title || "",
  titleKana: vacancy.titleKana || "",

  employmentType: vacancy.employmentType || "",
  numberOfPeople: vacancy.numberOfPeople || 1,

  jobDescription: vacancy.jobDescription || "",
  responsibilities: vacancy.responsibilities || "",

  requiredSkills: vacancy.requiredSkills || "",
  preferredSkills: vacancy.preferredSkills || "",

  requiredEducation: vacancy.requiredEducation || "",
  requiredExperience: vacancy.requiredExperience || "",

  japaneseLevel: vacancy.japaneseLevel || "",

  workLocation: vacancy.workLocation || "",
  workLocationDetail: vacancy.workLocationDetail || "",

  remoteWork: vacancy.remoteWork || "",

  salaryMin: vacancy.salaryMin ?? null,
  salaryMax: vacancy.salaryMax ?? null,

  salaryNote: vacancy.salaryNote || "",

  workHours: vacancy.workHours || "",
  breakTime: vacancy.breakTime || "",
  overtime: vacancy.overtime || "",
  holidays: vacancy.holidays || "",

  benefits: vacancy.benefits || [],
  insurance: vacancy.insurance || [],

  trialPeriod: vacancy.trialPeriod || "",

  applicationDeadline: vacancy.applicationDeadline
    ? vacancy.applicationDeadline.slice(0, 10)
    : "",

  startDate: vacancy.startDate || "",

  selectionProcess: vacancy.selectionProcess || "",

  contactPerson: vacancy.contactPerson || "",
  contactPersonKana: vacancy.contactPersonKana || "",
  contactEmail: vacancy.contactEmail || "",
});
export default function PostVacancyModal({
  open,
  onClose,
  onSuccess,
  lang,
  mode = "create",
  vacancy = null,
}: PostVacancyModalProps) {
  const [form, setForm] = useState<CreateVacancyPayload>(createEmptyForm());

  const [submitting, setSubmitting] = useState(false);

  const [loadingProfile, setLoadingProfile] = useState(false);
  const isEditMode = mode === "edit" && Boolean(vacancy);
  // ====================================================
  // PREFILL COMPANY PROFILE
  // ====================================================

  useEffect(() => {
    if (!open) {
      return;
    }

    // ============================================
    // EDIT EXISTING VACANCY
    // ============================================

    if (mode === "edit" && vacancy) {
      setForm(vacancyToForm(vacancy));

      return;
    }

    // ============================================
    // CREATE NEW VACANCY
    // ============================================

    const loadProviderProfile = async () => {
      try {
        setLoadingProfile(true);

        const response = await getProviderProfile();

        if (response.status !== "success") {
          return;
        }

        setForm({
          ...createEmptyForm(),

          companyName: response.profile.companyName || "",

          contactPerson:
            response.profile.contact_person || response.profile.name || "",

          contactEmail:
            response.profile.contact_person_email ||
            response.profile.email ||
            "",
        });
      } catch (error: unknown) {
        console.error("Provider profile prefill error:", error);
      } finally {
        setLoadingProfile(false);
      }
    };

    void loadProviderProfile();
  }, [open, mode, vacancy]);

  if (!open) {
    return null;
  }

  // ====================================================
  // CHANGE
  // ====================================================

  const updateField = <K extends keyof CreateVacancyPayload>(
    field: K,
    value: CreateVacancyPayload[K],
  ) => {
    setForm((previous) => ({
      ...previous,

      [field]: value,
    }));
  };

  // ====================================================
  // CHECKBOX
  // ====================================================

  const toggleArrayValue = (
    field: "benefits" | "insurance",

    value: string,
  ) => {
    setForm((previous) => {
      const values = previous[field];

      const exists = values.includes(value);

      return {
        ...previous,

        [field]: exists
          ? values.filter((item) => item !== value)
          : [...values, value],
      };
    });
  };

  // ====================================================
  // RESET
  // ====================================================

  const resetForm = async () => {
    if (isEditMode && vacancy) {
      setForm(vacancyToForm(vacancy));
      return;
    }

    const empty = createEmptyForm();

    try {
      const response = await getProviderProfile();

      setForm({
        ...empty,

        companyName: response.profile.companyName || "",

        contactPerson:
          response.profile.contact_person || response.profile.name || "",

        contactEmail:
          response.profile.contact_person_email || response.profile.email || "",
      });
    } catch {
      setForm(empty);
    }
  };

  // ====================================================
  // VALIDATION
  // ====================================================

  const validate = () => {
    if (!form.companyName.trim()) {
      return lang === "ja" ? "会社名が必要です" : "Company name is required.";
    }

    if (!form.title.trim()) {
      return lang === "ja"
        ? "求人タイトルが必要です"
        : "Job title is required.";
    }

    if (!form.employmentType) {
      return lang === "ja"
        ? "雇用形態を選択してください"
        : "Employment type is required.";
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
        ? "担当者名が必要です"
        : "Contact person is required.";
    }

    if (!form.contactEmail.trim()) {
      return lang === "ja"
        ? "メールアドレスが必要です"
        : "Contact email is required.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail)) {
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
        : "Minimum salary cannot exceed maximum salary.";
    }

    return null;
  };

  // ====================================================
  // SUBMIT
  // ====================================================
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validate();

    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      setSubmitting(true);

      let response;

      if (isEditMode && vacancy) {
        console.log("UPDATING VACANCY:", vacancy.vacancyId);

        response = await updateProviderVacancy(vacancy.vacancyId, form);
      } else {
        console.log("CREATING VACANCY");

        response = await createProviderVacancy(form);
      }

      toast.success(
        response.message ||
          (isEditMode
            ? "Vacancy updated successfully."
            : "Vacancy submitted successfully."),
      );

      await onSuccess();
    } catch (error: unknown) {
      console.error(
        isEditMode ? "Update vacancy error:" : "Create vacancy error:",
        error,
      );

      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        console.error("Backend response:", error.response?.data);

        toast.error(
          error.response?.data?.message ||
            (isEditMode
              ? "Failed to update vacancy."
              : "Failed to create vacancy."),
        );

        return;
      }

      toast.error(
        isEditMode ? "Failed to update vacancy." : "Failed to create vacancy.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:p-4">
      {/* BACKDROP */}

      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0"
      />

      {/* MODAL */}

      <div className="relative z-10 h-full w-full overflow-y-auto bg-white sm:max-h-[96vh] sm:max-w-6xl sm:rounded-3xl sm:shadow-2xl">
        {/* HEADER */}

        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-7">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
            {isEditMode
              ? lang === "ja"
                ? "求人編集"
                : "Edit Vacancy"
              : lang === "ja"
                ? "求人追加"
                : "Add Vacancy"}
          </p>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 transition hover:bg-slate-100"
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
            {isEditMode
              ? lang === "ja"
                ? "求人情報を編集"
                : "Edit Job Vacancy"
              : lang === "ja"
                ? "求人を登録"
                : "Register Job Vacancy"}
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            {isEditMode
              ? lang === "ja"
                ? "求人情報を更新してください。保存後、管理者による再審査が行われます。"
                : "Update the vacancy information below. Saving changes will send the vacancy for admin review again."
              : lang === "ja"
                ? "必要事項を入力してください。登録後、管理者による審査が行われます。"
                : "Please fill out the form below. The vacancy will be sent for admin review after submission."}
          </p>
        </div>

        {loadingProfile ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-8">
            {/* ================================= */}
            {/* COMPANY */}
            {/* ================================= */}

            <FormSection
              title="Company Information"
              description="Basic company information"
            >
              <div className="grid gap-5 md:grid-cols-2">
                <InputField
                  label="Company Name"
                  required
                  value={form.companyName}
                  disabled
                  placeholder="e.g. Sample Co., Ltd."
                  onChange={(value) => updateField("companyName", value)}
                />

                <InputField
                  label="Company Name (Kana)"
                  value={form.companyNameKana}
                  placeholder="e.g. Kabushiki Gaisha Sample"
                  onChange={(value) => updateField("companyNameKana", value)}
                />
              </div>
            </FormSection>

            {/* ================================= */}
            {/* POSITION */}
            {/* ================================= */}

            <FormSection
              title="Position Details"
              description="e.g. Software Engineer"
            >
              <div className="grid gap-5 md:grid-cols-2">
                <InputField
                  label="Job Title"
                  required
                  value={form.title}
                  placeholder="e.g. Software Engineer"
                  onChange={(value) => updateField("title", value)}
                />

                <InputField
                  label="Job Title (Kana)"
                  value={form.titleKana}
                  placeholder="e.g. Software Enjinia"
                  onChange={(value) => updateField("titleKana", value)}
                />

                <SelectField
                  label="Employment Type"
                  required
                  value={form.employmentType}
                  options={EMPLOYMENT_TYPES}
                  onChange={(value) => updateField("employmentType", value)}
                />

                <InputField
                  label="Number of Openings"
                  type="number"
                  value={String(form.numberOfPeople)}
                  onChange={(value) =>
                    updateField("numberOfPeople", Math.max(1, Number(value)))
                  }
                />
              </div>
            </FormSection>

            {/* ================================= */}
            {/* DESCRIPTION */}
            {/* ================================= */}

            <FormSection
              title="Job Description"
              description="Please describe the specific job responsibilities"
            >
              <div className="space-y-5">
                <TextareaField
                  label="Job Description"
                  required
                  value={form.jobDescription}
                  placeholder="Please describe the specific job responsibilities"
                  onChange={(value) => updateField("jobDescription", value)}
                />

                <TextareaField
                  label="Detailed Responsibilities"
                  value={form.responsibilities}
                  placeholder="Please describe day-to-day tasks in detail"
                  onChange={(value) => updateField("responsibilities", value)}
                />
              </div>
            </FormSection>

            {/* ================================= */}
            {/* REQUIREMENTS */}
            {/* ================================= */}

            <FormSection
              title="Requirements"
              description="e.g. 3+ years of JavaScript/TypeScript development experience"
            >
              <div className="space-y-5">
                <TextareaField
                  label="Required Skills & Experience"
                  value={form.requiredSkills}
                  placeholder="Required skills and experience"
                  onChange={(value) => updateField("requiredSkills", value)}
                />

                <TextareaField
                  label="Preferred Skills"
                  value={form.preferredSkills}
                  placeholder="e.g. React or Next.js experience"
                  onChange={(value) => updateField("preferredSkills", value)}
                />

                <div className="grid gap-5 md:grid-cols-2">
                  <InputField
                    label="Education Requirements"
                    value={form.requiredEducation}
                    placeholder="e.g. University degree or above"
                    onChange={(value) =>
                      updateField("requiredEducation", value)
                    }
                  />

                  <InputField
                    label="Years of Experience"
                    value={form.requiredExperience}
                    placeholder="e.g. 3+ years / Entry level welcome"
                    onChange={(value) =>
                      updateField("requiredExperience", value)
                    }
                  />

                  <SelectField
                    label="Japanese Level"
                    value={form.japaneseLevel}
                    options={JAPANESE_LEVELS}
                    onChange={(value) => updateField("japaneseLevel", value)}
                  />
                </div>
              </div>
            </FormSection>

            {/* ================================= */}
            {/* LOCATION / SALARY */}
            {/* ================================= */}

            <FormSection
              title="Location & Work Conditions"
              description="e.g. Chiyoda-ku, Tokyo"
            >
              <div className="grid gap-5 md:grid-cols-2">
                <InputField
                  label="Work Location"
                  required
                  value={form.workLocation}
                  placeholder="e.g. Chiyoda-ku, Tokyo"
                  onChange={(value) => updateField("workLocation", value)}
                />

                <InputField
                  label="Detailed Location"
                  value={form.workLocationDetail}
                  placeholder="e.g. 5-minute walk from Tokyo Station"
                  onChange={(value) => updateField("workLocationDetail", value)}
                />

                <SelectField
                  label="Remote Work Policy"
                  value={form.remoteWork}
                  options={REMOTE_WORK_OPTIONS}
                  onChange={(value) => updateField("remoteWork", value)}
                />

                <InputField
                  label="Salary Notes"
                  value={form.salaryNote}
                  placeholder="e.g. Bonus twice a year"
                  onChange={(value) => updateField("salaryNote", value)}
                />
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Annual Salary (Min) / Annual Salary (Max)
                </label>

                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={form.salaryMin ?? ""}
                    onChange={(e) =>
                      updateField(
                        "salaryMin",
                        e.target.value ? Number(e.target.value) : null,
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3"
                  />

                  <span>~</span>

                  <input
                    type="number"
                    value={form.salaryMax ?? ""}
                    onChange={(e) =>
                      updateField(
                        "salaryMax",
                        e.target.value ? Number(e.target.value) : null,
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3"
                  />

                  <span className="text-sm text-slate-500">万円</span>
                </div>
              </div>
            </FormSection>

            {/* ================================= */}
            {/* SCHEDULE */}
            {/* ================================= */}

            <FormSection
              title="Work Schedule & Holidays"
              description="e.g. 9:00 AM - 6:00 PM"
            >
              <div className="grid gap-5 md:grid-cols-2">
                <InputField
                  label="Working Hours"
                  value={form.workHours}
                  onChange={(value) => updateField("workHours", value)}
                />

                <InputField
                  label="Break Time"
                  value={form.breakTime}
                  onChange={(value) => updateField("breakTime", value)}
                />

                <InputField
                  label="Overtime"
                  value={form.overtime}
                  placeholder="About 20 hours per month"
                  onChange={(value) => updateField("overtime", value)}
                />

                <InputField
                  label="Holidays & Leave"
                  value={form.holidays}
                  placeholder="Weekends, public holidays..."
                  onChange={(value) => updateField("holidays", value)}
                />
              </div>
            </FormSection>

            {/* ================================= */}
            {/* BENEFITS */}
            {/* ================================= */}

            <FormSection title="Benefits & Welfare" description="Benefits">
              <CheckboxGroup
                label="Benefits"
                options={BENEFITS}
                selected={form.benefits}
                onToggle={(value) => toggleArrayValue("benefits", value)}
              />

              <div className="mt-6">
                <CheckboxGroup
                  label="Social Insurance"
                  options={INSURANCE}
                  selected={form.insurance}
                  onToggle={(value) => toggleArrayValue("insurance", value)}
                />
              </div>

              <div className="mt-6 max-w-md">
                <InputField
                  label="Trial Period"
                  value={form.trialPeriod}
                  placeholder="e.g. Three months"
                  onChange={(value) => updateField("trialPeriod", value)}
                />
              </div>
            </FormSection>

            {/* ================================= */}
            {/* APPLICATION */}
            {/* ================================= */}

            <FormSection
              title="Application Information"
              description="Document screening → First interview → Final interview → Offer"
            >
              <div className="grid gap-5 md:grid-cols-2">
                <InputField
                  label="Application Deadline"
                  type="date"
                  value={form.applicationDeadline}
                  onChange={(value) =>
                    updateField("applicationDeadline", value)
                  }
                />

                <InputField
                  label="Start Date"
                  value={form.startDate}
                  placeholder="e.g. Immediately / April 2027"
                  onChange={(value) => updateField("startDate", value)}
                />
              </div>

              <div className="mt-5">
                <InputField
                  label="Selection Process"
                  value={form.selectionProcess}
                  placeholder="Document screening → First interview → Final interview → Job offer"
                  onChange={(value) => updateField("selectionProcess", value)}
                />
              </div>
            </FormSection>

            {/* ================================= */}
            {/* CONTACT */}
            {/* ================================= */}

            <FormSection
              title="Contact Person"
              description="Job-related contact information"
            >
              <div className="grid gap-5 md:grid-cols-2">
                <InputField
                  label="Contact Person Name"
                  required
                  value={form.contactPerson}
                  placeholder="e.g. Taro Yamada"
                  onChange={(value) => updateField("contactPerson", value)}
                />

                <InputField
                  label="Contact Person Name (Kana)"
                  value={form.contactPersonKana}
                  placeholder="e.g. Yamada Taro"
                  onChange={(value) => updateField("contactPersonKana", value)}
                />

                <div className="md:col-span-2">
                  <InputField
                    label="Email Address"
                    type="email"
                    required
                    value={form.contactEmail}
                    placeholder="example@company.com"
                    onChange={(value) => updateField("contactEmail", value)}
                  />
                </div>
              </div>
            </FormSection>

            {/* ================================= */}
            {/* FOOTER */}
            {/* ================================= */}

            <div className="flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-500">
                The information submitted will be used for job posting and
                recruitment support purposes.
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => void resetForm()}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium"
                >
                  Reset
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Loader2
                    className={`h-4 w-4 animate-spin ${
                      submitting ? "block" : "hidden"
                    }`}
                  />

                  {submitting
                    ? isEditMode
                      ? lang === "ja"
                        ? "保存中..."
                        : "Saving..."
                      : lang === "ja"
                        ? "送信中..."
                        : "Posting..."
                    : isEditMode
                      ? lang === "ja"
                        ? "変更を保存"
                        : "Save Changes"
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
    <section className="rounded-3xl border border-slate-200 bg-slate-50/50 p-5 sm:p-6">
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

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  disabled,
}: {
  label: string;

  value: string;

  onChange: (value: string) => void;

  placeholder?: string;

  type?: string;

  required?: boolean;

  disabled?: boolean;
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

      <input
        type={type}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
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
  required,
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
        className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
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
  required,
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
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
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
// CHECKBOXES
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
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
          >
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => onToggle(option)}
            />

            {option}
          </label>
        ))}
      </div>
    </div>
  );
}
