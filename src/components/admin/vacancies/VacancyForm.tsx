"use client";

import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { VACANCY_FORM_CONTENT } from "@/constants/vacancy-form.constant";
import toast from "react-hot-toast";
import axiosInstance from "@/services/axiosInstance";
import {
  Search,
  Building2,
  User,
  ChevronDown,
  RefreshCw,
  Loader,
} from "lucide-react";

interface VacancyFormData {
  uploadedBy: number;
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

type JobProvider = {
  id: number;
  name: string;
  company_name: string;
  email: string;
  contactPerson?: string;
  contactPersonEmail?: string;
};

type VacancyFormProps = {
  userId: number;
  mode?: "create" | "edit";
  vacancyId?: number;
  initialData?: Partial<VacancyFormData>;
  onSuccess?: (result?: unknown) => void;
};

const getInitialFormData = (): VacancyFormData => ({
  uploadedBy: 0,
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

    uploadedBy: Number(data.uploadedBy ?? base.uploadedBy),

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
  console.log(initialData);
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

  // Provider selection state
  const [providers, setProviders] = useState<JobProvider[]>([]);

  const [selectedProviderId, setSelectedProviderId] = useState<number | null>(
    null,
  );

  const [isLoadingProviders, setIsLoadingProviders] = useState(true);

  const [providerSearch, setProviderSearch] = useState("");

  const [showProviderDropdown, setShowProviderDropdown] = useState(false);

  // Fetch providers list
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setIsLoadingProviders(true);

        const response = await axiosInstance.get(
          "/get_admin_providers.php?limit=100",
        );

        if (response.data?.ok && Array.isArray(response.data?.data)) {
          setProviders(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch providers:", error);

        toast.error(
          lang === "ja"
            ? "企業情報の取得に失敗しました"
            : "Failed to fetch providers",
        );
      } finally {
        setIsLoadingProviders(false);
      }
    };

    fetchProviders();
  }, [lang]);

  useEffect(() => {
    if (!isEditMode || !initialData?.uploadedBy) {
      return;
    }

    const providerId = Number(initialData.uploadedBy);

    if (!providerId) {
      setSelectedProviderId(null);
      return;
    }

    const provider = providers.find((item) => Number(item.id) === providerId);

    if (provider) {
      setSelectedProviderId(provider.id);

      setFormData((prev) => ({
        ...prev,
        uploadedBy: provider.id,
        companyName:
          prev.companyName || provider.company_name || provider.name || "",
        contactPerson:
          prev.contactPerson || provider.contactPerson || provider.name || "",
        contactEmail:
          prev.contactEmail ||
          provider.contactPersonEmail ||
          provider.email ||
          "",
      }));
    }
  }, [isEditMode, initialData?.uploadedBy, providers]);

  // Filter providers based on search
  const filteredProviders = useMemo(() => {
    if (!providerSearch.trim()) return providers;

    const searchLower = providerSearch.toLowerCase();

    return providers.filter(
      (provider) =>
        provider.company_name?.toLowerCase().includes(searchLower) ||
        provider.name?.toLowerCase().includes(searchLower) ||
        provider.email?.toLowerCase().includes(searchLower),
    );
  }, [providers, providerSearch]);

  // Currently selected provider
  const selectedProvider = useMemo(() => {
    if (!selectedProviderId) return null;

    return (
      providers.find((provider) => provider.id === selectedProviderId) ?? null
    );
  }, [providers, selectedProviderId]);

  // Auto-fill company info when provider is selected
  const handleProviderSelect = (provider: JobProvider) => {
    setSelectedProviderId(provider.id);

    setFormData((prev) => ({
      ...prev,
      uploadedBy: provider.id,
      companyName: provider.company_name || provider.name || "",
      companyNameKana: "",
      contactPerson: provider.contactPerson || provider.name || "",
      contactPersonKana: "",
      contactEmail: provider.contactPersonEmail || provider.email || "",
    }));

    setShowProviderDropdown(false);
    setProviderSearch("");

    toast.success(
      lang === "ja"
        ? "企業情報を自動入力しました"
        : "Company information auto-filled",
    );
  };

