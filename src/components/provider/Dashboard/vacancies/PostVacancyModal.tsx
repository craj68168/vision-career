"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";

import axios from "axios";
import toast from "react-hot-toast";

import { Loader2, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { getProviderProfile } from "../../Profile/api";
import { createProviderVacancy, updateProviderVacancy } from "./api";

import type { CreateVacancyPayload, Vacancy } from "./types";
import { ProviderDashboardApiError } from "../types";

// Shared tokens: keep in sync with vacancies.tsx / provider-dashboard.tsx
const PANEL = "rounded-[14px] bg-white/70 ring-1 ring-black/5";

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-800/50 focus-visible:ring-offset-1";

const BTN = `inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-[12px] px-4 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${FOCUS}`;

const BTN_PRIMARY = `${BTN} bg-teal-800 text-white ring-1 ring-teal-800 hover:bg-teal-700`;

const BTN_SECONDARY = `${BTN} bg-white/80 text-slate-700 ring-1 ring-black/10 hover:bg-white`;

const CONTROL =
  "w-full rounded-[12px] bg-white px-3.5 py-2.5 text-sm ring-1 ring-black/10 placeholder:text-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-800/50 disabled:cursor-not-allowed disabled:bg-slate-900/[0.03] disabled:text-slate-500";

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
  { value: "N1 (Business level)", labelKey: "n1" },
  { value: "N2 (Daily conversation level)", labelKey: "n2" },
  { value: "N3 (Basic conversation level)", labelKey: "n3" },
  { value: "N4 or below (Not required)", labelKey: "n4OrBelow" },
];

const REMOTE_WORK_OPTIONS: Option[] = [
  { value: "Fully remote", labelKey: "fullyRemote" },
  { value: "2-3 days in office per week", labelKey: "hybrid" },
  {
    value: "Primarily in-office (remote possible depending on situation)",
    labelKey: "primarilyOffice",
  },
  { value: "No remote work", labelKey: "noRemote" },
];

const BENEFITS: Option[] = [
  { value: "Full social insurance", labelKey: "fullSocialInsurance" },
  { value: "Commuting allowance", labelKey: "commutingAllowance" },
  { value: "Housing allowance", labelKey: "housingAllowance" },
  { value: "Family allowance", labelKey: "familyAllowance" },
  { value: "Certification support", labelKey: "certificationSupport" },
  { value: "Employee cafeteria", labelKey: "employeeCafeteria" },
  { value: "On-site daycare", labelKey: "onsiteDaycare" },
  { value: "Refresh vacation", labelKey: "refreshVacation" },
];

const INSURANCE: Option[] = [
  { value: "Health insurance", labelKey: "healthInsurance" },
  { value: "Employees' pension insurance", labelKey: "pensionInsurance" },
  { value: "Employment insurance", labelKey: "employmentInsurance" },
  {
    value: "Workers' compensation insurance",
    labelKey: "workersCompensation",
  },
];

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

