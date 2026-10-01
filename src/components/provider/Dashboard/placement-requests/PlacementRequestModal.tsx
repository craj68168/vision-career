"use client";

import { type FormEvent, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { BriefcaseBusiness, Loader2, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { createProviderPlacementRequest } from "./api";
import { getProviderProfile } from "../../Profile/api";

import type {
  CreatePlacementRequestPayload,
  PlacementRequestApiError,
} from "./types";

type Option = {
  value: string;
  labelKey: string;
};

const EMPLOYMENT_TYPES: Option[] = [
  { value: "Full-time Employee", labelKey: "fullTimeEmployee" },
  { value: "Contract Employee", labelKey: "contractEmployee" },
  { value: "Temporary Staff", labelKey: "temporaryStaff" },
  { value: "Part-time", labelKey: "partTime" },
  { value: "Freelance/Contract", labelKey: "freelanceContract" },
  { value: "Intern", labelKey: "intern" },
];

const JAPANESE_LEVELS: Option[] = [
  { value: "Native", labelKey: "native" },
  { value: "N1", labelKey: "n1" },
  { value: "N2", labelKey: "n2" },
  { value: "N3", labelKey: "n3" },
  { value: "N4", labelKey: "n4" },
  { value: "N5", labelKey: "n5" },
  { value: "Not Required", labelKey: "notRequired" },
];

const VISA_TYPES: Option[] = [
  {
    value: "Engineer / Specialist in Humanities / International Services",
    labelKey: "engineerSpecialist",
  },
  { value: "Specified Skilled Worker", labelKey: "specifiedSkilledWorker" },
  { value: "Permanent Resident", labelKey: "permanentResident" },
  { value: "Spouse of Japanese National", labelKey: "spouse" },
  { value: "Long-Term Resident", labelKey: "longTermResident" },
  { value: "Student", labelKey: "student" },
  { value: "Dependent", labelKey: "dependent" },
  { value: "Any Visa", labelKey: "anyVisa" },
];

const SALARY_TYPES: Option[] = [
  { value: "Hourly", labelKey: "hourly" },
  { value: "Daily", labelKey: "daily" },
  { value: "Monthly", labelKey: "monthly" },
  { value: "Annual", labelKey: "annual" },
];

const createInitialForm = (): CreatePlacementRequestPayload => ({
  job_title: "",
  job_category: "",
  employment_type: "",
  number_of_positions: 0,
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

type PlacementRequestModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void | Promise<void>;
  lang: string;
};

export default function PlacementRequestModal({
  open,
  onClose,
  onSuccess,
}: PlacementRequestModalProps) {
  const t = useTranslations("provider.placementRequests.createModal");

  const [form, setForm] = useState<CreatePlacementRequestPayload>(
    createInitialForm(),
  );
  const [companyName, setCompanyName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => {
    if (!open) return;

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

  const updateField = <K extends keyof CreatePlacementRequestPayload>(
    field: K,
    value: CreatePlacementRequestPayload[K],
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm(createInitialForm());
  };

  const handleClose = () => {
    if (submitting) return;

    resetForm();
    onClose();
  };

  const validateForm = () => {
    if (!form.job_title.trim()) return t("validation.jobTitleRequired");
    if (!form.employment_type) return t("validation.employmentTypeRequired");

    if (
      !Number.isInteger(form.number_of_positions) ||
      form.number_of_positions < 1
    ) {
      return t("validation.positionsMin");
    }

    if (!form.work_location.trim()) return t("validation.workLocationRequired");
    if (!form.job_description.trim()) {
      return t("validation.jobDescriptionRequired");
    }
    if (form.salary_amount < 0) return t("validation.salaryAmountInvalid");

    return null;
  };

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

      toast.success(response.message || t("toast.created"));

      resetForm();
      await onSuccess();
      onClose();
    } catch (error: unknown) {
      console.error("Create placement request error:", error);

      if (axios.isAxiosError<PlacementRequestApiError>(error)) {
        toast.error(error.response?.data?.message || t("toast.createFailed"));
        return;
      }

      toast.error(t("toast.createFailed"));
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:p-4">
      <button
        type="button"
        aria-label={t("closePlacementRequest")}
        onClick={handleClose}
        className="absolute inset-0"
      />

      <div className="relative z-10 h-full w-full overflow-y-auto bg-white sm:max-h-[95vh] sm:max-w-5xl sm:rounded-3xl sm:shadow-2xl">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
              <BriefcaseBusiness className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                {t("headerEyebrow")}
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
            aria-label={t("close")}
            className="cursor-pointer rounded-full p-2 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="border-b border-slate-200 px-5 py-7 sm:px-8">
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-indigo-600">
            {t("intro.badge")}
          </span>

          <h2 className="mt-4 text-3xl font-bold text-slate-950">
            {t("intro.title")}
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            {t("intro.description")}
          </p>
        </div>

        {loadingProfile ? (
          <div className="flex min-h-[450px] items-center justify-center">
            <div className="text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-slate-400" />
              <p className="mt-3 text-sm text-slate-500">
                {t("loadingCompany")}
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-8">
            <FormSection title={t("sections.company")}>
              <InputField
                label={t("fields.companyName")}
                value={companyName}
                placeholder={t("placeholders.companyName")}
                disabled
                requiredLabel={t("required")}
                onChange={() => {
                  // Company comes from the authenticated Provider.
                }}
              />

              <p className="mt-2 text-xs text-slate-500">
                {t("companyHelp")}
              </p>
            </FormSection>

            <FormSection
              title={t("sections.position")}
              description={t("sectionDescriptions.position")}
            >
              <div className="grid gap-5 md:grid-cols-2">
                <InputField
                  label={t("fields.jobTitle")}
                  required
                  requiredLabel={t("required")}
                  value={form.job_title}
                  placeholder={t("placeholders.jobTitle")}
                  onChange={(value) => updateField("job_title", value)}
                />

                <InputField
                  label={t("fields.jobCategory")}
                  value={form.job_category}
                  placeholder={t("placeholders.jobCategory")}
                  requiredLabel={t("required")}
                  onChange={(value) => updateField("job_category", value)}
                />

                <SelectField
                  label={t("fields.employmentType")}
                  required
                  requiredLabel={t("required")}
                  placeholder={t("placeholders.employmentType")}
                  value={form.employment_type}
                  options={EMPLOYMENT_TYPES}
                  getOptionLabel={(option) =>
                    t(`options.employmentTypes.${option.labelKey}`)
                  }
                  onChange={(value) => updateField("employment_type", value)}
                />

                <InputField
                  label={t("fields.numberOfPositions")}
                  required
                  requiredLabel={t("required")}
                  type="number"
                  min={1}
                  step={1}
                  value={
                    form.number_of_positions === 0
                      ? ""
                      : String(form.number_of_positions)
                  }
                  placeholder={t("placeholders.numberOfPositions")}
                  onChange={(value) =>
                    updateField(
                      "number_of_positions",
                      value === "" ? 0 : Number(value),
                    )
                  }
                />
              </div>
            </FormSection>

            <FormSection title={t("sections.jobDetails")}>
              <InputField
                label={t("fields.workLocation")}
                required
                requiredLabel={t("required")}
                value={form.work_location}
                placeholder={t("placeholders.workLocation")}
                onChange={(value) => updateField("work_location", value)}
              />

              <div className="mt-5">
                <TextareaField
                  label={t("fields.jobDescription")}
                  required
                  requiredLabel={t("required")}
                  value={form.job_description}
                  placeholder={t("placeholders.jobDescription")}
                  onChange={(value) => updateField("job_description", value)}
                />
              </div>

              <div className="mt-5">
                <TextareaField
                  label={t("fields.requirements")}
                  value={form.requirements}
                  requiredLabel={t("required")}
                  placeholder={t("placeholders.requirements")}
                  onChange={(value) => updateField("requirements", value)}
                />
              </div>
            </FormSection>

            <FormSection
              title={t("sections.candidateRequirements")}
              description={t("sectionDescriptions.candidateRequirements")}
            >
              <div className="grid gap-5 md:grid-cols-2">
                <SelectField
                  label={t("fields.japaneseLevelRequired")}
                  requiredLabel={t("required")}
                  placeholder={t("placeholders.japaneseLevel")}
                  value={form.japanese_level_required}
                  options={JAPANESE_LEVELS}
                  getOptionLabel={(option) =>
                    t(`options.japaneseLevels.${option.labelKey}`)
                  }
                  onChange={(value) =>
                    updateField("japanese_level_required", value)
                  }
                />

                <SelectField
                  label={t("fields.visaTypeRequired")}
                  requiredLabel={t("required")}
                  placeholder={t("placeholders.visaType")}
                  value={form.visa_type_required}
                  options={VISA_TYPES}
                  getOptionLabel={(option) =>
                    t(`options.visaTypes.${option.labelKey}`)
                  }
                  onChange={(value) => updateField("visa_type_required", value)}
                />
              </div>
            </FormSection>

            <FormSection title={t("sections.salary")}>
              <div className="grid gap-5 md:grid-cols-2">
                <SelectField
                  label={t("fields.salaryType")}
                  requiredLabel={t("required")}
                  placeholder={t("placeholders.salaryType")}
                  value={form.salary_type}
                  options={SALARY_TYPES}
                  getOptionLabel={(option) =>
                    t(`options.salaryTypes.${option.labelKey}`)
                  }
                  onChange={(value) => updateField("salary_type", value)}
                />

                <InputField
                  label={t("fields.salaryAmount")}
                  type="number"
                  min={0}
                  value={
                    form.salary_amount === 0 ? "" : String(form.salary_amount)
                  }
                  placeholder={t("placeholders.salaryAmount")}
                  requiredLabel={t("required")}
                  onChange={(value) =>
                    updateField(
                      "salary_amount",
                      value === "" ? 0 : Number(value),
                    )
                  }
                />
              </div>

              <p className="mt-3 text-xs text-slate-500">
                {t("salaryHelp")}
              </p>
            </FormSection>

            <FormSection title={t("sections.workConditions")}>
              <div className="grid gap-5 md:grid-cols-2">
                <InputField
                  label={t("fields.workingHours")}
                  value={form.working_hours}
                  placeholder={t("placeholders.workingHours")}
                  requiredLabel={t("required")}
                  onChange={(value) => updateField("working_hours", value)}
                />

                <InputField
                  label={t("fields.daysOff")}
                  value={form.days_off}
                  placeholder={t("placeholders.daysOff")}
                  requiredLabel={t("required")}
                  onChange={(value) => updateField("days_off", value)}
                />

                <InputField
                  label={t("fields.startDate")}
                  type="date"
                  value={form.start_date}
                  helperText={!form.start_date ? t("startDateHelp") : undefined}
                  requiredLabel={t("required")}
                  onChange={(value) => updateField("start_date", value)}
                />
              </div>
            </FormSection>

            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
              <p className="font-semibold text-blue-900">
                {t("difference.title")}
              </p>

              <p className="mt-2 text-sm leading-6 text-blue-800">
                {t("difference.description")}
              </p>
            </div>

            <div className="flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-xl text-xs leading-5 text-slate-500">
                {t("footerNote")}
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={resetForm}
                  className="cursor-pointer rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  {t("reset")}
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {submitting ? t("creating") : t("create")}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

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

type InputFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  requiredLabel: string;
  placeholder?: string;
  helperText?: string;
  type?: React.HTMLInputTypeAttribute;
  required?: boolean;
  disabled?: boolean;
  min?: number;
  step?: number;
};

function InputField({
  label,
  value,
  onChange,
  requiredLabel,
  placeholder,
  helperText,
  type = "text",
  required = false,
  disabled = false,
  min,
  step,
}: InputFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}

        {required && (
          <span className="ml-2 rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-red-600">
            {requiredLabel}
          </span>
        )}
      </span>

      <input
        type={type}
        value={value}
        min={min}
        step={step}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
      />

      {helperText && (
        <span className="mt-1 block text-xs text-slate-500">{helperText}</span>
      )}
    </label>
  );
}

function TextareaField({
  label,
  value,
  onChange,
  requiredLabel,
  placeholder,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  requiredLabel: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}

        {required && (
          <span className="ml-2 rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-red-600">
            {requiredLabel}
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

function SelectField({
  label,
  value,
  options,
  placeholder,
  onChange,
  requiredLabel,
  getOptionLabel,
  required = false,
}: {
  label: string;
  value: string;
  options: Option[];
  placeholder: string;
  onChange: (value: string) => void;
  requiredLabel: string;
  getOptionLabel: (option: Option) => string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}

        {required && (
          <span className="ml-2 rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-red-600">
            {requiredLabel}
          </span>
        )}
      </span>

      <select
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      >
        <option value="" disabled={required}>
          {placeholder}
        </option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {getOptionLabel(option)}
          </option>
        ))}
      </select>
    </label>
  );
}
