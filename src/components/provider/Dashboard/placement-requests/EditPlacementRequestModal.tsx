"use client";

import { type FormEvent, useState } from "react";

import { Loader2, Save, X } from "lucide-react";
import { useTranslations } from "next-intl";

import type { CreatePlacementRequestPayload, PlacementRequest } from "./types";

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

type Props = {
  open: boolean;
  request: PlacementRequest | null;
  loading: boolean;
  lang: string;
  onClose: () => void;
  onSubmit: (payload: CreatePlacementRequestPayload) => void | Promise<void>;
};

export default function EditPlacementRequestModal({
  open,
  request,
  loading,
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
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
}

type FormProps = {
  request: PlacementRequest;
  loading: boolean;
  onClose: () => void;
  onSubmit: (payload: CreatePlacementRequestPayload) => void | Promise<void>;
};

function PlacementRequestEditForm({
  request,
  loading,
  onClose,
  onSubmit,
}: FormProps) {
  const t = useTranslations("provider.placementRequests.editModal");

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

  const updateField = <K extends keyof CreatePlacementRequestPayload>(
    field: K,
    value: CreatePlacementRequestPayload[K],
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!form.job_title.trim()) {
      return t("validation.jobTitleRequired");
    }

    if (!form.employment_type) {
      return t("validation.employmentTypeRequired");
    }

    if (form.number_of_positions < 1) {
      return t("validation.positionsMin");
    }

    if (!form.work_location.trim()) {
      return t("validation.workLocationRequired");
    }

    if (!form.job_description.trim()) {
      return t("validation.jobDescriptionRequired");
    }

    if (form.salary_amount < 0) {
      return t("validation.salaryAmountInvalid");
    }

    return null;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      window.alert(validationError);
      return;
    }

    await onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <button
        type="button"
        aria-label={t("close")}
        onClick={() => {
          if (!loading) {
            onClose();
          }
        }}
        className="absolute inset-0"
      />

      <div className="relative z-10 max-h-[94vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <header className="sticky top-0 z-20 flex items-start justify-between border-b border-slate-200 bg-white px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              {request.recruitId}
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-950">
              {t("title")}
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

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <FormSection title={t("sections.position")}>
            <div className="grid gap-5 md:grid-cols-2">
              <Input
                label={t("fields.jobTitle")}
                required
                value={form.job_title}
                onChange={(value) => updateField("job_title", value)}
              />

              <Input
                label={t("fields.jobCategory")}
                value={form.job_category}
                onChange={(value) => updateField("job_category", value)}
              />

              <Select
                label={t("fields.employmentType")}
                value={form.employment_type}
                options={EMPLOYMENT_TYPES}
                placeholder={t("selectPlaceholder")}
                getOptionLabel={(option) =>
                  t(`options.employmentTypes.${option.labelKey}`)
                }
                onChange={(value) => updateField("employment_type", value)}
              />

              <Input
                label={t("fields.numberOfPositions")}
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
                label={t("fields.workLocation")}
                required
                value={form.work_location}
                onChange={(value) => updateField("work_location", value)}
              />
            </div>
          </FormSection>

          <FormSection title={t("sections.candidateRequirements")}>
            <div className="grid gap-5 md:grid-cols-2">
              <Select
                label={t("fields.japaneseLevel")}
                value={form.japanese_level_required}
                options={JAPANESE_LEVELS}
                placeholder={t("selectPlaceholder")}
                getOptionLabel={(option) =>
                  t(`options.japaneseLevels.${option.labelKey}`)
                }
                onChange={(value) =>
                  updateField("japanese_level_required", value)
                }
              />

              <Select
                label={t("fields.visaType")}
                value={form.visa_type_required}
                options={VISA_TYPES}
                placeholder={t("selectPlaceholder")}
                getOptionLabel={(option) =>
                  t(`options.visaTypes.${option.labelKey}`)
                }
                onChange={(value) => updateField("visa_type_required", value)}
              />
            </div>
          </FormSection>

          <FormSection title={t("sections.salaryWorkConditions")}>
            <div className="grid gap-5 md:grid-cols-2">
              <Select
                label={t("fields.salaryType")}
                value={form.salary_type}
                options={SALARY_TYPES}
                placeholder={t("selectPlaceholder")}
                getOptionLabel={(option) =>
                  t(`options.salaryTypes.${option.labelKey}`)
                }
                onChange={(value) => updateField("salary_type", value)}
              />

              <Input
                label={t("fields.salaryAmount")}
                type="number"
                min={0}
                value={String(form.salary_amount)}
                onChange={(value) =>
                  updateField("salary_amount", Math.max(0, Number(value) || 0))
                }
              />

              <Input
                label={t("fields.workingHours")}
                value={form.working_hours}
                onChange={(value) => updateField("working_hours", value)}
              />

              <Input
                label={t("fields.daysOff")}
                value={form.days_off}
                onChange={(value) => updateField("days_off", value)}
              />

              <Input
                label={t("fields.startDate")}
                type="date"
                value={form.start_date}
                onChange={(value) => updateField("start_date", value)}
              />
            </div>
          </FormSection>

          <FormSection title={t("sections.jobInformation")}>
            <Textarea
              label={t("fields.jobDescription")}
              required
              value={form.job_description}
              onChange={(value) => updateField("job_description", value)}
            />

            <div className="mt-5">
              <Textarea
                label={t("fields.requirements")}
                value={form.requirements}
                onChange={(value) => updateField("requirements", value)}
              />
            </div>
          </FormSection>

          {request.status === "rejected" && request.rejection_reason && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
              <p className="text-sm font-semibold text-red-700">
                {t("adminRejectionReason")}
              </p>

              <p className="mt-2 whitespace-pre-wrap text-sm text-red-700">
                {request.rejection_reason}
              </p>

              <p className="mt-3 text-xs text-red-600">
                {t("rejectionHelp")}
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              {t("cancel")}
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

              {t("saveChanges")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

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

function Select({
  label,
  value,
  options,
  onChange,
  placeholder,
  getOptionLabel,
}: {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  placeholder: string;
  getOptionLabel: (option: Option) => string;
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
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {getOptionLabel(option)}
          </option>
        ))}
      </select>
    </label>
  );
}

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
