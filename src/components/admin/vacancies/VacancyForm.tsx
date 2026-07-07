"use client";

import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { VACANCY_FORM_CONTENT } from "@/constants/vacancy-form.constant";
import toast from "react-hot-toast";
import axiosInstance from "@/services/axiosInstance";

interface VacancyFormData {
  companyName: string;
  companyNameKana: string;
  title: string;
  titleKana: string;
  employmentType: string;
  numberOfPeople: number;
  jobDescription: string;
  responsibilities: string;
  requiredSkills: string;
  preferredSkills: string;
  requiredEducation: string;
  requiredExperience: string;
  japaneseLevel: string;
  workLocation: string;
  workLocationDetail: string;
  remoteWork: string;
  salaryMin: number;
  salaryMax: number;
  salaryNote: string;
  workHours: string;
  breakTime: string;
  overtime: string;
  holidays: string;
  benefits: string[];
  insurance: string[];
  trialPeriod: string;
  applicationDeadline: string;
  startDate: string;
  selectionProcess: string;
  contactPerson: string;
  contactPersonKana: string;
  contactEmail: string;
}

type VacancyFormProps = {
  userId: number;
  mode?: "create" | "edit";
  vacancyId?: number;
  initialData?: Partial<VacancyFormData>;
  onSuccess?: (result?: unknown) => void;
};

const getInitialFormData = (): VacancyFormData => ({
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
  salaryMin: 300,
  salaryMax: 500,
  salaryNote: "",
  workHours: "9:00 - 18:00",
  breakTime: "12:00 - 13:00",
  overtime: "About 20 hours per month on average",
  holidays:
    "Weekends and public holidays, summer vacation, and the year-end/New Year holidays",
  benefits: [],
  insurance: [],
  trialPeriod: "Three months",
  applicationDeadline: "",
  startDate: "",
  selectionProcess:
    "Document screening → First interview → Final interview → Job offer",
  contactPerson: "",
  contactPersonKana: "",
  contactEmail: "",
});

const normalizeFormData = (
  data?: Partial<VacancyFormData>,
): VacancyFormData => {
  const base = getInitialFormData();

  if (!data) return base;

  return {
    ...base,
    ...data,
    numberOfPeople: Number(data.numberOfPeople ?? base.numberOfPeople),
    salaryMin: Number(data.salaryMin ?? base.salaryMin),
    salaryMax: Number(data.salaryMax ?? base.salaryMax),
    benefits: Array.isArray(data.benefits) ? data.benefits : base.benefits,
    insurance: Array.isArray(data.insurance) ? data.insurance : base.insurance,
    applicationDeadline: data.applicationDeadline ?? base.applicationDeadline,
  };
};