  const stats = useMemo(
    () => [
      {
        label: f.positionSection[lang],
        value: formData.title || "-",
      },
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

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: parseInt(value, 10) || 0,
    }));
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

      return {
        ...prev,
        [name]: updated,
      };
    });
  };

  const resetForm = () => {
    const normalized = normalizeFormData(isEditMode ? initialData : undefined);

    setFormData(normalized);

    const providerId = Number(normalized.uploadedBy);

    setSelectedProviderId(providerId > 0 ? providerId : null);

    setProviderSearch("");
    setShowProviderDropdown(false);
    setSubmitStatus({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Provider selection is required in both create and edit mode
    if (!selectedProviderId) {
      toast.error(
        lang === "ja"
          ? "企業（求人提供者）を選択してください"
          : "Please select a job provider",
      );

      return;
    }

    if (isEditMode && !vacancyId) {
      toast.error(
        lang === "ja" ? "求人IDが見つかりません" : "Vacancy ID is missing",
      );

      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({});

    try {
      const endpoint = isEditMode
        ? "/admin-update-vacancy.php"
        : "/admin-submit-vacancy.php";

      const payload = {
        ...formData,

        uploadedBy: selectedProviderId,

        ...(isEditMode
          ? {
              id: vacancyId,
            }
          : {}),
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
        setFormData(getInitialFormData());
        setSelectedProviderId(null);
        setProviderSearch("");
        setShowProviderDropdown(false);
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
        <div className="overflow-hidden bg-white dark:bg-slate-900">
          <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-indigo-50 px-6 py-6 sm:px-8 lg:px-10 dark:border-slate-700 dark:from-slate-800 dark:to-slate-800/50">
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {lang === "ja" ? "求人提供者の選択" : "Select Job Provider"}
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {lang === "ja"
                    ? "この求人を掲載する企業を選択してください。選択すると企業情報が自動入力されます。"
                    : "Select the company that will post this vacancy. Company information will be auto-filled."}
                </p>
              </div>

              {/* Provider Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowProviderDropdown(!showProviderDropdown)}
                  className="flex h-12 w-full items-center cursor-pointer justify-between rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 shadow-sm transition hover:border-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:hover:border-slate-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/20"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    {isLoadingProviders ? (
                      <div className="flex items-center gap-2">
                        <Loader className="animate-spin w-4 h-4" />
                        Loading Providers...
                      </div>
                    ) : selectedProviderId ? (
                      <>
                        <Building2 className="h-4 w-4 flex-shrink-0 text-indigo-500" />

                        <span className="truncate font-medium">
                          {selectedProvider?.company_name ||
                            selectedProvider?.name ||
                            "Selected Provider"}
                        </span>
                      </>
                    ) : (
                      <span className="text-slate-400">
                        {lang === "ja"
                          ? "企業を選択してください..."
                          : "Select a provider..."}
                      </span>
                    )}
                  </span>

                  <ChevronDown className="h-4 w-4 flex-shrink-0 text-slate-400" />
                </button>

                {showProviderDropdown && (
                  <div className="absolute z-20 mt-1 max-h-64 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
                    {/* Search Input */}
                    <div className="border-b border-slate-200 p-3 dark:border-slate-700">
                      <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <input
                          type="text"
                          value={providerSearch}
                          onChange={(e) => setProviderSearch(e.target.value)}
                          placeholder={
                            lang === "ja"
                              ? "企業名で検索..."
                              : "Search by company name..."
                          }
                          className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-400 dark:focus:border-indigo-500 dark:focus:bg-slate-800"
                          autoFocus
                        />
                      </div>
                    </div>

                    {/* Provider List */}
                    <div className="max-h-48 overflow-y-auto">
                      {isLoadingProviders ? (
                        <div className="flex items-center justify-center py-8">
                          <RefreshCw className="h-5 w-5 animate-spin text-slate-400" />
                        </div>
                      ) : filteredProviders.length === 0 ? (
                        <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                          {lang === "ja"
                            ? "企業が見つかりません"
                            : "No providers found"}
                        </div>
                      ) : (
                        filteredProviders.map((provider) => (
                          <button
                            key={provider.id}
                            type="button"
                            onClick={() => handleProviderSelect(provider)}
                            className={`flex w-full items-center gap-3 cursor-pointer px-4 py-3 text-left transition hover:bg-slate-50 dark:hover:bg-slate-700 ${
                              selectedProviderId === provider.id
                                ? "bg-indigo-50 dark:bg-indigo-900/30"
                                : ""
                            }`}
                          >
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700">
                              <Building2 className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                                {provider.company_name || provider.name}
                              </p>

                              <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                                {provider.contactPerson || provider.email}
                              </p>
                            </div>

                            {selectedProviderId === provider.id && (
                              <span className="flex-shrink-0 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                                {lang === "ja" ? "選択中" : "Selected"}
                              </span>
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Selected Provider Info */}
              {selectedProviderId && (
                <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-800 dark:bg-indigo-900/20">
                  <div className="flex items-center gap-2 text-sm font-medium text-indigo-700 dark:text-indigo-300">
                    <User className="h-4 w-4" />

                    {lang === "ja" ? "選択中の企業" : "Selected Provider"}
                  </div>

                  <div className="mt-2 grid gap-2 text-sm text-slate-700 dark:text-slate-300 sm:grid-cols-2">
                    <div>
                      <span className="font-medium">
                        {lang === "ja" ? "企業名: " : "Company: "}
                      </span>

                      {formData.companyName || "-"}
                    </div>

                    <div>
                      <span className="font-medium">
                        {lang === "ja" ? "担当者: " : "Contact: "}
                      </span>

                      {formData.contactPerson || "-"}
                    </div>

                    <div>
                      <span className="font-medium">Email: </span>

                      {formData.contactEmail || "-"}
                    </div>

                    <div>
                      <span className="font-medium">
                        {lang === "ja" ? "Provider ID: " : "Provider ID: "}
                      </span>

                      {selectedProviderId}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Header / Stats */}
          {mode === "edit" && (
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
          )}

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
              {/* Company Info Section */}
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

              {/* Position */}
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

              {/* Job Description */}
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

              {/* Requirements */}
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

              {/* Location */}
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

              {/* Schedule */}
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

              {/* Benefits */}
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

              {/* Application */}
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

              {/* Contact */}
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

          {/* Footer */}
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
  "h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-200 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/20 dark:disabled:bg-slate-700 dark:disabled:text-slate-400";

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