type PostVacancyModalProps = {
  open: boolean;

  onClose: () => void;

  onSuccess: () => void | Promise<void>;

  lang: string;

  mode?: "create" | "edit";

  vacancy?: Vacancy | null;
};

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
  mode = "create",
  vacancy = null,
}: PostVacancyModalProps) {
  const t = useTranslations("provider.vacancies.form");

  const [form, setForm] = useState<CreateVacancyPayload>(createEmptyForm());

  const [submitting, setSubmitting] = useState(false);

  const [loadingProfile, setLoadingProfile] = useState(false);
  const isEditMode = mode === "edit" && Boolean(vacancy);

  // Close on Escape while open
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (mode === "edit" && vacancy) {
      setForm(vacancyToForm(vacancy));

      return;
    }

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

  const updateField = <K extends keyof CreateVacancyPayload>(
    field: K,
    value: CreateVacancyPayload[K],
  ) => {
    setForm((previous) => ({
      ...previous,

      [field]: value,
    }));
  };

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

  const validate = () => {
    if (!form.companyName.trim()) {
      return t("validation.companyNameRequired");
    }

    if (!form.title.trim()) {
      return t("validation.jobTitleRequired");
    }

    if (!form.employmentType) {
      return t("validation.employmentTypeRequired");
    }

    if (!form.jobDescription.trim()) {
      return t("validation.jobDescriptionRequired");
    }

    if (!form.workLocation.trim()) {
      return t("validation.workLocationRequired");
    }

    if (!form.contactPerson.trim()) {
      return t("validation.contactPersonRequired");
    }

    if (!form.contactEmail.trim()) {
      return t("validation.contactEmailRequired");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail)) {
      return t("validation.contactEmailInvalid");
    }

    if (
      form.salaryMin !== null &&
      form.salaryMax !== null &&
      form.salaryMin > form.salaryMax
    ) {
      return t("validation.salaryRangeInvalid");
    }

    return null;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validate();

    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      setSubmitting(true);

      const response =
        isEditMode && vacancy
          ? await updateProviderVacancy(vacancy.vacancyId, form)
          : await createProviderVacancy(form);

      toast.success(
        response.message ||
          (isEditMode ? t("toast.updated") : t("toast.created")),
      );

      await onSuccess();
    } catch (error: unknown) {
      console.error(
        isEditMode ? "Update vacancy error:" : "Create vacancy error:",
        error,
      );

      if (axios.isAxiosError<ProviderDashboardApiError>(error)) {
        console.error("Backend response:", error.response?.data);

        toast.error(
          error.response?.data?.message ||
            (isEditMode ? t("toast.updateFailed") : t("toast.createFailed")),
        );

        return;
      }

      toast.error(
        isEditMode ? t("toast.updateFailed") : t("toast.createFailed"),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 p-0 sm:p-4">
      <button
        type="button"
        aria-label={t("close")}
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="post-vacancy-title"
        className="relative z-10 h-full w-full overflow-y-auto bg-[#f4f5f8] text-[#1b1c21] sm:h-auto sm:max-h-[96vh] sm:max-w-6xl sm:rounded-[14px] sm:shadow-2xl"
      >
        {/* Header */}
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-black/[0.06] bg-white/85 px-5 py-3.5 backdrop-blur-md sm:px-7">
          <div className="min-w-0">
            <p className="text-xs text-slate-500">
              {isEditMode ? t("header.editEyebrow") : t("header.createEyebrow")}
            </p>
            <h2
              id="post-vacancy-title"
              className="truncate text-lg font-semibold leading-tight"
            >
              {isEditMode ? t("intro.editTitle") : t("intro.createTitle")}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t("close")}
            className={`${BTN} w-9 shrink-0 bg-white/80 !px-0 text-slate-600 ring-1 ring-black/10 hover:bg-white hover:text-slate-900`}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </header>

        {/* Intro */}
        <div className="px-5 pt-6 sm:px-8">
          <span className="inline-flex rounded-full bg-teal-800/5 px-3 py-1 text-xs font-medium text-teal-900 ring-1 ring-teal-800/10">
            {t("intro.badge")}
          </span>

          <p className="mt-3 max-w-2xl text-sm text-slate-500">
            {isEditMode
              ? t("intro.editDescription")
              : t("intro.createDescription")}
          </p>
        </div>

        {loadingProfile ? (
          <div
            role="status"
            className="flex min-h-[400px] items-center justify-center"
          >
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/80 ring-1 ring-black/5">
              <Loader2
                className="h-5 w-5 animate-spin text-teal-800"
                aria-hidden="true"
              />
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-8">
            <FormSection
              title={t("sections.company.title")}
              description={t("sections.company.description")}
            >
              <div className="grid gap-5 md:grid-cols-2">
                <InputField
                  label={t("fields.companyName")}
                  requiredLabel={t("required")}
                  required
                  value={form.companyName}
                  disabled
                  placeholder={t("placeholders.companyName")}
                  onChange={(value) => updateField("companyName", value)}
                />

                <InputField
                  label={t("fields.companyNameKana")}
                  requiredLabel={t("required")}
                  value={form.companyNameKana}
                  placeholder={t("placeholders.companyNameKana")}
                  onChange={(value) => updateField("companyNameKana", value)}
                />
              </div>
            </FormSection>

            <FormSection
              title={t("sections.position.title")}
              description={t("sections.position.description")}
            >
              <div className="grid gap-5 md:grid-cols-2">
                <InputField
                  label={t("fields.jobTitle")}
                  requiredLabel={t("required")}
                  required
                  value={form.title}
                  placeholder={t("placeholders.jobTitle")}
                  onChange={(value) => updateField("title", value)}
                />

                <InputField
                  label={t("fields.jobTitleKana")}
                  requiredLabel={t("required")}
                  value={form.titleKana}
                  placeholder={t("placeholders.jobTitleKana")}
                  onChange={(value) => updateField("titleKana", value)}
                />

                <SelectField
                  label={t("fields.employmentType")}
                  requiredLabel={t("required")}
                  placeholder={t("selectPlaceholder")}
                  required
                  value={form.employmentType}
                  options={EMPLOYMENT_TYPES}
                  getOptionLabel={(option) =>
                    t(`options.employmentTypes.${option.labelKey}`)
                  }
                  onChange={(value) => updateField("employmentType", value)}
                />

                <InputField
                  label={t("fields.numberOfOpenings")}
                  requiredLabel={t("required")}
                  type="number"
                  value={String(form.numberOfPeople)}
                  onChange={(value) =>
                    updateField("numberOfPeople", Math.max(1, Number(value)))
                  }
                />
              </div>
            </FormSection>

            <FormSection
              title={t("sections.description.title")}
              description={t("sections.description.description")}
            >
              <div className="space-y-5">
                <TextareaField
                  label={t("fields.jobDescription")}
                  requiredLabel={t("required")}
                  required
                  value={form.jobDescription}
                  placeholder={t("placeholders.jobDescription")}
                  onChange={(value) => updateField("jobDescription", value)}
                />

                <TextareaField
                  label={t("fields.responsibilities")}
                  requiredLabel={t("required")}
                  value={form.responsibilities}
                  placeholder={t("placeholders.responsibilities")}
                  onChange={(value) => updateField("responsibilities", value)}
                />
              </div>
            </FormSection>

            <FormSection
              title={t("sections.requirements.title")}
              description={t("sections.requirements.description")}
            >
              <div className="space-y-5">
                <TextareaField
                  label={t("fields.requiredSkills")}
                  requiredLabel={t("required")}
                  value={form.requiredSkills}
                  placeholder={t("placeholders.requiredSkills")}
                  onChange={(value) => updateField("requiredSkills", value)}
                />

                <TextareaField
                  label={t("fields.preferredSkills")}
                  requiredLabel={t("required")}
                  value={form.preferredSkills}
                  placeholder={t("placeholders.preferredSkills")}
                  onChange={(value) => updateField("preferredSkills", value)}
                />

                <div className="grid gap-5 md:grid-cols-2">
                  <InputField
                    label={t("fields.educationRequirements")}
                    requiredLabel={t("required")}
                    value={form.requiredEducation}
                    placeholder={t("placeholders.educationRequirements")}
                    onChange={(value) =>
                      updateField("requiredEducation", value)
                    }
                  />

                  <InputField
                    label={t("fields.yearsOfExperience")}
                    requiredLabel={t("required")}
                    value={form.requiredExperience}
                    placeholder={t("placeholders.yearsOfExperience")}
                    onChange={(value) =>
                      updateField("requiredExperience", value)
                    }
                  />

                  <SelectField
                    label={t("fields.japaneseLevel")}
                    requiredLabel={t("required")}
                    placeholder={t("selectPlaceholder")}
                    value={form.japaneseLevel}
                    options={JAPANESE_LEVELS}
                    getOptionLabel={(option) =>
                      t(`options.japaneseLevels.${option.labelKey}`)
                    }
                    onChange={(value) => updateField("japaneseLevel", value)}
                  />
                </div>
              </div>
            </FormSection>

            <FormSection
              title={t("sections.location.title")}
              description={t("sections.location.description")}
            >
              <div className="grid gap-5 md:grid-cols-2">
                <InputField
                  label={t("fields.workLocation")}
                  requiredLabel={t("required")}
                  required
                  value={form.workLocation}
                  placeholder={t("placeholders.workLocation")}
                  onChange={(value) => updateField("workLocation", value)}
                />

                <InputField
                  label={t("fields.detailedLocation")}
                  requiredLabel={t("required")}
                  value={form.workLocationDetail}
                  placeholder={t("placeholders.detailedLocation")}
                  onChange={(value) => updateField("workLocationDetail", value)}
                />

                <SelectField
                  label={t("fields.remoteWorkPolicy")}
                  requiredLabel={t("required")}
                  placeholder={t("selectPlaceholder")}
                  value={form.remoteWork}
                  options={REMOTE_WORK_OPTIONS}
                  getOptionLabel={(option) =>
                    t(`options.remoteWork.${option.labelKey}`)
                  }
                  onChange={(value) => updateField("remoteWork", value)}
                />

                <InputField
                  label={t("fields.salaryNotes")}
                  requiredLabel={t("required")}
                  value={form.salaryNote}
                  placeholder={t("placeholders.salaryNotes")}
                  onChange={(value) => updateField("salaryNote", value)}
                />
              </div>

              <div
                role="group"
                aria-labelledby="salary-range-label"
                className="mt-5"
              >
                <p
                  id="salary-range-label"
                  className="mb-1.5 text-sm font-medium text-slate-700"
                >
                  {t("fields.salaryRange")}
                </p>

                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    aria-label={t("fields.salaryRange")}
                    value={form.salaryMin ?? ""}
                    onChange={(event) =>
                      updateField(
                        "salaryMin",
                        event.target.value ? Number(event.target.value) : null,
                      )
                    }
                    className={`${CONTROL} font-mono tabular-nums`}
                  />

                  <span aria-hidden="true" className="text-slate-500">
                    ~
                  </span>

                  <input
                    type="number"
                    aria-label={t("fields.salaryRange")}
                    value={form.salaryMax ?? ""}
                    onChange={(event) =>
                      updateField(
                        "salaryMax",
                        event.target.value ? Number(event.target.value) : null,
                      )
                    }
                    className={`${CONTROL} font-mono tabular-nums`}
                  />

                  <span className="shrink-0 text-sm text-slate-500">
                    {t("salaryUnit")}
                  </span>
                </div>
              </div>
            </FormSection>

            <FormSection
              title={t("sections.schedule.title")}
              description={t("sections.schedule.description")}
            >
              <div className="grid gap-5 md:grid-cols-2">
                <InputField
                  label={t("fields.workingHours")}
                  requiredLabel={t("required")}
                  value={form.workHours}
                  onChange={(value) => updateField("workHours", value)}
                />

                <InputField
                  label={t("fields.breakTime")}
                  requiredLabel={t("required")}
                  value={form.breakTime}
                  onChange={(value) => updateField("breakTime", value)}
                />

                <InputField
                  label={t("fields.overtime")}
                  requiredLabel={t("required")}
                  value={form.overtime}
                  placeholder={t("placeholders.overtime")}
                  onChange={(value) => updateField("overtime", value)}
                />

                <InputField
                  label={t("fields.holidays")}
                  requiredLabel={t("required")}
                  value={form.holidays}
                  placeholder={t("placeholders.holidays")}
                  onChange={(value) => updateField("holidays", value)}
                />
              </div>
            </FormSection>

            <FormSection
              title={t("sections.benefits.title")}
              description={t("sections.benefits.description")}
            >
              <CheckboxGroup
                label={t("fields.benefits")}
                options={BENEFITS}
                selected={form.benefits}
                getOptionLabel={(option) =>
                  t(`options.benefits.${option.labelKey}`)
                }
                onToggle={(value) => toggleArrayValue("benefits", value)}
              />

              <div className="mt-6">
                <CheckboxGroup
                  label={t("fields.socialInsurance")}
                  options={INSURANCE}
                  selected={form.insurance}
                  getOptionLabel={(option) =>
                    t(`options.insurance.${option.labelKey}`)
                  }
                  onToggle={(value) => toggleArrayValue("insurance", value)}
                />
              </div>

              <div className="mt-6 max-w-md">
                <InputField
                  label={t("fields.trialPeriod")}
                  requiredLabel={t("required")}
                  value={form.trialPeriod}
                  placeholder={t("placeholders.trialPeriod")}
                  onChange={(value) => updateField("trialPeriod", value)}
                />
              </div>
            </FormSection>

            <FormSection
              title={t("sections.application.title")}
              description={t("sections.application.description")}
            >
              <div className="grid gap-5 md:grid-cols-2">
                <InputField
                  label={t("fields.applicationDeadline")}
                  requiredLabel={t("required")}
                  type="date"
                  value={form.applicationDeadline}
                  onChange={(value) =>
                    updateField("applicationDeadline", value)
                  }
                />

                <InputField
                  label={t("fields.startDate")}
                  requiredLabel={t("required")}
                  value={form.startDate}
                  placeholder={t("placeholders.startDate")}
                  onChange={(value) => updateField("startDate", value)}
                />
              </div>

              <div className="mt-5">
                <InputField
                  label={t("fields.selectionProcess")}
                  requiredLabel={t("required")}
                  value={form.selectionProcess}
                  placeholder={t("placeholders.selectionProcess")}
                  onChange={(value) => updateField("selectionProcess", value)}
                />
              </div>
            </FormSection>

            <FormSection
              title={t("sections.contact.title")}
              description={t("sections.contact.description")}
            >
              <div className="grid gap-5 md:grid-cols-2">
                <InputField
                  label={t("fields.contactPerson")}
                  requiredLabel={t("required")}
                  required
                  value={form.contactPerson}
                  placeholder={t("placeholders.contactPerson")}
                  onChange={(value) => updateField("contactPerson", value)}
                />

                <InputField
                  label={t("fields.contactPersonKana")}
                  requiredLabel={t("required")}
                  value={form.contactPersonKana}
                  placeholder={t("placeholders.contactPersonKana")}
                  onChange={(value) => updateField("contactPersonKana", value)}
                />

                <div className="md:col-span-2">
                  <InputField
                    label={t("fields.emailAddress")}
                    requiredLabel={t("required")}
                    type="email"
                    required
                    value={form.contactEmail}
                    placeholder="example@company.com"
                    onChange={(value) => updateField("contactEmail", value)}
                  />
                </div>
              </div>
            </FormSection>

            {/* Action bar (stays visible while scrolling the form) */}
            <div className="sticky bottom-0 z-10 -mx-5 -mb-5 flex flex-col gap-3 border-t border-black/[0.06] bg-white/90 px-5 py-3 backdrop-blur-md sm:-mx-8 sm:-mb-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <p className="text-xs text-slate-500">{t("footerNote")}</p>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => void resetForm()}
                  className={BTN_SECONDARY}
                >
                  {t("reset")}
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className={BTN_PRIMARY}
                >
                  {submitting && (
                    <Loader2
                      className="h-4 w-4 shrink-0 animate-spin"
                      aria-hidden="true"
                    />
                  )}

                  {submitting
                    ? isEditMode
                      ? t("saving")
                      : t("posting")
                    : isEditMode
                      ? t("saveChanges")
                      : t("postJobVacancy")}
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

  children: ReactNode;
}) {
  return (
    <section className={`p-5 sm:p-6 ${PANEL}`}>
      <div className="mb-5 border-b border-black/5 pb-4">
        <h3 className="text-base font-semibold">{title}</h3>

        {description && (
          <p className="mt-1 text-xs text-slate-500">{description}</p>
        )}
      </div>

      {children}
    </section>
  );
}

function FieldLabel({
  label,
  required,
  requiredLabel,
}: {
  label: string;
  required?: boolean;
  requiredLabel: string;
}) {
  return (
    <span className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-700">
      {label}

      {required && (
        <span className="text-xs font-medium text-red-700">
          {requiredLabel}
        </span>
      )}
    </span>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  requiredLabel,
  disabled,
}: {
  label: string;

  value: string;

  onChange: (value: string) => void;

  placeholder?: string;

  type?: string;

  required?: boolean;

  requiredLabel: string;

  disabled?: boolean;
}) {
  const isNumeric = type === "number" || type === "date";

  return (
    <label className="block">
      <FieldLabel
        label={label}
        required={required}
        requiredLabel={requiredLabel}
      />

      <input
        type={type}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        aria-required={required || undefined}
        onChange={(event) => onChange(event.target.value)}
        className={`${CONTROL} ${isNumeric ? "font-mono tabular-nums" : ""}`}
      />
    </label>
  );
}

function TextareaField({
  label,
  value,
  onChange,
  placeholder,
  required,
  requiredLabel,
}: {
  label: string;

  value: string;

  onChange: (value: string) => void;

  placeholder?: string;

  required?: boolean;

  requiredLabel: string;
}) {
  return (
    <label className="block">
      <FieldLabel
        label={label}
        required={required}
        requiredLabel={requiredLabel}
      />

      <textarea
        rows={4}
        value={value}
        placeholder={placeholder}
        aria-required={required || undefined}
        onChange={(event) => onChange(event.target.value)}
        className={`${CONTROL} resize-y leading-6`}
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
  required,
  requiredLabel,
  placeholder,
  getOptionLabel,
}: {
  label: string;

  value: string;

  options: Option[];

  onChange: (value: string) => void;

  required?: boolean;

  requiredLabel: string;

  placeholder: string;

  getOptionLabel: (option: Option) => string;
}) {
  return (
    <label className="block">
      <FieldLabel
        label={label}
        required={required}
        requiredLabel={requiredLabel}
      />

      <select
        value={value}
        aria-required={required || undefined}
        onChange={(event) => onChange(event.target.value)}
        className={CONTROL}
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

function CheckboxGroup({
  label,
  options,
  selected,
  onToggle,
  getOptionLabel,
}: {
  label: string;

  options: Option[];

  selected: string[];

  onToggle: (value: string) => void;

  getOptionLabel: (option: Option) => string;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium text-slate-700">
        {label}
      </legend>

      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {options.map((option) => {
          const checked = selected.includes(option.value);

          return (
            <label
              key={option.value}
              className={`flex cursor-pointer items-center gap-3 rounded-[12px] px-3.5 py-2.5 text-sm ring-1 transition-colors focus-within:ring-2 focus-within:ring-teal-800/50 ${
                checked
                  ? "bg-teal-800/5 text-teal-900 ring-teal-800/30"
                  : "bg-white ring-black/10 hover:bg-white/80"
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(option.value)}
                className="h-4 w-4 shrink-0 accent-teal-800 focus:outline-none"
              />

              <span className="min-w-0 break-words">
                {getOptionLabel(option)}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}