export default function VacancyForm({
  userId,
  mode = "create",
  vacancyId,
  initialData,
  onSuccess,
}: VacancyFormProps) {
  const { lang } = useLanguage();
  const content = VACANCY_FORM_CONTENT;
  const f = content.form;
  const isEditMode = mode === "edit";

  const [formData, setFormData] = useState<VacancyFormData>(
    normalizeFormData(initialData),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success?: boolean;
    message?: string;
  }>({});

  useEffect(() => {
    setFormData(normalizeFormData(initialData));
  }, [initialData]);

  const stats = useMemo(
    () => [
      { label: f.positionSection[lang], value: formData.title || "-" },
      {
        label: f.workLocation.label[lang],
        value: formData.workLocation || "-",
      },
      {
        label: f.numberOfPeople.label[lang],
        value: String(formData.numberOfPeople || 0),
      },
    ],
    [f, formData.numberOfPeople, formData.title, formData.workLocation, lang],
  );

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: parseInt(value, 10) || 0 }));
  };

  const handleCheckboxGroup = (
    name: "benefits" | "insurance",
    value: string,
  ) => {
    setFormData((prev) => {
      const current = prev[name];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [name]: updated };
    });
  };

  const resetForm = () => {
    setFormData(normalizeFormData(isEditMode ? initialData : undefined));
    setSubmitStatus({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({});

    try {
      const endpoint = isEditMode
        ? "/admin-update-vacancy.php"
        : "/admin-submit-vacancy.php";

      const payload = {
        ...formData,
        uploadedBy: userId,
        ...(isEditMode ? { id: vacancyId } : {}),
      };

      const response = await axiosInstance.post(endpoint, payload);
      const result = response.data;

      const successMessage =
        result.message ||
        (isEditMode ? "Vacancy updated successfully" : f.successMessage[lang]);

      setSubmitStatus({
        success: true,
        message: successMessage,
      });

      if (!isEditMode) {
        resetForm();
      }

      toast.success(successMessage);
      onSuccess?.(result);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        f.errorMessage[lang];

      setSubmitStatus({
        success: false,
        message,
      });

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="border-b border-slate-200 px-6 py-8 sm:px-8 lg:px-10 dark:border-slate-700">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {mode === "edit" &&
                  stats.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800"
                    >
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {item.label}
                      </p>
                      <p className="mt-1 truncate text-sm font-semibold text-slate-900 dark:text-white">
                        {item.value}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="px-6 py-6 sm:px-8 lg:px-10">
            {submitStatus.message && (
              <div
                className={`mb-8 rounded-2xl border px-4 py-3 text-sm font-medium ${
                  submitStatus.success
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-900/30 dark:text-rose-400"
                }`}
              >
                {submitStatus.message}
              </div>
            )}

            <div className="space-y-6">
              <Section
                title={f.companyInfoSection[lang]}
                description={f.companyName.placeholder[lang]}
              >
                <Field
                  label={f.companyName.label[lang]}
                  required={f.companyName.required}
                >
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder={f.companyName.placeholder[lang]}
                    className={inputClassName}
                    required={f.companyName.required}
                  />
                </Field>
                <Field label={f.companyNameKana.label[lang]}>
                  <input
                    type="text"
                    name="companyNameKana"
                    value={formData.companyNameKana}
                    onChange={handleInputChange}
                    placeholder={f.companyNameKana.placeholder[lang]}
                    className={inputClassName}
                  />
                </Field>
              </Section>

              <Section
                title={f.positionSection[lang]}
                description={f.title.placeholder[lang]}
              >
                <Field label={f.title.label[lang]} required={f.title.required}>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder={f.title.placeholder[lang]}
                    className={inputClassName}
                    required={f.title.required}
                  />
                </Field>
                <Field label={f.titleKana.label[lang]}>
                  <input
                    type="text"
                    name="titleKana"
                    value={formData.titleKana}
                    onChange={handleInputChange}
                    placeholder={f.titleKana.placeholder[lang]}
                    className={inputClassName}
                  />
                </Field>
                <Field
                  label={f.employmentType.label[lang]}
                  required={f.employmentType.required}
                >
                  <select
                    name="employmentType"
                    value={formData.employmentType}
                    onChange={handleInputChange}
                    className={inputClassName}
                    required={f.employmentType.required}
                  >
                    <option value="">
                      {f.employmentType.placeholder[lang]}
                    </option>
                    {f.employmentType.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label[lang]}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label={f.numberOfPeople.label[lang]}>
                  <input
                    type="number"
                    name="numberOfPeople"
                    value={formData.numberOfPeople}
                    onChange={handleNumberChange}
                    className={inputClassName}
                    min="1"
                  />
                </Field>
              </Section>

              <Section
                title={f.jobDescriptionSection[lang]}
                description={f.jobDescription.placeholder[lang]}
              >
                <Field
                  label={f.jobDescription.label[lang]}
                  required={f.jobDescription.required}
                  className="md:col-span-2"
                >
                  <textarea
                    name="jobDescription"
                    rows={5}
                    value={formData.jobDescription}
                    onChange={handleInputChange}
                    placeholder={f.jobDescription.placeholder[lang]}
                    className={textareaClassName}
                    required={f.jobDescription.required}
                  />
                </Field>
                <Field
                  label={f.responsibilities.label[lang]}
                  className="md:col-span-2"
                >
                  <textarea
                    name="responsibilities"
                    rows={4}
                    value={formData.responsibilities}
                    onChange={handleInputChange}
                    placeholder={f.responsibilities.placeholder[lang]}
                    className={textareaClassName}
                  />
                </Field>
              </Section>

              <Section
                title={f.requirementsSection[lang]}
                description={f.requiredSkills.placeholder[lang]}
              >
                <Field
                  label={f.requiredSkills.label[lang]}
                  className="md:col-span-2"
                >
                  <textarea
                    name="requiredSkills"
                    rows={4}
                    value={formData.requiredSkills}
                    onChange={handleInputChange}
                    placeholder={f.requiredSkills.placeholder[lang]}
                    className={textareaClassName}
                  />
                </Field>
                <Field
                  label={f.preferredSkills.label[lang]}
                  className="md:col-span-2"
                >
                  <textarea
                    name="preferredSkills"
                    rows={4}
                    value={formData.preferredSkills}
                    onChange={handleInputChange}
                    placeholder={f.preferredSkills.placeholder[lang]}
                    className={textareaClassName}
                  />
                </Field>
                <Field label={f.requiredEducation.label[lang]}>
                  <input
                    type="text"
                    name="requiredEducation"
                    value={formData.requiredEducation}
                    onChange={handleInputChange}
                    placeholder={f.requiredEducation.placeholder[lang]}
                    className={inputClassName}
                  />
                </Field>
                <Field label={f.requiredExperience.label[lang]}>
                  <input
                    type="text"
                    name="requiredExperience"
                    value={formData.requiredExperience}
                    onChange={handleInputChange}
                    placeholder={f.requiredExperience.placeholder[lang]}
                    className={inputClassName}
                  />
                </Field>
                <Field
                  label={f.japaneseLevel.label[lang]}
                  required={f.japaneseLevel.required}
                >
                  <select
                    name="japaneseLevel"
                    value={formData.japaneseLevel}
                    onChange={handleInputChange}
                    className={inputClassName}
                    required={f.japaneseLevel.required}
                  >
                    <option value="">
                      {f.japaneseLevel.placeholder[lang]}
                    </option>
                    {f.japaneseLevel.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label[lang]}
                      </option>
                    ))}
                  </select>
                </Field>
              </Section>

              <Section
                title={f.locationSection[lang]}
                description={f.workLocation.placeholder[lang]}
              >
                <Field
                  label={f.workLocation.label[lang]}
                  required={f.workLocation.required}
                >
                  <input
                    type="text"
                    name="workLocation"
                    value={formData.workLocation}
                    onChange={handleInputChange}
                    placeholder={f.workLocation.placeholder[lang]}
                    className={inputClassName}
                    required={f.workLocation.required}
                  />
                </Field>
                <Field label={f.workLocationDetail.label[lang]}>
                  <input
                    type="text"
                    name="workLocationDetail"
                    value={formData.workLocationDetail}
                    onChange={handleInputChange}
                    placeholder={f.workLocationDetail.placeholder[lang]}
                    className={inputClassName}
                  />
                </Field>
                <Field label={f.remoteWork.label[lang]}>
                  <select
                    name="remoteWork"
                    value={formData.remoteWork}
                    onChange={handleInputChange}
                    className={inputClassName}
                  >
                    <option value="">{f.remoteWork.placeholder[lang]}</option>
                    {f.remoteWork.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label[lang]}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label={f.salaryNote.label[lang]}>
                  <input
                    type="text"
                    name="salaryNote"
                    value={formData.salaryNote}
                    onChange={handleInputChange}
                    placeholder={f.salaryNote.placeholder[lang]}
                    className={inputClassName}
                  />
                </Field>
                <Field
                  label={`${f.salaryMin.label[lang]} / ${f.salaryMax.label[lang]}`}
                  className="md:col-span-2"
                >
                  <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr_auto] sm:items-center">
                    <input
                      type="number"
                      name="salaryMin"
                      value={formData.salaryMin}
                      onChange={handleNumberChange}
                      placeholder={f.salaryMin.placeholder[lang]}
                      className={inputClassName}
                    />
                    <span className="hidden text-sm font-medium text-slate-500 sm:block dark:text-slate-400">
                      〜
                    </span>
                    <input
                      type="number"
                      name="salaryMax"
                      value={formData.salaryMax}
                      onChange={handleNumberChange}
                      placeholder={f.salaryMax.placeholder[lang]}
                      className={inputClassName}
                    />
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      万円
                    </span>
                  </div>
                </Field>
              </Section>

              <Section
                title={f.scheduleSection[lang]}
                description={f.workHours.placeholder[lang]}
              >
                <Field label={f.workHours.label[lang]}>
                  <input
                    type="text"
                    name="workHours"
                    value={formData.workHours}
                    onChange={handleInputChange}
                    placeholder={f.workHours.placeholder[lang]}
                    className={inputClassName}
                  />
                </Field>
                <Field label={f.breakTime.label[lang]}>
                  <input
                    type="text"
                    name="breakTime"
                    value={formData.breakTime}
                    onChange={handleInputChange}
                    placeholder={f.breakTime.placeholder[lang]}
                    className={inputClassName}
                  />
                </Field>
                <Field label={f.overtime.label[lang]}>
                  <input
                    type="text"
                    name="overtime"
                    value={formData.overtime}
                    onChange={handleInputChange}
                    placeholder={f.overtime.placeholder[lang]}
                    className={inputClassName}
                  />
                </Field>
                <Field label={f.holidays.label[lang]}>
                  <input
                    type="text"
                    name="holidays"
                    value={formData.holidays}
                    onChange={handleInputChange}
                    placeholder={f.holidays.placeholder[lang]}
                    className={inputClassName}
                  />
                </Field>
              </Section>

              <Section
                title={f.benefitsSection[lang]}
                description={f.benefits.label[lang]}
              >
                <Field label={f.benefits.label[lang]} className="md:col-span-2">
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {f.benefits.options.map((benefit) => {
                      const checked = formData.benefits.includes(benefit.value);

                      return (
                        <label
                          key={benefit.value}
                          className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition ${
                            checked
                              ? "border-slate-900 bg-slate-900 text-white dark:border-indigo-600 dark:bg-indigo-600"
                              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-700"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              handleCheckboxGroup("benefits", benefit.value)
                            }
                            className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 dark:bg-slate-700"
                          />
                          <span className="font-medium">
                            {benefit.label[lang]}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </Field>
                <Field
                  label={f.insurance.label[lang]}
                  className="md:col-span-2"
                >
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {f.insurance.options.map((ins) => {
                      const checked = formData.insurance.includes(ins.value);

                      return (
                        <label
                          key={ins.value}
                          className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition ${
                            checked
                              ? "border-slate-900 bg-slate-900 text-white dark:border-indigo-600 dark:bg-indigo-600"
                              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-700"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              handleCheckboxGroup("insurance", ins.value)
                            }
                            className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 dark:bg-slate-700"
                          />
                          <span className="font-medium">{ins.label[lang]}</span>
                        </label>
                      );
                    })}
                  </div>
                </Field>
                <Field label={f.trialPeriod.label[lang]}>
                  <input
                    type="text"
                    name="trialPeriod"
                    value={formData.trialPeriod}
                    onChange={handleInputChange}
                    placeholder={f.trialPeriod.placeholder[lang]}
                    className={inputClassName}
                  />
                </Field>
              </Section>

              <Section
                title={f.applicationSection[lang]}
                description={f.selectionProcess.placeholder[lang]}
              >
                <Field label={f.applicationDeadline.label[lang]}>
                  <input
                    type="date"
                    name="applicationDeadline"
                    value={formData.applicationDeadline}
                    onChange={handleInputChange}
                    className={inputClassName}
                  />
                </Field>
                <Field label={f.startDate.label[lang]}>
                  <input
                    type="text"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    placeholder={f.startDate.placeholder[lang]}
                    className={inputClassName}
                  />
                </Field>
                <Field
                  label={f.selectionProcess.label[lang]}
                  className="md:col-span-2"
                >
                  <input
                    type="text"
                    name="selectionProcess"
                    value={formData.selectionProcess}
                    onChange={handleInputChange}
                    placeholder={f.selectionProcess.placeholder[lang]}
                    className={inputClassName}
                  />
                </Field>
              </Section>

              <Section
                title={f.contactSection[lang]}
                description={f.contactEmail.placeholder[lang]}
              >
                <Field label={f.contactPerson.label[lang]} required>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    placeholder={f.contactPerson.placeholder[lang]}
                    className={inputClassName}
                    required
                  />
                </Field>
                <Field label={f.contactPersonKana.label[lang]}>
                  <input
                    type="text"
                    name="contactPersonKana"
                    value={formData.contactPersonKana}
                    onChange={handleInputChange}
                    placeholder={f.contactPersonKana.placeholder[lang]}
                    className={inputClassName}
                  />
                </Field>
                <Field
                  label={f.contactEmail.label[lang]}
                  required
                  className="md:col-span-2"
                >
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    placeholder={f.contactEmail.placeholder[lang]}
                    className={inputClassName}
                    required
                  />
                </Field>
              </Section>
            </div>
          </div>

          <div className="border-t border-slate-200 bg-slate-50 px-6 py-6 sm:px-8 lg:px-10 dark:border-slate-700 dark:bg-slate-800/50">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <p className="max-w-2xl text-xs leading-5 text-slate-500 dark:text-slate-400">
                {f.privacyNote[lang]}
              </p>
              <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex min-w-[140px] cursor-pointer items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:bg-slate-700"
                >
                  {isEditMode ? "Reset Changes" : f.reset[lang]}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex min-w-[180px] cursor-pointer items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:disabled:bg-slate-600"
                >
                  {isSubmitting
                    ? f.submitting[lang]
                    : isEditMode
                      ? "Update Vacancy"
                      : f.submit[lang]}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

const inputClassName =
  "h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/20";

const textareaClassName =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/20";

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6 dark:border-slate-700 dark:bg-slate-800/50">
      <div className="mb-5 flex flex-col gap-2 border-b border-slate-200 pb-4 sm:flex-row sm:items-end sm:justify-between dark:border-slate-700">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 sm:text-xl dark:text-white">
            {title}
          </h2>
          {description ? (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">{children}</div>
    </section>
  );
}

function Field({
  label,
  children,
  required = false,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
        <span>{label}</span>
        {required ? (
          <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
            Required
          </span>
        ) : null}
      </label>
      {children}
    </div>
  );
}
