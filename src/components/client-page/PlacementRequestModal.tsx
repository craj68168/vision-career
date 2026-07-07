// components/PlacementRequestModal.tsx
"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { PLACEMENT_REQUEST_FORM } from "@/constants/placement-request-form.constant";
import toast from "react-hot-toast";
import axiosInstance from "@/services/axiosInstance";
import {
  PlacementRequestFormData,
  PlacementRequestModalProps,
} from "@/types/placement-request.types";
import { X } from "lucide-react";

const getInitialFormData = (companyId: number): PlacementRequestFormData => ({
  company_id: companyId,
  job_title: "",
  job_category: "",
  employment_type: "",
  number_of_positions: 1,
  work_location: "",
  job_description: "",
  requirements: "",
  japanese_level_required: "",
  visa_type_required: "",
  salary_type: "",
  salary_amount: 0,
  working_hours: "",
  days_off: "",
  start_date: "",
});

export default function PlacementRequestModal({
  isOpen,
  onClose,
  companyId,
  onSuccess,
}: PlacementRequestModalProps) {
  const { lang } = useLanguage();
  const content = PLACEMENT_REQUEST_FORM;
  const f = content.form;

  const [formData, setFormData] = useState<PlacementRequestFormData>(
    getInitialFormData(companyId),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Reset form when companyId changes
  useEffect(() => {
    setFormData(getInitialFormData(companyId));
    setValidationErrors({});
  }, [companyId]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value) || 0;
    setFormData((prev) => ({ ...prev, [name]: numValue }));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.job_title.trim()) {
      errors.job_title = f.jobTitle.label[lang] + " is required";
    }
    if (!formData.job_category) {
      errors.job_category = f.jobCategory.label[lang] + " is required";
    }
    if (!formData.employment_type) {
      errors.employment_type = f.employmentType.label[lang] + " is required";
    }
    if (formData.number_of_positions < 1) {
      errors.number_of_positions = "Must be at least 1";
    }
    if (!formData.work_location.trim()) {
      errors.work_location = f.workLocation.label[lang] + " is required";
    }
    if (!formData.job_description.trim()) {
      errors.job_description = f.jobDescription.label[lang] + " is required";
    }
    if (!formData.japanese_level_required) {
      errors.japanese_level_required =
        f.japaneseLevel.label[lang] + " is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error(f.requiredFields[lang]);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axiosInstance.post(
        "/add-placement-request.php",
        formData,
      );
      const result = response.data;

      toast.success(f.successMessage[lang]);
      onSuccess?.(result);
      onClose();
      resetForm();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        f.errorMessage[lang];
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData(getInitialFormData(companyId));
    setValidationErrors({});
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                {content.title[lang]}
              </h2>
              <p className="text-sm text-slate-500">
                {content.subheading[lang]}
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 hover:bg-slate-100 transition-colors"
            >
              <X className="h-6 w-6 text-slate-500" />
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="max-h-[70vh] overflow-y-auto px-6 py-6"
          >
            <div className="space-y-6">
              {/* Position Information */}
              <Section title={f.positionInfo[lang]}>
                <Field
                  label={f.jobTitle.label[lang]}
                  required
                  error={validationErrors.job_title}
                >
                  <input
                    type="text"
                    name="job_title"
                    value={formData.job_title}
                    onChange={handleInputChange}
                    placeholder={f.jobTitle.placeholder[lang]}
                    className={getInputClassName(!!validationErrors.job_title)}
                  />
                </Field>

                <Field
                  label={f.jobCategory.label[lang]}
                  required
                  error={validationErrors.job_category}
                >
                  <select
                    name="job_category"
                    value={formData.job_category}
                    onChange={handleInputChange}
                    className={getInputClassName(
                      !!validationErrors.job_category,
                    )}
                  >
                    <option value="">{f.jobCategory.placeholder[lang]}</option>
                    {f.jobCategory.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label[lang]}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field
                  label={f.employmentType.label[lang]}
                  required
                  error={validationErrors.employment_type}
                >
                  <select
                    name="employment_type"
                    value={formData.employment_type}
                    onChange={handleInputChange}
                    className={getInputClassName(
                      !!validationErrors.employment_type,
                    )}
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

                <Field
                  label={f.numberOfPositions.label[lang]}
                  error={validationErrors.number_of_positions}
                >
                  <input
                    type="number"
                    name="number_of_positions"
                    value={formData.number_of_positions}
                    onChange={handleNumberChange}
                    min="1"
                    className={getInputClassName(
                      !!validationErrors.number_of_positions,
                    )}
                  />
                </Field>

                <Field
                  label={f.workLocation.label[lang]}
                  required
                  error={validationErrors.work_location}
                  className="md:col-span-2"
                >
                  <input
                    type="text"
                    name="work_location"
                    value={formData.work_location}
                    onChange={handleInputChange}
                    placeholder={f.workLocation.placeholder[lang]}
                    className={getInputClassName(
                      !!validationErrors.work_location,
                    )}
                  />
                </Field>
              </Section>

              {/* Job Description */}
              <Section title={f.jobDescription.label[lang]}>
                <Field
                  label={f.jobDescription.label[lang]}
                  required
                  error={validationErrors.job_description}
                  className="md:col-span-2"
                >
                  <textarea
                    name="job_description"
                    rows={4}
                    value={formData.job_description}
                    onChange={handleInputChange}
                    placeholder={f.jobDescription.placeholder[lang]}
                    className={getTextareaClassName(
                      !!validationErrors.job_description,
                    )}
                  />
                </Field>

                <Field
                  label={f.jobRequirements.label[lang]}
                  className="md:col-span-2"
                >
                  <textarea
                    name="requirements"
                    rows={4}
                    value={formData.requirements}
                    onChange={handleInputChange}
                    placeholder={f.jobRequirements.placeholder[lang]}
                    className={getTextareaClassName()}
                  />
                </Field>
              </Section>

              {/* Requirements */}
              <Section title={f.requirements[lang]}>
                <Field
                  label={f.japaneseLevel.label[lang]}
                  required
                  error={validationErrors.japanese_level_required}
                >
                  <select
                    name="japanese_level_required"
                    value={formData.japanese_level_required}
                    onChange={handleInputChange}
                    className={getInputClassName(
                      !!validationErrors.japanese_level_required,
                    )}
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

                <Field label={f.visaType.label[lang]}>
                  <input
                    type="text"
                    name="visa_type_required"
                    value={formData.visa_type_required}
                    onChange={handleInputChange}
                    placeholder={f.visaType.placeholder[lang]}
                    className={getInputClassName()}
                  />
                </Field>
              </Section>

              {/* Compensation */}
              <Section title={f.compensation[lang]}>
                <Field label={f.salaryType.label[lang]}>
                  <select
                    name="salary_type"
                    value={formData.salary_type}
                    onChange={handleInputChange}
                    className={getInputClassName()}
                  >
                    <option value="">{f.salaryType.placeholder[lang]}</option>
                    {f.salaryType.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label[lang]}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label={f.salaryAmount.label[lang]}>
                  <div className="relative">
                    <input
                      type="number"
                      name="salary_amount"
                      value={formData.salary_amount || ""}
                      onChange={handleNumberChange}
                      placeholder={f.salaryAmount.placeholder[lang]}
                      className={getInputClassName()}
                      step="0.01"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                      ¥
                    </span>
                  </div>
                </Field>

                <Field
                  label={f.workingHours.label[lang]}
                  className="md:col-span-2"
                >
                  <input
                    type="text"
                    name="working_hours"
                    value={formData.working_hours}
                    onChange={handleInputChange}
                    placeholder={f.workingHours.placeholder[lang]}
                    className={getInputClassName()}
                  />
                </Field>

                <Field label={f.daysOff.label[lang]} className="md:col-span-2">
                  <input
                    type="text"
                    name="days_off"
                    value={formData.days_off}
                    onChange={handleInputChange}
                    placeholder={f.daysOff.placeholder[lang]}
                    className={getInputClassName()}
                  />
                </Field>

                <Field
                  label={f.startDate.label[lang]}
                  className="md:col-span-2"
                >
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    className={getInputClassName()}
                  />
                </Field>
              </Section>
            </div>
          </form>

          {/* Footer */}
          <div className="border-t border-slate-200 px-6 py-4 bg-slate-50 rounded-b-2xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-500">{f.privacyNote[lang]}</p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  {f.reset[lang]}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                  className="rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {isSubmitting ? f.submitting[lang] : f.submit[lang]}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper components
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5">
      <h3 className="mb-4 text-base font-semibold text-slate-900">{title}</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

function Field({
  label,
  children,
  required = false,
  error,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  error?: string;
  className?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  );
}

// Helper functions for styling
const getInputClassName = (hasError = false) => {
  const base =
    "w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400";
  const normal =
    "border-slate-200 focus:border-slate-900 focus:ring-4 focus:ring-slate-200";
  const error =
    "border-rose-500 focus:border-rose-500 focus:ring-4 focus:ring-rose-100";
  return `${base} ${hasError ? error : normal}`;
};

const getTextareaClassName = (hasError = false) => {
  const base =
    "w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400";
  const normal =
    "border-slate-200 focus:border-slate-900 focus:ring-4 focus:ring-slate-200";
  const error =
    "border-rose-500 focus:border-rose-500 focus:ring-4 focus:ring-rose-100";
  return `${base} ${hasError ? error : normal}`;
};
