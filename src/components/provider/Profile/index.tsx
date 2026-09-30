"use client";

import type { ChangeEvent, FocusEvent, ReactNode } from "react";

import {
  AlertCircle,
  ArrowLeft,
  Briefcase,
  Building2,
  CheckCircle2,
  Edit2,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  User,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useProviderProfile } from "./hook";

// Shared tokens: keep in sync with vacancies.tsx / provider-dashboard.tsx
const PANEL = "rounded-[14px] bg-white/70 ring-1 ring-black/5";

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-800/50 focus-visible:ring-offset-1";

const BTN = `inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-[12px] px-4 text-sm font-medium transition-colors disabled:opacity-60 ${FOCUS}`;

const BTN_PRIMARY = `${BTN} bg-teal-800 text-white ring-1 ring-teal-800 hover:bg-teal-700`;

const BTN_SECONDARY = `${BTN} bg-white/80 text-slate-700 ring-1 ring-black/10 hover:bg-white`;

const INPUT_BASE =
  "w-full rounded-[12px] bg-white px-3.5 py-2.5 text-sm placeholder:text-slate-500 transition-colors focus:outline-none focus:ring-2";

const INPUT_OK = "ring-1 ring-black/10 focus:ring-teal-800/50";

const INPUT_ERROR = "ring-1 ring-red-300 focus:ring-red-500/50";

const LINK = `rounded text-teal-800 underline-offset-2 hover:underline ${FOCUS}`;

const INDUSTRIES = [
  {
    value: "IT & Telecommunications",
    labelKey: "industries.itTelecommunications",
  },
  {
    value: "Manufacturing",
    labelKey: "industries.manufacturing",
  },
  {
    value: "Retail & Wholesale",
    labelKey: "industries.retailWholesale",
  },
  {
    value: "Services",
    labelKey: "industries.services",
  },
  {
    value: "Finance & Insurance",
    labelKey: "industries.financeInsurance",
  },
  {
    value: "Construction & Real Estate",
    labelKey: "industries.constructionRealEstate",
  },
  {
    value: "Healthcare & Welfare",
    labelKey: "industries.healthcareWelfare",
  },
  {
    value: "Education",
    labelKey: "industries.education",
  },
  {
    value: "Transportation & Logistics",
    labelKey: "industries.transportationLogistics",
  },
  {
    value: "Hospitality & Tourism",
    labelKey: "industries.hospitalityTourism",
  },
  {
    value: "Other",
    labelKey: "industries.other",
  },
] as const;

type LinkKind = "email" | "tel" | "url";

/** Builds a safe href for read-only values, or null when it shouldn't be a link. */
function linkFor(kind: LinkKind | undefined, raw: string): string | null {
  const value = raw.trim();
  if (!kind || !value) return null;

  if (kind === "email") return `mailto:${value}`;
  if (kind === "tel") return `tel:${value.replace(/[^\d+]/g, "")}`;

  // url: allow only http(s); add https:// to bare domains; reject other schemes
  if (/^https?:\/\//i.test(value)) return value;
  if (/^[a-z][a-z0-9+.-]*:/i.test(value)) return null;
  return `https://${value}`;
}

export default function ProviderProfile() {
  const router = useRouter();
  const t = useTranslations("provider.profile");

  const {
    lang,
    profile,
    profileStatus,
    formData,
    loading,
    saving,
    isEditing,
    setIsEditing,
    handleInputChange,
    handleBlur,
    saveProfile,
    cancelEdit,
    getFieldError,
  } = useProviderProfile();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#f4f5f8] text-[#1b1c21]">
        <div role="status" className="flex flex-col items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/80 ring-1 ring-black/5">
            <Loader2
              className="h-5 w-5 animate-spin text-teal-800"
              aria-hidden="true"
            />
          </div>
          <p className="text-sm font-medium text-slate-500">{t("loading")}</p>
        </div>
      </div>
    );
  }

  const completion = Math.min(
    100,
    Math.max(0, Number(profileStatus.completionPercentage) || 0),
  );

  const isComplete = Boolean(profileStatus.isComplete);
  const companyName = profile?.companyName?.trim() || "";
  const initial = companyName ? Array.from(companyName)[0].toUpperCase() : "";

  const industryLabel = (() => {
    const match = INDUSTRIES.find((i) => i.value === formData.industry);
    return match ? t(match.labelKey) : formData.industry;
  })();

  // Shared props for every editable/readable field
  const common = {
    isEditing,
    onChange: handleInputChange,
    onBlur: handleBlur,
  };

  return (
    <div className="min-h-screen bg-[#f4f5f8] text-[#1b1c21] antialiased">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <section className={`mb-6 p-5 sm:p-6 ${PANEL}`}>
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div
                aria-hidden="true"
                className="grid h-14 w-14 shrink-0 place-items-center rounded-[14px] bg-teal-800/5 text-2xl font-semibold text-teal-800 ring-1 ring-teal-800/10"
              >
                {initial || <Building2 className="h-6 w-6" />}
              </div>

              <div className="min-w-0">
                <p className="text-sm text-slate-500">{t("companyProfile")}</p>

                <h1 className="break-words text-2xl font-semibold leading-tight tracking-tight md:text-3xl">
                  {companyName || t("companyInformation")}
                </h1>

                <p className="mt-1 max-w-2xl text-sm text-slate-500">
                  {t("description")}
                </p>
              </div>
            </div>

            {!isEditing && (
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      lang === "ja"
                        ? "/provider-dashboard"
                        : "/en/provider-dashboard",
                    )
                  }
                  className={BTN_SECONDARY}
                >
                  <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {t("dashboard")}
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className={BTN_PRIMARY}
                >
                  <Edit2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {t("editProfile")}
                </button>
              </div>
            )}
          </div>
        </section>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          {/* Main column */}
          <div className="space-y-6">
            <Section
              title={t("companyInformation")}
              icon={<Building2 className="h-4 w-4" />}
            >
              <div className="grid gap-x-8 gap-y-5 md:grid-cols-2">
                <Field
                  {...common}
                  label={t("companyName")}
                  name="companyName"
                  value={formData.companyName}
                  placeholder={t("placeholders.companyName")}
                  required
                  icon={<Building2 className="h-4 w-4" />}
                  error={getFieldError("companyName")}
                />

                <Field
                  {...common}
                  label={t("phone")}
                  name="phone"
                  value={formData.phone}
                  placeholder={t("placeholders.phone")}
                  required
                  icon={<Phone className="h-4 w-4" />}
                  error={getFieldError("phone")}
                  linkKind="tel"
                />

                <Field
                  {...common}
                  label={t("address")}
                  name="address"
                  value={formData.address}
                  placeholder={t("placeholders.address")}
                  required
                  icon={<MapPin className="h-4 w-4" />}
                  error={getFieldError("address")}
                />

                <Field
                  {...common}
                  label={t("website")}
                  name="website"
                  value={formData.website}
                  placeholder={t("placeholders.website")}
                  icon={<Globe className="h-4 w-4" />}
                  error={getFieldError("website")}
                  linkKind="url"
                />

                {isEditing ? (
                  <div>
                    <label
                      htmlFor="industry"
                      className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-700"
                    >
                      {t("industry")}
                      <span className="text-red-700" aria-hidden="true">
                        *
                      </span>
                    </label>

                    <select
                      id="industry"
                      name="industry"
                      value={formData.industry}
                      aria-required="true"
                      onChange={handleInputChange}
                      className={`${INPUT_BASE} ${INPUT_OK}`}
                    >
                      <option value="">{t("selectIndustry")}</option>

                      {INDUSTRIES.map((industry) => (
                        <option key={industry.value} value={industry.value}>
                          {t(industry.labelKey)}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <ReadValue label={t("industry")} value={industryLabel} />
                )}
              </div>
            </Section>

            <Section
              title={t("recruitmentContact")}
              icon={<User className="h-4 w-4" />}
            >
              <div className="grid gap-x-8 gap-y-5 md:grid-cols-2">
                <Field
                  {...common}
                  label={t("contactPerson")}
                  name="contact_person"
                  value={formData.contact_person}
                  placeholder={t("placeholders.contactPerson")}
                  required
                  icon={<User className="h-4 w-4" />}
                  error={getFieldError("contact_person")}
                />

                <Field
                  {...common}
                  label={t("contactPhone")}
                  name="contact_person_phone"
                  value={formData.contact_person_phone}
                  placeholder={t("placeholders.contactPhone")}
                  required
                  icon={<Phone className="h-4 w-4" />}
                  error={getFieldError("contact_person_phone")}
                  linkKind="tel"
                />

                <Field
                  {...common}
                  label={t("contactEmail")}
                  name="contact_person_email"
                  value={formData.contact_person_email}
                  placeholder={t("placeholders.contactEmail")}
                  required
                  icon={<Mail className="h-4 w-4" />}
                  error={getFieldError("contact_person_email")}
                  linkKind="email"
                />
              </div>
            </Section>

            <Section
              title={t("hiringInformation")}
              icon={<Briefcase className="h-4 w-4" />}
            >
              <div className="space-y-5">
                <Field
                  {...common}
                  label={t("hiringNeeds")}
                  name="hiring_needs"
                  value={formData.hiring_needs}
                  placeholder={t("placeholders.hiringNeeds")}
                  rows={4}
                />

                <Field
                  {...common}
                  label={t("notes")}
                  name="notes"
                  value={formData.notes}
                  placeholder={t("placeholders.notes")}
                  rows={4}
                />
              </div>
            </Section>
          </div>

          {/* Sidebar: appears first on mobile, sticky on desktop */}
          <aside className="order-first space-y-6 lg:sticky lg:top-6 lg:order-none">
            {/* Completion */}
            <section
              role="status"
              className={`relative overflow-hidden p-5 pl-6 ${PANEL}`}
            >
              <span
                aria-hidden="true"
                className={`absolute inset-y-0 left-0 w-1.5 ${
                  isComplete ? "bg-emerald-600" : "bg-amber-600"
                }`}
              />

              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p
                    className={`flex items-center gap-1.5 text-sm font-medium ${
                      isComplete ? "text-emerald-700" : "text-amber-700"
                    }`}
                  >
                    {isComplete ? (
                      <CheckCircle2
                        className="h-4 w-4 shrink-0"
                        aria-hidden="true"
                      />
                    ) : (
                      <AlertCircle
                        className="h-4 w-4 shrink-0"
                        aria-hidden="true"
                      />
                    )}
                    {isComplete ? t("profileComplete") : t("profileIncomplete")}
                  </p>

                  {!isComplete && (
                    <p className="mt-1 text-sm text-slate-500">
                      {t("completionPercentage", {
                        percentage: profileStatus.completionPercentage,
                      })}
                    </p>
                  )}
                </div>

                <p className="font-mono text-2xl font-semibold tabular-nums">
                  {completion}%
                </p>
              </div>

              <div
                aria-hidden="true"
                className="mt-4 h-1.5 overflow-hidden rounded-full bg-black/5"
              >
                <div
                  className={`h-full rounded-full ${
                    isComplete ? "bg-emerald-600" : "bg-amber-600"
                  }`}
                  style={{ width: `${completion}%` }}
                />
              </div>
            </section>

            {/* Account (read-only) */}
            <section className={`p-5 ${PANEL}`}>
              <div className="space-y-4">
                <ReadValue label={t("registeredUser")} value={profile?.name} />
                <ReadValue
                  label={t("email")}
                  value={profile?.email}
                  linkKind="email"
                />
              </div>
            </section>
          </aside>
        </div>

        {/* Save bar (edit mode) */}
        {isEditing && (
          <div
            className={`sticky bottom-4 z-10 mt-6 flex justify-end gap-2 bg-white/90 p-3 backdrop-blur-md ${PANEL}`}
          >
            <button
              type="button"
              onClick={cancelEdit}
              disabled={saving}
              className={BTN_SECONDARY}
            >
              <X className="h-4 w-4 shrink-0" aria-hidden="true" />
              {t("cancel")}
            </button>

            <button
              type="button"
              onClick={() => void saveProfile()}
              disabled={saving}
              className={BTN_PRIMARY}
            >
              {saving ? (
                <Loader2
                  className="h-4 w-4 shrink-0 animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <Save className="h-4 w-4 shrink-0" aria-hidden="true" />
              )}

              {saving ? t("saving") : t("saveChanges")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className={`p-5 sm:p-6 ${PANEL}`}>
      <div className="mb-5 flex items-center gap-3">
        <div
          aria-hidden="true"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-teal-800/5 text-teal-800/70 ring-1 ring-teal-800/10"
        >
          {icon}
        </div>

        <h2 className="text-lg font-semibold">{title}</h2>
      </div>

      {children}
    </section>
  );
}

type FieldProps = {
  label: string;
  name: string;
  value: string;
  placeholder: string;
  isEditing: boolean;
  required?: boolean;
  icon?: ReactNode;
  error?: string;
  rows?: number;
  linkKind?: LinkKind;
  onChange: (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

/** Editable input in edit mode, plain read-only value otherwise. */
function Field(props: FieldProps) {
  const {
    label,
    name,
    value,
    placeholder,
    isEditing,
    required,
    icon,
    error,
    rows,
    linkKind,
    onChange,
    onBlur,
  } = props;

  if (!isEditing) {
    return (
      <div className={rows ? "" : "min-w-0"}>
        <ReadValue
          label={label}
          value={value}
          icon={icon}
          linkKind={linkKind}
          multiline={Boolean(rows)}
        />
      </div>
    );
  }

  const errorId = `${name}-error`;
  const fieldClass = `${INPUT_BASE} ${error ? INPUT_ERROR : INPUT_OK}`;

  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-700"
      >
        {icon && (
          <span aria-hidden="true" className="text-slate-500">
            {icon}
          </span>
        )}
        {label}

        {required && (
          <span className="text-red-700" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {rows ? (
        <textarea
          id={name}
          name={name}
          value={value}
          placeholder={placeholder}
          rows={rows}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onChange={onChange}
          onBlur={onBlur}
          className={`${fieldClass} resize-none`}
        />
      ) : (
        <input
          id={name}
          name={name}
          value={value}
          placeholder={placeholder}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onChange={onChange}
          onBlur={onBlur}
          className={fieldClass}
        />
      )}

      {error && (
        <p id={errorId} className="mt-1.5 text-xs text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

function ReadValue({
  label,
  value,
  icon,
  linkKind,
  multiline = false,
}: {
  label: string;
  value?: string | null;
  icon?: ReactNode;
  linkKind?: LinkKind;
  multiline?: boolean;
}) {
  const t = useTranslations("provider.profile");

  const text = value?.trim() ?? "";
  const href = linkFor(linkKind, text);

  return (
    <div className="min-w-0">
      <p className="flex items-center gap-1.5 text-xs text-slate-500">
        {icon && (
          <span aria-hidden="true" className="[&>svg]:h-3.5 [&>svg]:w-3.5">
            {icon}
          </span>
        )}
        {label}
      </p>

      <p
        className={`mt-1 break-words text-sm ${
          text ? "font-medium" : "text-slate-500"
        } ${multiline ? "max-w-[75ch] whitespace-pre-wrap leading-7" : ""}`}
      >
        {!text ? (
          t("notProvided")
        ) : href ? (
          <a
            href={href}
            className={LINK}
            {...(linkKind === "url"
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            {text}
          </a>
        ) : (
          text
        )}
      </p>
    </div>
  );
}